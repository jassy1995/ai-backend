import openai from "../lib/openai";
import OpenAI from "openai";
import { toolsSchema } from "../helpers/tools";

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
    console.log("messages-completion-stream", messages[0]);
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
  async *streamCompletionFromGpt({ messages }: { messages: any[] }) {
    console.log("messages-completion", messages[0]);
    const options: any = {
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 4000,
      messages,
      stream: true,
      response_format: { type: "text" },
    } as any;
    const stream: any = await openai.chat.completions.create(options);
    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) yield content;
    }
  },
  async *streamWebSearchCompletionFromGpt({ messages }: { messages: any[] }) {
    const options: any = {
      model: "gpt-4o-mini-search-preview",
      max_tokens: 4000,
      messages,
      stream: true,
      response_format: { type: "text" },
      web_search_options: {
        search_context_size: "medium",
      },
    } as any;

    const stream: any = await openai.chat.completions.create(options);

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) yield content;
    }
  },
};

export default FmService;
