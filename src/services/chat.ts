import { stripIndents } from "common-tags";
import FmService from "./fm";
import ChatDao from "../dao/chat";
import { functionHandlers } from "../helpers/tools";
import { valueToString } from "../helpers/utils";

const ChatService = {
  async getMessages(args: any) {
    return ChatDao.getMessages(args);
  },
  async getChat(args: any) {
    return ChatDao.getChat(args);
  },
  async createChat(data: any) {
    return ChatDao.createChat(data);
  },
  async createMessage(data: any) {
    return ChatDao.createMessage(data);
  },
  update(args: any, data: any) {
    return ChatDao.update(args, data);
  },
  async getTitle(messages: any[]) {
    const prompt = stripIndents`
    Review the provided transcript closely and identify the central theme or primary subject of the chat between the human and the AI bot. Then, generate a 2-word title that succinctly encapsulates the core essence of their dialogue. Focus on the most significant keywords or themes that are repeatedly mentioned throughout the chat. Provide only the 2-word title as your response.

    Transcript:
    ${messages.map(
      (m) => `${m.role === "user" ? "Human:" : "Bot:"} ${m.content}\n`
    )}

    Your response:
    `;
    const response = await FmService.getCompletionFromGpt(prompt);
    return response?.replace?.(/["']/gi, "");
  },

  async updateChatTitleIfNeeded(chatId: any) {
    if (!chatId) return;
    const messages = await this.getMessages({ chat: chatId });
    if (!messages) return;
    const nonSystemMessages = messages.filter((m: any) => m.role !== "system");
    if (nonSystemMessages.length === 2) {
      const title = await this.getTitle(nonSystemMessages);
      if (title) {
        await this.update({ _id: chatId }, { title });
      }
    }
  },
  async *chatMessengerWithTools(
    messages: any
  ): AsyncGenerator<string, void, unknown> {
    const systemMessage = stripIndents`
      You are Maxwell, an AI assistant equipped with real-time function-calling tools (weather, time, stocks, etc.).

      Guidelines:
      ## Content
      - Leverage the appropriate tool whenever it improves accuracy or recency.
      - Deliver concise, precise, and fact-checked answers.

      ## Formatting (Markdown)
      - Begin with an H1 title that summarises the answer.
      - Use sub-headings (##) to structure sections.
      - Apply bullet/numbered lists for clarity where helpful.

      ## Notes
      - Do not answer questtion that are not related to tools you have.

      Provide only the formatted answer without any tool-call annotations or extra commentary.
    `;

    if (messages[0].role === "system")
      messages[0] = { role: "system", content: systemMessage };
    else messages.unshift({ role: "system", content: systemMessage });

    const stream: any = await FmService.getChatCompletionStreamFromGpt(
      messages
    );

    let responseText: string = "";
    let toolCalls: any[] = [];

    for await (const chunk of stream) {
      try {
        const delta = chunk.choices[0].delta;

        if (delta && delta.content) {
          responseText += delta.content;
        } else if (delta && delta.tool_calls) {
          const tcchunklist = delta.tool_calls;
          for (const tcchunk of tcchunklist) {
            if (toolCalls.length <= tcchunk.index) {
              toolCalls.push({
                id: "",
                type: "function",
                function: { name: "", arguments: "" },
              });
            }
            const tc = toolCalls[tcchunk.index];

            if (tcchunk.id) {
              tc["id"] += tcchunk.id;
            }
            if (tcchunk.function.name) {
              tc["function"]["name"] += tcchunk.function.name;
            }
            if (tcchunk.function.arguments) {
              tc["function"]["arguments"] += tcchunk.function.arguments;
            }
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    }

    if (toolCalls.length > 0) {
      messages.push({ tool_calls: toolCalls, role: "assistant" });

      for (const toolCall of toolCalls) {
        const functionName = toolCall["function"]["name"];
        const functionArgs = JSON.parse(toolCall["function"]["arguments"]);
        const functionResponse = await functionHandlers(
          functionName,
          functionArgs
        );
        messages.push({
          tool_call_id: toolCall["id"],
          role: "tool",
          name: functionName,
          content: functionResponse,
        });
      }
    } else if (responseText.trim().length > 0) {
      messages.push({ role: "assistant", content: responseText });
    }

    for await (const chunk of FmService.streamCompletionFromGpt({ messages })) {
      yield chunk;
    }
  },
  async *chatMessengerWithWebSearch(
    messages: any
  ): AsyncGenerator<string, void, unknown> {
    const systemMessage = stripIndents`
      You are Maxwell, an AI assistant with real-time web-search capabilities.

      When answering:
      # Structure
      ## Markdown output
      - Start with an H1 title.
      - Organise topics with sub-headings (e.g ** sub-headings **).
      - Use bullet or numbered lists for clarity (Markdown format).
      - Cite each external fact immediately in the format [source]URL.

      # Content
      - Keep the response detailed, precise, and fact-checked.
      - Invoke the web_search tool whenever you need the latest information.
      - Cite each external fact immediately in the format [source]URL.

      Return only the formatted answer—omit any additional commentary or system annotations.
    `;

    if (messages[0].role === "system")
      messages[0] = { role: "system", content: systemMessage };
    else messages.unshift({ role: "system", content: systemMessage });

    for await (const chunk of FmService.streamWebSearchCompletionFromGpt({
      messages,
    })) {
      yield chunk;
    }
  },
};

export default ChatService;
