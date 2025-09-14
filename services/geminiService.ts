import { GoogleGenAI, Chat as GeminiChat } from '@google/genai';
import { AIService, FilePart, ChatSession } from './aiService';
import { ResumeData } from '../types';
import { resumeSchema } from '../constants';
import { processParsedResume } from '../utils';
import { InvalidApiKeyError, RateLimitError, GenericAIError } from './aiErrors';

class GeminiChatSession implements ChatSession {
    private geminiChat: GeminiChat;

    constructor(geminiChat: GeminiChat) {
        this.geminiChat = geminiChat;
    }
    
    private handleError(err: unknown): never {
        if (err instanceof Error) {
            const lowerCaseMessage = err.message.toLowerCase();
            if (lowerCaseMessage.includes('rate limit') || lowerCaseMessage.includes('quota')) {
                throw new RateLimitError();
            } else if (lowerCaseMessage.includes('api key not valid')) {
                throw new InvalidApiKeyError();
            }
        }
        throw new GenericAIError();
    }

    async sendMessage(message: string): Promise<string> {
        try {
            const response = await this.geminiChat.sendMessage({ message });
            return response.text;
        } catch (err) {
            this.handleError(err);
        }
    }
}

export class GeminiService implements AIService {
    private ai: GoogleGenAI;

    constructor(apiKey: string) {
        this.ai = new GoogleGenAI({ apiKey });
    }

    private handleError(err: unknown): never {
        if (err instanceof Error) {
            const lowerCaseMessage = err.message.toLowerCase();
            if (lowerCaseMessage.includes('rate limit') || lowerCaseMessage.includes('quota')) {
                throw new RateLimitError();
            } else if (lowerCaseMessage.includes('api key not valid')) {
                throw new InvalidApiKeyError();
            }
        }
        throw new GenericAIError('The AI failed to process the request. The format might be unsupported or an unknown error occurred.');
    }

    async parseResume(file: FilePart): Promise<Partial<ResumeData>> {
        try {
            const filePart = { inlineData: file };
            const textPart = { text: `Analyze the provided resume. Extract all information and structure it as a JSON object that adheres to the provided schema. If a section is missing (e.g., no projects), provide an empty array. Format dates concisely.` };
            const systemInstruction = "You are an expert resume parsing AI. Your sole purpose is to accurately extract information from a resume file and convert it into a structured JSON object based on the provided schema. You must handle various resume formats and layouts gracefully. Do not invent information. If a piece of information is not present, omit it or use an empty value as appropriate for the schema.";
            
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [filePart, textPart] },
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: resumeSchema,
                }
            });

            const parsedJson = JSON.parse(response.text) as Partial<ResumeData>;
            return processParsedResume(parsedJson);
        } catch (err) {
            this.handleError(err);
        }
    }

    async generateText(prompt: string): Promise<string> {
        try {
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text;
        } catch (err) {
            this.handleError(err);
        }
    }

    startChat(systemInstruction: string): ChatSession {
        const geminiChat = this.ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });
        return new GeminiChatSession(geminiChat);
    }
}
