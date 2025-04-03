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
      **Task Description:**
      ${description}

      **Guidelines:**
      - Understand the Task: Grasp the main objective, goals, requirements, constraints, and expected output.
      - Minimal Changes: If an existing prompt is provided, improve it only if it's simple. For complex prompts, enhance clarity and add missing elements without altering the original structure.
      - Reasoning Before Conclusions**: Encourage reasoning steps before any conclusions are reached. ATTENTION! If the user provides examples where the reasoning happens afterward, REVERSE the order! NEVER START EXAMPLES WITH CONCLUSIONS!
          - Reasoning Order: Call out reasoning portions of the prompt and conclusion parts (specific fields by name). For each, determine the ORDER in which this is done, and whether it needs to be reversed.
          - Conclusion, classifications, or results should ALWAYS appear last.
      - Examples: Include high-quality examples if helpful, using placeholders [in brackets] for complex elements.
          - What kinds of examples may need to be included, how many, and whether they are complex enough to benefit from placeholders.
      - Clarity and Conciseness: Use clear, specific language. Avoid unnecessary instructions or bland statements.
      - Formatting: Use markdown features for readability. DO NOT USE CODE BLOCKS UNLESS SPECIFICALLY REQUESTED.
      - Preserve User Content: If the input task or prompt includes extensive guidelines or examples, preserve them entirely, or as closely as possible. If they are vague, consider breaking down into sub-steps. Keep any details, guidelines, examples, variables, or placeholders provided by the user.
      - Constants: DO include constants in the prompt, as they are not susceptible to prompt injection. Such as guides, rubrics, and examples.
      - Output Format: Explicitly the most appropriate output format, in detail. This should include length and syntax (e.g. short sentence, paragraph, JSON, etc.)
          - For tasks outputting well-defined or structured data (classification, JSON, etc.) bias toward outputting a JSON.
          - JSON should never be wrapped in code blocks unless explicitly requested.

      
      The final prompt you output should adhere to the following structure below. Do not include any additional commentary, only output the completed system prompt. SPECIFICALLY, do not include any additional messages at the start or end of the prompt. (e.g. no "---")

      [Concise instruction describing the task - this should be the first line in the prompt, no section header]

      [Additional details as needed.]

      [Optional sections with headings or bullet points for detailed steps.]

      **Steps [optional]:**
      [optional: a detailed breakdown of the steps necessary to accomplish the task]

      **Output Format:**
      [Specifically call out how the output should be formatted, be it response length, structure e.g. JSON, markdown, etc]

      **Examples [optional]:**
      [Optional: 1-3 well-defined examples with placeholders if necessary. Clearly mark where examples start and end, and what the input and output are. User placeholders as necessary.]
      [If the examples are shorter than what a realistic example is expected to be, make a reference with () explaining how real examples should be longer / shorter / different. AND USE PLACEHOLDERS! ]

      **Notes [optional]:**
      [optional: edge cases, details, and an area to call or repeat out specific important considerations]
    `;

    const messages: any = [
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content: prompt,
      },
    ];
    const response: any = await FmService.getChatCompletionFromGpt(messages);
    // const formattedText = markdownFormatter.formatText(response.content);
    // return formattedText;
    return this.improvePrompt(
      marked(response.content?.replaceAll?.('\n', '<br>'))
    );
    // return marked(response.content?.replaceAll?.('\n', '<br>'));
  },
  async improvePrompt(existingPrompt: any) {
    const prompt = stripIndents`
      **Prompt:**
      ${existingPrompt}

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
      { role: 'system', content: 'You are a helpful assistant.' },
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
