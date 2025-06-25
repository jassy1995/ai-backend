import openai from "../lib/openai";
import OpenAI from "openai";
import { toolsSchema } from "../helpers/tools";
import { stripIndents } from "common-tags";

const FmService = {
  async getCompletionFromGpt(prompt: string) {
    const response = await openai.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 2000,
      prompt,
    });
    return response.choices[0].text;
  },
  async getChatCompletionFromGpt(
    messages: OpenAI.Chat.ChatCompletionMessage[],
    useTools: boolean = false
  ) {
    const options: any = {
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages,
    };
    if (useTools) {
      options.store = true;
      options.tools = toolsSchema;
    }
    const response = await openai.chat.completions.create(options);
    return response.choices[0].message;
  },
  async getChatCompletionStreamFromGpt(messages: any[]) {
    messages = this.appendSystemMessage(messages);
    const options: any = {
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 4000,
      messages,
      stream: true,
      tools: toolsSchema,
      tool_choice: "auto",
    };
    return openai.chat.completions.create(options);
  },
  async *streamCompletionFromGpt({
    messages,
  }: {
    messages: any[];
  }): AsyncGenerator<string, void, unknown> {
    messages = this.appendSystemMessage(messages);
    const stream: any = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 4000,
      messages,
      stream: true,
      response_format: { type: "text" },
    } as any);
    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) yield content;
    }
  },
  appendSystemMessage(messages: any[]) {
    const systemMessage = stripIndents`
      You are a helpful assistant.
      You have access to various tools.
      `;
    // Respond with only the answer, no extra commentary.
    if (messages[0].role === "system")
      messages[0] = { role: "system", content: systemMessage };
    else messages.unshift({ role: "system", content: systemMessage });
    return messages;
  },
};

export default FmService;
