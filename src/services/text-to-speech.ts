// import InsightDao from '../dao/insight.ts';
// import {
//   CreateCommentBody,
//   CreateCommentReactionBody,
//   CreateInsightBody,
//   CreateInsightReaction,
//   CreateNewsSourceBody,
//   CreateSavedInsightBody,
//   GetAllSavedInsightParams,
//   GetInsightsParams,
//   UpdateCommentBody,
//   UpdateInsightBody,
//   UpdateNewsSourceBody,
// } from '../schemas/insight.ts';
// import FileService from './file.ts';
// import { generateRandomHex } from '../lib/utils.ts';
// import FmService from './fm.ts';
// import { UpdatePreferenceBody } from '../schemas/preference.ts';
// import openai from '../lib/openai.ts';
// import { ElevenLabsClient, stream } from 'elevenlabs';
// import { writers } from '../config/constants.ts';
// // import fs from 'node:fs';
// // import path from 'node:path';
// // import { ensureDir, exists, readFile, writeFile } from "https://deno.land/std/fs/mod.ts";
// // import { join } from "https://deno.land/std/path/mod.ts";
// import { crypto } from "https://deno.land/std/crypto/mod.ts";

// // Constants
// // const AUDIO_DIR = path.join(__dirname, 'audio', 'openai');
// // const AUDIO_METADATA_FILE = path.join(AUDIO_DIR, 'metadata.json');

// // const AUDIO_DIR_OPENAI = join(Deno.cwd(), "audio", "openai");
// // const AUDIO_METADATA_FILE_OPENAI = join(AUDIO_DIR_OPENAI, "metadata.json");

// // const AUDIO_DIR_ELEVENLABS = join(Deno.cwd(), "audio", "elevenlabs");
// // const AUDIO_METADATA_FILE_ELEVENLABS = join(AUDIO_DIR_ELEVENLABS, "metadata.json");


// const client = new ElevenLabsClient({
//   apiKey: Deno.env.get('ELEVENLABS_API_KEY')!,
// });


// const InsightService = {
//   create(insight: Omit<CreateInsightBody, 'media'> & { slug: string; author: string }) {
//     return InsightDao.create(insight);
//   },
//   async getAll(params: GetInsightsParams) {
//     const { page, limit, populate, ...rest } = params;
//     const insights = await InsightDao.getAll({ page, limit, populate, ...rest });
//     const total = await InsightDao.getCount(rest);
//     if (!page) return { insights, total, next: null };
//     const fetched = page && limit ? +page * +limit : 0;
//     const remains = Math.max(total - fetched, 0);
//     const next = remains >= 1 ? +page + 1 : null;
//     return { insights, total, next };
//   },
//   search({ query, limit }: { query: string | string[]; limit?: number }) {
//     return InsightDao.search({ query, limit });
//   },
//   getOne(args: any, { populate = [] }: { populate?: string[] } = {}) {
//     return InsightDao.getOne(args, populate);
//   },
//   getCount(args?: any) {
//     return InsightDao.getCount(args);
//   },
//   update(id: string, data: UpdateInsightBody) {
//     return InsightDao.update(id, data);
//   },
//   async delete(id: string) {
//     const insight = await InsightDao.delete(id);
//     if (!insight) return null;
//     if (insight.media.length > 0) {
//       await Promise.all(insight.media.map(async (name: string) => await FileService.delete(name)));
//     }
//     return insight;
//   },
//   async uploadMedia(files: File[], slug: string): Promise<string[]> {
//     if (!files?.length) return [];
//     return await Promise.all(
//       files.map(async (file) => {
//         const buffer = await file.arrayBuffer();
//         const _buffer = await FileService.compressImage(buffer, 800);
//         const id = generateRandomHex(6);
//         const key = `insights/${slug}-${id}`;
//         return await FileService.upload({ buffer: new Uint8Array(_buffer), contentType: file.type, key });
//       }),
//     );
//   },
//   createComment(data: CreateCommentBody & { user: string; insight: string }) {
//     return InsightDao.createComment(data);
//   },
//   getComment(args: any, populate?: string[]) {
//     return InsightDao.getComment(args, populate);
//   },
//   getComments(args: any, populate?: string[]) {
//     return InsightDao.getComments(args, populate);
//   },
//   getCommentsCount(args: any) {
//     return InsightDao.getCommentsCount(args);
//   },
//   updateComment(args: any, data: UpdateCommentBody, populate?: string[]) {
//     return InsightDao.updateComment(args, data, populate);
//   },
//   deleteComment(id: string) {
//     return InsightDao.deleteComment(id);
//   },
//   createReaction(payload: CreateInsightReaction) {
//     return InsightDao.createReaction(payload);
//   },
//   getReaction(args: any, populate?: string[]) {
//     return InsightDao.getReaction(args, populate);
//   },
//   getReactions(args: any, populate?: string[]) {
//     return InsightDao.getReactions(args, populate);
//   },
//   getReactionsCount(args: any) {
//     return InsightDao.getReactionsCount(args);
//   },
//   updateReaction(args: any, reaction: string) {
//     return InsightDao.updateReaction(args, reaction);
//   },
//   deleteReaction(id: string) {
//     return InsightDao.deleteReaction(id);
//   },
//   createCommentReaction(payload: CreateCommentReactionBody) {
//     return InsightDao.createCommentReaction(payload);
//   },
//   getCommentReaction(args: any, populate?: string[]) {
//     return InsightDao.getCommentReaction(args, populate);
//   },
//   getCommentReactions(args: any, populate?: string[]) {
//     return InsightDao.getCommentReactions(args, populate);
//   },
//   getCommentReactionsCount(args: any) {
//     return InsightDao.getCommentReactionsCount(args);
//   },
//   updateCommentReaction(args: any, reaction: string) {
//     return InsightDao.updateCommentReaction(args, reaction);
//   },
//   deleteCommentReaction(id: string) {
//     return InsightDao.deleteCommentReaction(id);
//   },
//   createSavedInsight(data: CreateSavedInsightBody) {
//     return InsightDao.createSavedInsight(data);
//   },
//   async getSavedInsights(params: GetAllSavedInsightParams) {
//     const insights = await InsightDao.getSavedInsights(params);
//     const { page, limit, user } = params;
//     const total = await InsightDao.getSavedInsightsCount({ user });
//     if (!page) return { insights, total, next: null };
//     const fetched = page && limit ? +page * +limit : 0;
//     const remains = Math.max(total - fetched, 0);
//     const next = remains >= 1 ? +page + 1 : null;
//     return { insights, total, next };
//   },
//   getSavedInsight(args?: any) {
//     return InsightDao.getSavedInsight(args);
//   },
//   deleteSavedInsight(args: any) {
//     return InsightDao.deleteSavedInsight(args);
//   },
//   createNewsSource(data: CreateNewsSourceBody) {
//     return InsightDao.createNewsSource(data);
//   },
//   getNewsSources(args: any, options = {}) {
//     return InsightDao.getNewsSources(args, options);
//   },
//   updateNewsSource(id: string, data: UpdateNewsSourceBody) {
//     return InsightDao.updateNewsSource(id, data);
//   },
//   async generate(text: string) {
//     const prompt = `
//     You are tasked with analyzing the text enclosed within <data></data> tags and categorizing it according to its primary topic. Your output will be used to render all sorts of infographics, charts and other visuals, so follow these steps and guidelines to ensure accurate and detailed results:
    
//     1. Categorization:
//     Select the most relevant category from the following predefined list:
//     africa, agriculture, banking, budget, business, capital-importation, consumption, debt, education, election, energy, forex, gdp, health, international, national-assembly, happiness, oil-and-gas, pension, politics, population, poverty, security-and-terrorism, social, sports, market, tax, telecommunications, trade, unemployment, vat, nigeria, religion, transportation, faac, igr, corruption, technology, economy, world, others, entertainment, geography.
//     - You MUST only pick one category from the categories listed above.
//     - If the text cannot be categorized clearly into any single topic, return null.

//     2. Output Format:
//     For categorized texts, return the result in the following JSON format:
//     {
//       "title": "A concise title summarizing the text (50 characters max)",
//       "excerpt": "A brief overview of the main points (200 characters max)",
//       "body": "A 3-paragraph article about the text: summary, details (with bullet points if applicable), and conclusion (200 words max, Markdown format).",
//       "text": "A breakdown of the data including all key details in text format with paragraphs and bullet points in Markdown format (if it's a list, show all values in the list). (Max 150 words)",
//       "category": "The most relevant category from the list provided",
//       "tags": ["Relevant tags extracted from the text as an array of strings"],
//       "source": "The source of the text, or null if unavailable",
//       "type": "One of the predefined types described below",
//       "query": "A keyword or key phrase relevant to the text for searching related images",
//       "icon": "A Font Awesome icon class name representing the text's topic (e.g., 'fa fa-building')",
//       "data": [
//         {
//           "label": "A consise label that's fit for the data point",
//           "value": "Value of the data point, including its unit or currency if applicable. Ensure the number is formatted number and shortened if too long (e.g. 10,000 to 10k). It must not exceed 5 characters. Use it's serial number as fallback e.g #1.",
//           "raw": "Raw value (e.g., shorten '10,000' to '10k' if over 4 characters)",
//           "unit": "Unit of the data point, if applicable",
//           "percentage": "Percentage of the highest value without the '%' symbol",
//           "content": "Short paragraph (20 words max) describing the data point with its full value",
//           "icon": "A valid Font Awesome 6 icon class (e.g., 'fa fa-building')",
//           "country": "Country code or null if unavailable"
//         }
//         // Add additional items if necessary
//       ],
//       "legend": "Legend required to interpret the data, if applicable"
//     }

//     3. Type Options for type Field:
//     - "bar": Use for ranked data with only one data point.
//     - "list": Use for lists that cannot be ranked.
//     - "text": Use for descriptive data not fitting other types.
//     - "ng-states": Use this if the data is broken down by Nigeria states.
//     - "ng-regions": Use this if the data is broken down by the 6 Nigerian regions.
    
//     4. Special Considerations:
//     - Use formal language and concise phrasing.
//     - Ensure consistency in formatting and adherence to constraints.
//     - Validate all Font Awesome icons to ensure they are from version 6. Use "fa-solid fa-quote-left" as a fallback icon if no match is found.
    
//     <data>
//     ${text}
//     </data>
//   `;
//     const output = await FmService.getCompletionFromGpt({ prompt, json: true });
//     return output ? JSON.parse(output) : output;
//   },
//   getTrendingTags(country: string[]) {
//     return InsightDao.getTrendingTags(country);
//   },
//   getSentiments(category: string) {
//     return InsightDao.getSentiments(category);
//   },
//   updatePreference(data: UpdatePreferenceBody & { id: string }) {
//     return InsightDao.updatePreference(data);
//   },
//   getPreference(args: any) {
//     return InsightDao.getPreference(args);
//   },
//   getLatestInsights(args: any) {
//     return InsightDao.getLatestInsights(args);
//   },
//   getLatestInsightsByAuthor(args: any) {
//     return InsightDao.getLatestInsightsByAuthor(args);
//   },
//   // async getTrendingAudioOpenAI(articles: Array<{ title: string; body: string }>) {
//   //   const audioBuffers = await Promise.all(
//   //     articles.map(async (article) => {
//   //       const titleMp3 = await openai.audio.speech.create({
//   //         model: 'gpt-4o-mini-tts',
//   //         voice: 'nova',
//   //         input: `Title: ${article.title}`,
//   //         instructions: 'Speak in a cheerful and positive tone.',
//   //       });
//   //       const bodyMp3 = await openai.audio.speech.create({
//   //         model: 'gpt-4o-mini-tts',
//   //         voice: 'nova',
//   //         input: article.body,
//   //         instructions: 'Speak in a cheerful and positive tone.',
//   //       });

//   //       const titleBuffer = await titleMp3.arrayBuffer();
//   //       const bodyBuffer = await bodyMp3.arrayBuffer();

//   //       const pauseDuration = 500;
//   //       const pauseSamples = 22050 * pauseDuration / 1000;
//   //       const pauseBuffer = new Uint8Array(pauseSamples).fill(128);

//   //       const combined = new Uint8Array(titleBuffer.byteLength + pauseBuffer.byteLength + bodyBuffer.byteLength);

//   //       combined.set(new Uint8Array(titleBuffer), 0);
//   //       combined.set(pauseBuffer, titleBuffer.byteLength);
//   //       combined.set(new Uint8Array(bodyBuffer), titleBuffer.byteLength + pauseBuffer.byteLength);

//   //       return combined;
//   //     }),
//   //   );

//   //   const articlePause = new Uint8Array(22050 * 1.5).fill(128); // 1.5s pause

//   //   const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0) +
//   //     (audioBuffers.length - 1) * articlePause.byteLength;

//   //   const finalAudio = new Uint8Array(totalLength);
//   //   let offset = 0;

//   //   audioBuffers.forEach((buffer, index) => {
//   //     finalAudio.set(buffer, offset);
//   //     offset += buffer.byteLength;

//   //     if (index < audioBuffers.length - 1) {
//   //       finalAudio.set(articlePause, offset);
//   //       offset += articlePause.byteLength;
//   //     }
//   //   });
//   //   return finalAudio;
//   // },


//   async generateAudio(articles: Array<{ title: string; body: string }>) {
//     const audioBuffers = await Promise.all(
//       articles.map(async (article) => {
//         // Generate title audio
//         const titleMp3 = await openai.audio.speech.create({
//           model: "tts-1",
//           voice: "nova",
//           input: `Title: ${article.title}`,
//           response_format: "mp3",
//         });
//         const titleBuffer = new Uint8Array(await titleMp3.arrayBuffer());
  
//         // Generate body audio
//         const bodyMp3 = await openai.audio.speech.create({
//           model: "tts-1",
//           voice: "nova",
//           input: article.body,
//           response_format: "mp3",
//         });
//         const bodyBuffer = new Uint8Array(await bodyMp3.arrayBuffer());
  
//         // Add 500ms pause between title and body
//         const pauseBuffer = new Uint8Array(22050 * 0.5).fill(0); // Silence for 0.5s
  
//         // Combine title + pause + body
//         const combined = new Uint8Array(titleBuffer.length + pauseBuffer.length + bodyBuffer.length);
//         combined.set(titleBuffer, 0);
//         combined.set(pauseBuffer, titleBuffer.length);
//         combined.set(bodyBuffer, titleBuffer.length + pauseBuffer.length);
//         return combined;
//       }),
//     );
  
//     // Add 1.5s pause between articles
//     const articlePause = new Uint8Array(22050 * 1.5).fill(0); // Silence for 1.5s
//     const finalAudio = new Uint8Array(
//       audioBuffers.reduce((sum, buf) => sum + buf.length, 0) +
//         (audioBuffers.length - 1) * articlePause.length,
//     );
  
//     let offset = 0;
//     audioBuffers.forEach((buffer, index) => {
//       finalAudio.set(buffer, offset);
//       offset += buffer.length;
//       if (index < audioBuffers.length - 1) {
//         finalAudio.set(articlePause, offset);
//         offset += articlePause.length;
//       }
//     });
  
//     return finalAudio;
//   }, 

// async generateId(articles: Array<{ title: string; body: string }>) {
//   const contentString = articles.map((a) => `${a.title}|${a.body}`).join("||");
//   const hashBuffer = await crypto.subtle.digest(
//     "SHA-256",
//     new TextEncoder().encode(contentString),
//   );
//   return Array.from(new Uint8Array(hashBuffer))
//     .map((b) => b.toString(16).padStart(2, "0"))
//     .join("");
// },
// async getTrendingAudioOpenAI(articles: Array<{ title: string; body: string }>) {
//   const audioId = await this.generateId(articles);
//   const s3Key = `audio/${audioId}.mp3`;

//   try {
//     try {
//       return await FileService.readFromS3(s3Key);
//     } catch (error) {
//       if (error.name !== 'NoSuchKey') throw error;
//     }

//     const finalAudio = await this.generateAudio(articles);

//     FileService.upload({
//       buffer: finalAudio,
//       contentType: 'audio/mpeg',
//       key: s3Key
//     }).catch(console.error);

//     return finalAudio;
//   } catch (error) {
//     console.error('Error processing audio:', error);
//     throw error;
//   }
// },
// async getTrendingAudioOpenAI(articles: Array<{ title: string; body: string }>) {
//   // 1. Ensure directory exists
//   await ensureDir(AUDIO_DIR_OPENAI);

//   // 2. Load existing metadata or initialize
//   let metadata: Array<{ id: string; filePath: string }> = [];
//   if (await exists(AUDIO_METADATA_FILE_OPENAI)) {
//     metadata = JSON.parse(await Deno.readTextFile(AUDIO_METADATA_FILE_OPENAI));
//   }

//   // 3. Generate a unique ID (hash of articles)
//   const audioId = await this.generateId(articles);

//   // 4. Check if audio already exists
//   const existingAudio = metadata.find((item) => item.id === audioId);
//   if (existingAudio) {
//     return await Deno.readFile(existingAudio.filePath);
//   }

//   // 5. Generate new audio (only if not cached)
//   const finalAudio = await this.generateAudio(articles);
//   const audioFilePath = join(AUDIO_DIR_OPENAI, `${audioId}.mp3`);

//   // 6. Save audio + update metadata
//   await Deno.writeFile(audioFilePath, finalAudio);
//   metadata.push({ id: audioId, filePath: audioFilePath });
//   await Deno.writeTextFile(AUDIO_METADATA_FILE_OPENAI, JSON.stringify(metadata, null, 2));

//   return finalAudio;
// },
// async getTrendingAudioByElevenLabs(articles: Array<{title: string, body: string}>, author: string) {
//   try {
//     const writer = writers.find((writer) => writer.id === author.trim());
//     if(!writer) return null;
//     const text = articles.map(article => `Title: ${article.title}\n${article.body}`).join('\n');
//     const audioStream = await client.textToSpeech.convertAsStream(writer.voice, {
//         text,
//         model_id: 'eleven_flash_v2_5',
//     });
    
//     const chunks: Uint8Array[] = [];
//     for await (const chunk of audioStream) {
//         chunks.push(chunk);
//     }
//     const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    
//     const result = new Uint8Array(totalLength);
//     let offset = 0;
//     for (const chunk of chunks) {
//         result.set(chunk, offset);
//         offset += chunk.length;
//     }
//     return result;
//   } catch (error) {
//       console.log(error);
//       return null;
//   }
// },

// async getTrendingAudioByElevenLabs(
//   articles: Array<{ title: string; body: string }>,
//   author: string,
// ) {
//   try {
//     // 1. Ensure directory exists
//     await ensureDir(AUDIO_DIR_ELEVENLABS);

//     // 2. Load existing metadata or initialize
//     let metadata: Array<{ id: string; filePath: string }> = [];
//     if (await exists(AUDIO_METADATA_FILE_ELEVENLABS)) {
//       metadata = JSON.parse(await Deno.readTextFile(AUDIO_METADATA_FILE_ELEVENLABS));
//     }

//     // 3. Check if audio already exists for this author
//     const cachedAudio = metadata.find((item) => item.id === author.trim());
//     if (cachedAudio) {
//       return await Deno.readFile(cachedAudio.filePath);
//     }

//     // 4. Generate new audio (only if not cached)
//     const writer = writers.find((w) => w.id === author.trim());

//     if (!writer) return null;
//     const text = articles.map((article) => 
//       `Title: ${article.title}\n${article.body}`
//     ).join("\n");

//     const audioStream = await client.textToSpeech.convertAsStream(writer.voice, {
//       text,
//       model_id: "eleven_flash_v2_5",
//     });

//     // Collect stream chunks
//     const chunks: Uint8Array[] = [];
//     for await (const chunk of audioStream) {
//       chunks.push(chunk);
//     }

//     // Combine chunks into a single Uint8Array
//     const result = new Uint8Array(
//       chunks.reduce((sum, chunk) => sum + chunk.length, 0),
//     );
//     let offset = 0;
//     for (const chunk of chunks) {
//       result.set(chunk, offset);
//       offset += chunk.length;
//     }

//     // 5. Save audio + update metadata
//     const audioFilePath = join(AUDIO_DIR_ELEVENLABS, `${author}.mp3`);
//     await Deno.writeFile(audioFilePath, result);
//     metadata.push({ id: author, filePath: audioFilePath });
//     await Deno.writeTextFile(AUDIO_METADATA_FILE_ELEVENLABS, JSON.stringify(metadata, null, 2));

//     return result;
//   } catch (error) {
//     console.error("Error in getTrendingAudioByElevenLabs:", error);
//     return null;
//   }
// }

// async getTrendingAudioByElevenLabs(
//   articles: Array<{ title: string; body: string }>,
//   author: string,
// ) {
//   try {
//     const authorKey = author.trim();
//     const s3Key = `elevenlabs-audio/${authorKey}.mp3`;

//     // 1. Check if audio already exists in S3 for this author
//     try {
//       const existingAudio = await FileService.readFromS3(s3Key);
//       return existingAudio;
//     } catch (error) {
//       if (error.name !== 'NoSuchKey') throw error;
//       // Continue to generate new audio if not found
//     }

//     // 2. Generate new audio (only if not cached)
//     const writer = writers.find((w) => w.id === authorKey);
//     if (!writer) return null;

//     const text = articles.map((article) => 
//       `Title: ${article.title}\n${article.body}`
//     ).join("\n");

//     const audioStream = await client.textToSpeech.convertAsStream(writer.voice, {
//       text,
//       model_id: "eleven_flash_v2_5",
//     });

//     // Collect stream chunks
//     const chunks: Uint8Array[] = [];
//     for await (const chunk of audioStream) {
//       chunks.push(chunk);
//     }

//     // Combine chunks into a single Uint8Array
//     const result = new Uint8Array(
//       chunks.reduce((sum, chunk) => sum + chunk.length, 0),
//     );
//     let offset = 0;
//     for (const chunk of chunks) {
//       result.set(chunk, offset);
//       offset += chunk.length;
//     }

//     // 3. Save audio to S3 (async - don't await)
//     FileService.upload({
//       buffer: result,
//       contentType: 'audio/mpeg',
//       key: s3Key
//     }).catch(error => console.error('Error saving to S3:', error));

//     return result;
//   } catch (error) {
//     console.error("Error in getTrendingAudioByElevenLabs:", error);
//     return null;
//   }
// }



// };

// export default InsightService;
