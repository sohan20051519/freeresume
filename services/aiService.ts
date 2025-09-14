
import { ResumeData } from '../types';
import { GeminiService } from './geminiService';

export interface FilePart {
    mimeType: string;
    data: string; // base64 encoded data
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface ChatSession {
    sendMessage(message: string): Promise<string>;
}

export interface AIService {
    parseResume(file: FilePart): Promise<Partial<ResumeData>>;
    generateText(prompt: string): Promise<string>;
    startChat(systemInstruction: string): ChatSession;
}

/**
 * AI Service Factory.
 * This function exclusively returns an instance of GeminiService to interact with the Google Gemini API.
 * The API key is now handled internally via environment variables within the GeminiService.
 */
export const getAIService = (): AIService => {
    return new GeminiService();
};
