
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type } from '@google/genai';
import { useResume } from '../context/ResumeContext';
import { ResumeData } from '../types';

const generateId = () => `id-${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;

// Defines the expected JSON structure for the AI model
const resumeSchema = {
    type: Type.OBJECT,
    properties: {
        personalInfo: {
            type: Type.OBJECT,
            properties: {
                fullName: { type: Type.STRING, description: "Full name of the person." },
                jobTitle: { type: Type.STRING, description: "Most recent or desired job title." },
                email: { type: Type.STRING, description: "Email address." },
                phone: { type: Type.STRING, description: "Phone number." },
                address: { type: Type.STRING, description: "City and State, e.g., 'San Francisco, CA'." },
                linkedin: { type: Type.STRING, description: "URL of LinkedIn profile." },
                website: { type: Type.STRING, description: "URL of personal website or portfolio." },
            },
        },
        summary: { type: Type.STRING, description: "The professional summary or objective section." },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    jobTitle: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of responsibilities and achievements as bullet points." },
                },
            },
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                },
            },
        },
        skills: {
            type: Type.ARRAY,
            description: "List of skills.",
            items: {
                type: Type.OBJECT, properties: { name: { type: Type.STRING } }
            },
        },
        projects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    link: { type: Type.STRING },
                    description: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of project details as bullet points." },
                },
            },
        },
        certifications: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    organization: { type: Type.STRING },
                    date: { type: Type.STRING },
                },
            },
        },
        languages: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    proficiency: { type: Type.STRING },
                },
            },
        },
    },
};

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { dispatch } = useResume();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [parsingMessage, setParsingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
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
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

            const filePart = {
                inlineData: {
                    mimeType: file.type,
                    data: base64Data,
                },
            };
    
            const textPart = { text: `Analyze the provided resume. Extract all information and structure it as a JSON object that adheres to the provided schema. If a section is missing (e.g., no projects), provide an empty array. Format dates concisely.` };
            
            const systemInstruction = "You are an expert resume parsing AI. Your sole purpose is to accurately extract information from a resume file and convert it into a structured JSON object based on the provided schema. You must handle various resume formats and layouts gracefully. Do not invent information. If a piece of information is not present, omit it or use an empty value as appropriate for the schema.";

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [filePart, textPart] },
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: resumeSchema,
                }
            });

            const parsedJson = JSON.parse(response.text) as Partial<ResumeData>;

            // Add unique IDs to all array items, which are required by the editor state
            const processedData: Partial<ResumeData> = {
                ...parsedJson,
                experience: parsedJson.experience?.map(e => ({ ...e, id: generateId() })) || [],
                education: parsedJson.education?.map(e => ({ ...e, id: generateId() })) || [],
                skills: parsedJson.skills?.map(s => ({ ...s, name: s.name, id: generateId() })) || [],
                projects: parsedJson.projects?.map(p => ({ ...p, id: generateId() })) || [],
                certifications: parsedJson.certifications?.map(c => ({ ...c, id: generateId() })) || [],
                languages: parsedJson.languages?.map(l => ({ ...l, id: generateId() })) || [],
            };
            
            dispatch({ type: 'SET_RESUME_DATA', payload: processedData as ResumeData });
            navigate('/editor');

        } catch (err) {
            console.error("AI Parsing Error:", err);
            setError("The AI failed to parse the resume. The file might be in an unsupported format or corrupted. Please try a different file or build your resume from scratch.");
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
                            Upload your existing resume for an instant AI-powered redesign, or build a new one from scratch with our intelligent editor.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                             <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isParsing}
                                className="px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Upload & Re-design
                            </button>
                            <span className="font-semibold text-gray-500">or</span>
                            <button
                                onClick={() => navigate('/templates')}
                                disabled={isParsing}
                                className="px-8 py-4 bg-white text-brand-primary font-bold rounded-full shadow-neumorphic-sm hover:shadow-neumorphic-sm-inset transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50"
                            >
                                Build From Scratch
                            </button>
                        </div>
                         <p className="text-xs text-gray-500 mt-3">Supports PDF, DOCX, TXT, and MD files</p>
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
