
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { ResumeData } from '../types';
import ChatbotModal from '../components/chatbot/ChatbotModal';
import { getAIService } from '../services/aiService';
import { AIError } from '../services/aiErrors';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { dispatch } = useResume();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [parsingMessage, setParsingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const messageIntervalRef = useRef<number | null>(null);

    const loadingMessages = [
        "Warming up the AI engine...",
        "Analyzing resume layout and structure...",
        "Extracting key sections: experience, education...",
        "Identifying skills and expertise...",
        "Cross-referencing achievements and roles...",
        "Finalizing the structured data...",
        "Almost there, polishing the details..."
    ];

    const startMessageCarousel = () => {
        let index = 0;
        setParsingMessage(loadingMessages[index]);
        messageIntervalRef.current = window.setInterval(() => {
            index = (index + 1) % loadingMessages.length;
            setParsingMessage(loadingMessages[index]);
        }, 2500);
    };

    const stopMessageCarousel = () => {
        if (messageIntervalRef.current) {
            clearInterval(messageIntervalRef.current);
            messageIntervalRef.current = null;
        }
    };

    useEffect(() => {
        // Cleanup interval on component unmount
        return () => {
            stopMessageCarousel();
        };
    }, []);

    const parseResumeWithAI = async (file: File) => {
        try {
            const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const result = reader.result as string;
                    // remove the prefix `data:mime/type;base64,`
                    resolve(result.substring(result.indexOf(',') + 1));
                };
                reader.onerror = error => reject(error);
            });

            const base64Data = await fileToBase64(file);

            const aiService = getAIService();
            const filePart = { mimeType: file.type, data: base64Data };
            const processedData = await aiService.parseResume(filePart);
            
            dispatch({ type: 'SET_RESUME_DATA', payload: processedData as ResumeData });
            navigate('/templates');

        } catch (err) {
            console.error("AI Parsing Error:", err);
            if (err instanceof AIError) {
                setError(err.message);
            } else {
                setError("The AI failed to parse the resume. The file might be in an unsupported format or corrupted. Please try a different file or build your resume from scratch.");
            }
            stopMessageCarousel();
            setIsParsing(false);
        }
    };


    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setIsParsing(true);
        startMessageCarousel();

        await parseResumeWithAI(file);
        
        // Reset file input value to allow re-uploading the same file
        event.target.value = '';
    };

    return (
        <div className="min-h-screen bg-gray-100 overflow-hidden">
            {isChatOpen && <ChatbotModal onClose={() => setIsChatOpen(false)} />}
            {isParsing && (
                <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-neumorphic text-center max-w-sm">
                        <svg className="animate-spin h-10 w-10 text-brand-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 transition-opacity duration-500">{parsingMessage}</h3>
                        <p className="text-gray-600 mt-2 text-sm">This may take up to a minute for complex resumes. Thanks for your patience!</p>
                    </div>
                </div>
            )}
             {error && (
                <div className="fixed top-5 right-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                    <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                    </button>
                </div>
            )}

            <div className="relative w-full">
                {/* Background Shapes */}
                <div className="absolute top-0 -left-16 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.md"
                />

                {/* Hero Section */}
                <main className="relative z-10 container mx-auto px-6 text-center pt-20 pb-32">
                    <div className="bg-white/30 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-gray-200/50 inline-block">
                        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
                            Re-imagine Your Resume with AI
                        </h2>
                        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Upload your existing resume for an instant AI-powered redesign, or build one from scratch with our intelligent editor.
                        </p>
                        <div className="mt-8 flex flex-col justify-center items-center gap-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isParsing}
                                    className="px-8 py-4 bg-white text-brand-primary font-bold rounded-full shadow-neumorphic-sm hover:shadow-neumorphic-sm-inset transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50"
                                >
                                    Upload & Re-design
                                </button>
                                <button
                                    onClick={() => navigate('/editor')}
                                    disabled={isParsing}
                                    className="px-8 py-4 bg-white text-brand-primary font-bold rounded-full shadow-neumorphic-sm hover:shadow-neumorphic-sm-inset transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50"
                                >
                                    Build From Scratch
                                </button>
                            </div>
                            <span className="font-semibold text-gray-500 my-2">or</span>
                            <button
                                onClick={() => setIsChatOpen(true)}
                                disabled={isParsing}
                                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.839 8.839 0 01-4.082-.973l-1.453.968a1 1 0 01-1.343-1.343l.968-1.453A8.839 8.839 0 012 10c0-4.418 4.418-8 10-8s8 3.582 8 8zm-4.146-2.146a.5.5 0 00-.708-.708L10 10.293 7.854 8.146a.5.5 0 10-.708.708L9.293 11l-2.147 2.146a.5.5 0 00.708.708L10 11.707l2.146 2.147a.5.5 0 00.708-.708L10.707 11l2.147-2.146z" clipRule="evenodd" />
                                </svg>
                                <span>Create with AI Chat</span>
                            </button>
                        </div>
                         <p className="text-xs text-gray-500 mt-3">Supports PDF, DOCX, TXT, and MD files for upload</p>
                    </div>
                </main>

                {/* Features Section */}
                <section className="relative z-10 container mx-auto px-6 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            title="AI-Powered Content" 
                            description="Let our AI generate compelling summaries and bullet points tailored to your industry." 
                        />
                        <FeatureCard 
                            title="ATS-Friendly Templates" 
                            description="Choose from over 20 professionally designed, recruiter-approved templates." 
                        />
                        <FeatureCard 
                            title="Live Preview & Edit" 
                            description="See your changes in real-time as you build your perfect resume, hassle-free." 
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};


const FeatureCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="bg-gray-100 p-8 rounded-3xl shadow-neumorphic transition-shadow duration-300 hover:shadow-neumorphic-inset">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
    </div>
);


export default LandingPage;