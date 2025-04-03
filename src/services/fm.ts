import openai from '../lib/openai';
import OpenAI from 'openai';

const FmService = {
  async getCompletionFromGpt(prompt: string) {
    const response = await openai.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      max_tokens: 2000,
      prompt,
    });
    return response.choices[0].text;
  },
  async getChatCompletionFromGpt(
    messages: OpenAI.Chat.ChatCompletionMessage[]
  ) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      messages,
    });
    return response.choices[0].message;
  },
};

export default FmService;
