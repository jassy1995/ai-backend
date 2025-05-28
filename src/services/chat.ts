import { stripIndents } from 'common-tags';
import { marked } from 'marked';
import markdownFormatter from '../lib/markdown';
import FmService from './fm';

const ChatService = {
  async getKeywords(message: string) {
    const prompt = stripIndents`
      Please read the user's message provided below. Your task is to analyze the content to determine if it discusses anything closely related to any of the specified topics: Politics, Presidency, Contractual, Enforcement, Legal, Jurisdiction, Compliance, Legalities, Economy, Economic, Government, Expenditure, Revenue, Quarter, Financial, Education, Health, Infrastructure, Security, Society, Global issues, Agriculture, Banking, Budget, Business, Capital Importation, Consumption, Corruption, Debt, Elections, Energy, Forex, GDP, International relations, National Assembly, Happiness, Oil and Gas, Pensions, Population, Poverty, Terrorism, Social issues, Sports, Stock Market, Taxes, Telecoms, Trade, Unemployment, VAT, Global countries, Transportation, FAAC, IGR, Culture. Follow these steps

      1. If the message is related to the topics listed, identify up to five keywords that capture the core themes or subjects within the message.
      2. Rank these keywords in order of their relevance to the main topic of the message, with the most significant keyword first.
      3. Present your findings in a valid JSON array format like this example: ["MostRelevantKeyword", "SecondKeyword", "ThirdKeyword", "FourthKeyword", "FifthKeyword"]. Ensure that the keywords chosen offer a comprehensive overview of the message's topic.
      4. If the message does not relate to any of the specified topics, return null.

      Consider the following when analyzing the message:
      - The context and specific details mentioned that relate to the aforementioned topics.
      - The user's intended purpose for the analysis, such as research, summarization, or categorization.
      - The target audience for your analysis and the required level of detail.
      - Adhere to any constraints such as word limit or tone (formal or informal).

      Example Message: "The recent budget cuts have affected the education sector, leading to reduced funding for public schools and scholarships."

      Example Output: ["Education", "Budget Cuts", "Public Schools", "Funding", "Scholarships"]

      Note: If you encounter any ambiguous information, provide the best match based on the context given. Your output must be a valid JSON array string or a null value, with no additional text or characters.

      User message:
      ${message}

      Assistant:
    `;
    const response = (await FmService.getCompletionFromGpt(prompt)).trim();
    return JSON.parse(response);
  },
  async getResponse1(messages: any[]) {
    const system = stripIndents`
      As "Agent 007", an AI expert on Academic affairs developed by Joseph, you are tasked with researching and providing data-driven insights on any academic courses or topics. Your responses should be fully detail by being precise and rooted in the latest verified data. Please ensure that your answer is strictly related to Academics and contextually relevant to the inquiry.

      When responding:
      - **Structure your response in markdown format**, utilizing headings, bullet points, and bold text for emphasis where necessary.
      - **Provide current and accurate data** relevant to the topic, including any significant historical context to aid in understanding trends or changes.
      - **Ensure that the content is concise and insightful**, focusing on providing information that supports decision-making processes.
      - **Maintain relevance** by directly addressing the inquiry and staying within the scope of the specified Nigerian topics.

      Please respond with a markdown-formatted analysis, considering the latest available data and any pertinent historical context. Your analysis should be brief yet comprehensive, aiding in fullly addressing the inquiry.
    `;
    if (messages[0].role === 'system')
      messages[0] = { role: 'system', content: system };
    else messages.unshift({ role: 'system', content: system });
    const response = await FmService.getChatCompletionFromGpt(messages);
    return response.content;
  },
  async getResponse(messages: any[]) {
    const system = stripIndents`
      As "Bambi", an AI expert on Nigerian affairs developed by the team at Statisense, you are tasked with analyzing and providing data-driven insights on Nigerian topics such as politics, elections, national debt, budget, agriculture, forex, demographics, education, religion, GDP, sports, security, stock market, and energy. Your responses should assist decision-makers by being precise and rooted in the latest verified data. Please ensure that your analysis is strictly related to Nigeria and contextually relevant to the inquiry.

      When responding:
      - **Structure your response in markdown format**, utilizing headings, bullet points, and bold text for emphasis where necessary.
      - **Provide current and accurate data** relevant to the topic, including any significant historical context to aid in understanding trends or changes.
      - **Ensure that the content is concise and insightful**, focusing on providing information that supports decision-making processes.
      - **Maintain relevance** by directly addressing the inquiry and staying within the scope of the specified Nigerian topics.

      Please respond with a markdown-formatted analysis, considering the latest available data and any pertinent historical context. Your analysis should be brief yet comprehensive, aiding in informed decision-making.
    `;
    if (messages[0].role === 'system')
      messages[0] = { role: 'system', content: system };
    else messages.unshift({ role: 'system', content: system });
    const response = await FmService.getChatCompletionFromGpt(messages);
    return response.content;
  },
  async getResponseWithContext(messages: any[], context: string) {
    const system = stripIndents`
      As "Bambi", an AI expert on Nigerian affairs developed by the team at Statisense, you are tasked with analyzing and providing data-driven insights on Nigerian topics such as politics, elections, national debt, budget, agriculture, forex, demographics, education, religion, GDP, sports, security, stock market, and energy. Your responses should assist decision-makers by being precise and rooted in the latest verified data. Please ensure that your analysis is strictly related to Nigeria and contextually relevant to the inquiry.

      **Context for Response:**
      ${context}

      When responding:
      - **Structure your response in markdown format**, utilizing headings, bullet points, and bold text for emphasis where necessary.
      - **Provide current and accurate data** relevant to the topic, including any significant historical context to aid in understanding trends or changes.
      - **Ensure that the content is concise and insightful**, focusing on providing information that supports decision-making processes.
      - **Maintain relevance** by directly addressing the inquiry and staying within the scope of the specified Nigerian topics.

      Please respond with a markdown-formatted analysis, considering the latest available data and any pertinent historical context. Your analysis should be brief yet comprehensive, aiding in informed decision-making.
    `;
    if (messages[0].role === 'system')
      messages[0] = { role: 'system', content: system };
    else messages.unshift({ role: 'system', content: system });
    const response = await FmService.getChatCompletionFromGpt(messages);
    return response.content;
  },

  async getTitle(messages: any[]) {
    const prompt = stripIndents`
      Review the provided transcript closely and identify the central theme or primary subject of the chat between the human and the AI bot. Then, generate a 2-word title that succinctly encapsulates the core essence of their dialogue. Focus on the most significant keywords or themes that are repeatedly mentioned throughout the chat. Provide only the 2-word title as your response.

      Transcript:
      ${messages.map(
        (m) => `${m.role === 'user' ? 'Human:' : 'Bot:'} ${m.content}\n`
      )}

      Your response:
    `;
    const response = await FmService.getCompletionFromGpt(prompt);
    return response?.replace?.(/["']/gi, '');
  },
  async generatePromptFromQuestion(description: string) {
    const prompt = stripIndents`
      <description>
      ${description}
      </description>

      You are an expert in prompt engineering. Your task is to assist users in crafting effective and high-performing prompts based on their descriptions of what they want to achieve.
      
      Instructions:

      1. Carefully analyze the user's input to identify:
        - The core objective
        - Any specific goals or tasks
        - Relevant requirements or conditions
        - Possible constraints (e.g. tone, format, length)
        - The desired format or structure of the final output

      2. Based on this analysis, create a precise, structured prompt that guides a language model to produce the desired results.
      3. Ensure the output prompt is:
        - Clear and unambiguous
        - Tailored to the user's goals
        - Optimized for relevance and performance

      Include the final structured prompt as your output.
    `;

    const messages: any = [
      { role: 'system', content: 'You are a helpful assistant. Only return the expected output. Do not include any preamble, either at the beginning or the end of the output.' },
      {
        role: 'user',
        content: prompt,
      },
    ];
    const response: any = await FmService.getChatCompletionFromGpt(messages);
    return response.content?.replaceAll?.('\n', '<br>');
  },
  async improvePrompt(userPrompt: any) {
    const prompt = stripIndents`
      <prompt>
      ${userPrompt}
      </prompt>

      **Guidelines:**
      You are a prompt expert that helps users optimize their prompts for better performance and 
      results. When given a system prompt, you evaluate its clarity, specificity, context, and potential ambiguities. Your 
      task is to refine the prompt so that the resulting output from the language model is more accurate, relevant, 
      and useful for the user's intended purpose.

      Consider the following details to optimize the prompt effectively:
      1. The specific task you want the language model to perform (e.g., answer a question, generate text, summarize information).
      2. The context or background information that may be relevant to the task.
      3. Your target audience or the level of detail required in the response.
      4. Any constraints or special considerations (e.g., word limit, tone, formal/informal language).
    `;

    const messages: any = [
      { role: 'system', content: 'You are a helpful assistant. Only return the expected output. Do not include any preamble, either at the beginning or the end of the output.' },
      {
        role: 'user',
        content: prompt,
      },
    ];
    const response: any = await FmService.getChatCompletionFromGpt(messages);
    return response.content.replaceAll('\n', '<br>');
  },
};

export default ChatService;
