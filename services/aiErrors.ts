export class AIError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AIError';
    }
}

export class InvalidApiKeyError extends AIError {
    constructor() {
        super("AI service authentication failed. Please check the API key configuration.");
        this.name = 'InvalidApiKeyError';
    }
}

export class RateLimitError extends AIError {
    constructor() {
        super("The AI service is currently busy due to high traffic. Please try again in a moment.");
        this.name = 'RateLimitError';
    }
}

export class GenericAIError extends AIError {
     constructor(message?: string) {
        super(message || "An unexpected error occurred with the AI service. Please try again.");
        this.name = 'GenericAIError';
    }
}
