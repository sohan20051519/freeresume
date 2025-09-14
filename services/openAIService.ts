
import { AIService, FilePart, ChatSession } from './aiService';
import { ResumeData } from '../types';
import { resumeSchema } from '../constants';
import { processParsedResume } from '../utils';
import { InvalidApiKeyError, RateLimitError, GenericAIError } from './aiErrors';

interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string | Array<{type: string; text?: string; image_url?: {url: string}}>;
}

class OpenAIChatSession implements ChatSession {
    private messages: OpenAIMessage[];
    private service: OpenAIService;

    constructor(systemInstruction: string, service: OpenAIService) {
        this.messages = [{ role: 'system', content: systemInstruction }];
        this.service = service;
    }

    async sendMessage(message: string): Promise<string> {
        this.messages.push({ role: 'user', content: message });
        try {
            const response = await this.service.makeApiCall(this.messages);
            const responseText = response.choices[0].message.content || '';
            this.messages.push({ role: 'assistant', content: responseText });
            return responseText;
        } catch(err) {
            // Remove the user message that caused the error to allow retry
            this.messages.pop();
            throw err;
        }
    }
}

export class OpenAIService implements AIService {
    private apiKey: string;
    private baseUrl = "https://openrouter.ai/api/v1";
    private headers: Record<string, string>;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.headers = {
            "Authorization": `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://free-resumeme.vercel.app/",
            "X-Title": "freeresume",
        };
    }

    private async handleError(response: Response): Promise<never> {
        if (response.status === 401) {
            localStorage.removeItem('openRouterApiKey');
            throw new InvalidApiKeyError();
        } else if (response.status === 429) {
            throw new RateLimitError();
        }
        const errorBody = await response.json().catch(() => ({ error: { message: 'Unknown API error' } }));
        const errorMessage = errorBody?.error?.message || `API request failed with status ${response.status}.`;
        throw new GenericAIError(errorMessage);
    }

    async makeApiCall(messages: OpenAIMessage[], useJsonMode: boolean = false): Promise<any> {
        const body: any = {
            model: "openai/gpt-4o",
            messages: messages,
        };

        if (useJsonMode) {
            body.response_format = { type: "json_object" };
        }

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            await this.handleError(response);
        }

        return await response.json();
    }

    async parseResume(file: FilePart): Promise<Partial<ResumeData>> {
        const imageUrl = `data:${file.mimeType};base64,${file.data}`;
        
        const systemInstruction = `You are an expert resume parsing AI. Your sole purpose is to accurately extract information from a resume file and convert it into a structured JSON object. You must handle various resume formats and layouts gracefully. Do not invent information. If a piece of information is not present, omit it or use an empty value as appropriate for the schema. The output MUST be a valid JSON object that strictly adheres to this schema: ${JSON.stringify(resumeSchema)}`;

        const messages: OpenAIMessage[] = [
            { role: 'system', content: systemInstruction },
            {
                role: 'user',
                content: [
                    {
                        type: "text",
                        text: "Analyze the provided resume image. Extract all information and structure it as a JSON object that adheres to the schema provided in the system prompt. If a section is missing (e.g., no projects), provide an empty array for that key. Format dates concisely."
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: imageUrl
                        }
                    }
                ]
            }
        ];
        
        const response = await this.makeApiCall(messages, true);
        const responseText = response.choices[0].message.content || '{}';
        const parsedJson = JSON.parse(responseText) as Partial<ResumeData>;
        return processParsedResume(parsedJson);
    }

    async generateText(prompt: string): Promise<string> {
        const messages: OpenAIMessage[] = [{ role: 'user', content: prompt }];
        const response = await this.makeApiCall(messages);
        return response.choices[0].message.content || '';
    }

    startChat(systemInstruction: string): ChatSession {
        return new OpenAIChatSession(systemInstruction, this);
    }
}