
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../../context/ResumeContext';
import { ResumeData } from '../../types';
import { resumeSchema } from '../../constants';
import { getAIService, ChatSession } from '../../services/aiService';
import { AIError } from '../../services/aiErrors';
import { processParsedResume } from '../../utils';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface ChatbotModalProps {
    onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ onClose }) => {
    const { dispatch } = useResume();
    const navigate = useNavigate();
    const [chat, setChat] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const systemInstruction = `You are a friendly and professional AI assistant for freeresume.me. Your goal is to help users build a resume by asking them questions one by one. 
    1. Start by greeting the user and asking for their full name and desired job title.
    2. Then, ask for other personal details (email, phone, etc.).
    3. After that, ask for their professional summary, then work experience (one job at a time), education, skills, and any other sections like projects, certifications, or languages.
    4. Keep your questions clear and concise.
    5. When the user indicates they are finished providing information, you MUST respond with ONLY a valid JSON object containing all the collected data. This JSON object must strictly follow this JSON schema: ${JSON.stringify(resumeSchema)}.
    6. Do not include any other text, greetings, or markdown formatting (like \`\`\`json) in your final JSON response. The response must be the raw JSON object itself.`;

    useEffect(() => {
        // Set the initial greeting message without initializing the AI chat.
        setMessages([{ role: 'model', text: "Hello! I'm your AI assistant. I'll ask you a series of questions to build your resume.\n\nFirst, what is your full name and desired job title?" }]);
    }, []);

    useEffect(() => {
        // Scroll to the latest message
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || isFinishing) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            let currentChat = chat;
            if (!currentChat) {
                const aiService = getAIService();
                currentChat = aiService.startChat(systemInstruction);
                setChat(currentChat);
            }
            const responseText = await currentChat.sendMessage(currentInput);
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (err) {
            console.error("Error sending message:", err);
            const errorMessage = err instanceof AIError ? err.message : "Sorry, I encountered an error. Please try again.";
            setError(errorMessage);
            setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFinish = async () => {
        if (isLoading || isFinishing) return;
        
        setIsFinishing(true);
        setIsLoading(true);
        setError(null);
        
        const finishMessage: Message = { role: 'user', text: "I've provided all my information. Please generate the complete resume data as a JSON object now, following your system instructions. Do not add any other text." };
        setMessages(prev => [...prev, finishMessage]);

        try {
            let currentChat = chat;
            if (!currentChat) {
                const aiService = getAIService();
                currentChat = aiService.startChat(systemInstruction);
                setChat(currentChat);
            }

            const responseText = await currentChat.sendMessage(finishMessage.text);
            let jsonString = responseText.trim();
            
            // Clean the response in case the model wraps it in markdown
            if (jsonString.startsWith('```json')) {
                jsonString = jsonString.substring(7, jsonString.length - 3).trim();
            }

            const parsedJson = JSON.parse(jsonString) as Partial<ResumeData>;
            const processedData = processParsedResume(parsedJson);
            
            dispatch({ type: 'SET_RESUME_DATA', payload: processedData as ResumeData });
            navigate('/templates');

        } catch (err) {
            console.error("Error finalizing resume:", err);
            const errorMessage = err instanceof AIError ? err.message : "The AI failed to create the resume data. You can try asking it to 'generate the JSON now', or close this and build your resume manually.";
            setError(errorMessage);
            setIsLoading(false);
            setIsFinishing(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-gray-100 rounded-2xl shadow-neumorphic w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800 text-lg">AI Resume Assistant</h3>
                    <button onClick={onClose} className="text-2xl p-1 rounded-full text-gray-500 hover:bg-gray-200" aria-label="Close chat">&times;</button>
                </header>

                <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-brand-primary text-white shadow-md' : 'bg-white text-gray-800 shadow-neumorphic-sm'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] p-3 rounded-xl bg-white shadow-neumorphic-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                                </div>
                            </div>
                        </div>
                    )}
                     {error && <p className="text-red-500 text-xs text-center p-2">{error}</p>}
                </div>

                <footer className="p-4 border-t border-gray-200 bg-gray-100">
                     <div className="flex justify-end mb-2">
                        <button 
                            onClick={handleFinish}
                            disabled={isLoading || isFinishing}
                            className="px-4 py-2 text-sm bg-green-500 text-white font-bold rounded-full shadow-md hover:bg-green-600 disabled:bg-gray-400 transition-all"
                        >
                            {isFinishing ? 'Creating...' : 'Finish & Create Resume'}
                        </button>
                    </div>
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isLoading || isFinishing}
                            className="w-full p-3 bg-white text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition placeholder:text-gray-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || isFinishing || !input.trim()}
                            className="p-3 bg-gray-400 text-white rounded-full shadow-md hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            aria-label="Send message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default ChatbotModal;