import { ResumeData } from '../types';
import { OpenAIService } from './openAIService';
import { AIError, GenericAIError } from './aiErrors';

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

let aiServiceInstance: AIService | null = null;

export const getAIService = (): AIService => {
    if (!aiServiceInstance) {
        // As requested, directly using the OpenAI service with a hardcoded key.
        // This is not secure and not recommended for production environments.
        aiServiceInstance = new OpenAIService();
    }
    return aiServiceInstance;
};
