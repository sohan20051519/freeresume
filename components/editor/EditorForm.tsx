import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { GoogleGenAI } from '@google/genai';
import { Experience, Education, Project, Certification, Language } from '../../types';

const generateId = () => `id-${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper component for Accordion sections
const AccordionSection: React.FC<{
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
}> = ({ title, children, actions }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-gray-100 rounded-xl shadow-neumorphic-sm transition-all duration-300">
            <button
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700 hover:bg-gray-200/50 rounded-t-xl"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <div className="flex items-center space-x-2">
                    {actions}
                    <svg
                        className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </button>
            {isOpen && <div className="p-4 border-t border-gray-200">{children}</div>}
        </div>
    );
};

// Reusable Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}
const Input: React.FC<InputProps> = ({ label, ...props }) => (
    <div className={props.className}>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <input
            {...props}
            className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg shadow-neumorphic-sm-inset focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow"
        />
    </div>
);

// Main Editor Form Component
const EditorForm: React.FC = () => {
    const { state, dispatch } = useResume();
    const { data } = state;
    const [aiIsLoading, setAiIsLoading] = useState<Record<string, boolean>>({});

    const handleAITask = async (taskKey: string, prompt: string, action: (result: string) => void) => {
        setAiIsLoading(prev => ({ ...prev, [taskKey]: true }));
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            action(response.text);
        } catch (error) {
            console.error(`Error with AI task ${taskKey}:`, error);
            alert(`Failed to generate content. Please ensure your API key is correctly configured.`);
        } finally {
            setAiIsLoading(prev => ({ ...prev, [taskKey]: false }));
        }
    };
    
    // --- PERSONAL INFO ---
    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { [e.target.name]: e.target.value } });
    };

    // --- SUMMARY ---
    const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch({ type: 'UPDATE_SUMMARY', payload: e.target.value });
    };
    const generateSummaryWithAI = () => {
        const prompt = `Based on the job title "${data.personalInfo.jobTitle}" and the following experiences: ${data.experience.map(e => `${e.jobTitle} at ${e.company}`).join(', ')}, write a compelling and professional resume summary of 2-3 sentences.`;
        handleAITask('summary', prompt, (result) => dispatch({ type: 'UPDATE_SUMMARY', payload: result }));
    };

    // --- EXPERIENCE ---
    const handleExperienceChange = (id: string, field: keyof Experience, value: string | string[]) => {
        const updatedExperience = data.experience.find(exp => exp.id === id);
        if (updatedExperience) {
            dispatch({ type: 'UPDATE_EXPERIENCE', payload: { ...updatedExperience, [field]: value } });
        }
    };
    
    const addExperience = () => dispatch({ type: 'ADD_EXPERIENCE', payload: { id: generateId(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: [''] } });
    const removeExperience = (id: string) => dispatch({ type: 'REMOVE_EXPERIENCE', payload: id });

    const generateExperienceDescriptionWithAI = (exp: Experience) => {
        const prompt = `For a resume, write 3-4 concise, action-oriented bullet points for the role of "${exp.jobTitle}" at "${exp.company}". Focus on achievements and responsibilities. Output each bullet point on a new line.`;
        handleAITask(`experience_${exp.id}`, prompt, (result) => {
             handleExperienceChange(exp.id, 'description', result.split('\n').filter(line => line.trim() !== '').map(line => line.replace(/^- /, '')));
        });
    };
    
    // --- PROJECTS ---
    const handleProjectChange = (id: string, field: keyof Project, value: string | string[]) => {
        const updatedProject = data.projects.find(p => p.id === id);
        if (updatedProject) {
            dispatch({ type: 'UPDATE_PROJECT', payload: { ...updatedProject, [field]: value } });
        }
    };
    const addProject = () => dispatch({ type: 'ADD_PROJECT', payload: { id: generateId(), name: '', link: '', description: [''] } });
    const removeProject = (id: string) => dispatch({ type: 'REMOVE_PROJECT', payload: id });
    const generateProjectDescriptionWithAI = (proj: Project) => {
        const prompt = `For a resume project section, write 2-3 concise, action-oriented bullet points for a project named "${proj.name}". Focus on the tech stack used and the problems solved. Output each bullet point on a new line.`;
        handleAITask(`project_${proj.id}`, prompt, (result) => {
             handleProjectChange(proj.id, 'description', result.split('\n').filter(line => line.trim() !== '').map(line => line.replace(/^- /, '')));
        });
    };

    // --- EDUCATION ---
    const handleEducationChange = (id: string, field: keyof Education, value: string) => {
        const updatedEducation = data.education.find(edu => edu.id === id);
        if (updatedEducation) {
            dispatch({ type: 'UPDATE_EDUCATION', payload: { ...updatedEducation, [field]: value } });
        }
    };

    const addEducation = () => dispatch({ type: 'ADD_EDUCATION', payload: { id: generateId(), institution: '', degree: '', location: '', startDate: '', endDate: '' } });
    const removeEducation = (id:string) => dispatch({ type: 'REMOVE_EDUCATION', payload: id });

    // --- SKILLS ---
    const [newSkill, setNewSkill] = useState('');
    const addSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSkill.trim()) {
            dispatch({ type: 'ADD_SKILL', payload: { id: generateId(), name: newSkill.trim() } });
            setNewSkill('');
        }
    };
    const removeSkill = (id: string) => dispatch({ type: 'REMOVE_SKILL', payload: id });
    const generateSkillsWithAI = () => {
        const prompt = `Based on the job title "${data.personalInfo.jobTitle}", suggest 8-10 relevant technical and soft skills for a resume. List them separated by commas.`;
        handleAITask('skills', prompt, (result) => {
            const skillsToAdd = result.split(',').map(s => s.trim()).filter(s => s);
            skillsToAdd.forEach(skillName => {
                if (!data.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
                    dispatch({ type: 'ADD_SKILL', payload: { id: generateId(), name: skillName } });
                }
            });
        });
    };

    // --- CERTIFICATIONS ---
    const handleCertificationChange = (id: string, field: keyof Certification, value: string) => {
        const updatedCertification = data.certifications.find(c => c.id === id);
        if (updatedCertification) {
            dispatch({ type: 'UPDATE_CERTIFICATION', payload: { ...updatedCertification, [field]: value } });
        }
    };
    const addCertification = () => dispatch({ type: 'ADD_CERTIFICATION', payload: { id: generateId(), name: '', organization: '', date: '' } });
    const removeCertification = (id: string) => dispatch({ type: 'REMOVE_CERTIFICATION', payload: id });

    // --- LANGUAGES ---
    const handleLanguageChange = (id: string, field: keyof Language, value: string) => {
        const updatedLanguage = data.languages.find(l => l.id === id);
        if (updatedLanguage) {
            dispatch({ type: 'UPDATE_LANGUAGE', payload: { ...updatedLanguage, [field]: value } });
        }
    };
    const addLanguage = () => dispatch({ type: 'ADD_LANGUAGE', payload: { id: generateId(), name: '', proficiency: '' } });
    const removeLanguage = (id: string) => dispatch({ type: 'REMOVE_LANGUAGE', payload: id });


    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-200 pb-3 mb-6">Resume Editor</h2>

            <AccordionSection title="👤 Personal Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" name="fullName" value={data.personalInfo.fullName} onChange={handlePersonalInfoChange} />
                    <Input label="Job Title" name="jobTitle" value={data.personalInfo.jobTitle} onChange={handlePersonalInfoChange} />
                    <Input label="Email" name="email" type="email" value={data.personalInfo.email} onChange={handlePersonalInfoChange} />
                    <Input label="Phone" name="phone" type="tel" value={data.personalInfo.phone} onChange={handlePersonalInfoChange} />
                    <Input label="LinkedIn Profile" name="linkedin" value={data.personalInfo.linkedin} onChange={handlePersonalInfoChange} />
                    <Input label="Personal Website" name="website" value={data.personalInfo.website} onChange={handlePersonalInfoChange} />
                    <Input label="Address" name="address" value={data.personalInfo.address} onChange={handlePersonalInfoChange} className="sm:col-span-2" />
                </div>
            </AccordionSection>

            <AccordionSection title="📝 Professional Summary" actions={
                <button onClick={generateSummaryWithAI} disabled={aiIsLoading['summary']} className="px-3 py-1 text-xs bg-brand-primary text-white rounded-md shadow-md hover:bg-brand-secondary disabled:bg-gray-400 transition-colors">
                    {aiIsLoading['summary'] ? 'Generating...' : '✨ Auto-generate'}
                </button>
            }>
                <textarea
                    name="summary"
                    rows={5}
                    value={data.summary}
                    onChange={handleSummaryChange}
                    className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg shadow-neumorphic-sm-inset focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="Write a brief summary about your professional background..."
                />
            </AccordionSection>

            <AccordionSection title="💼 Work Experience">
                <div className="space-y-4">
                    {data.experience.map((exp) => (
                        <div key={exp.id} className="p-4 rounded-lg border border-gray-200 bg-white/50">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="Job Title" value={exp.jobTitle} onChange={(e) => handleExperienceChange(exp.id, 'jobTitle', e.target.value)} />
                                <Input label="Company" value={exp.company} onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)} />
                                <Input label="Location" value={exp.location} onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Start Date" value={exp.startDate} onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)} />
                                    <Input label="End Date" value={exp.endDate} onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    value={exp.description.join('\n')}
                                    onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value.split('\n'))}
                                    className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg shadow-neumorphic-sm-inset focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    placeholder="Describe your responsibilities and achievements, one per line."
                                />
                                <div className="flex justify-between items-center mt-2">
                                     <button onClick={() => generateExperienceDescriptionWithAI(exp)} disabled={aiIsLoading[`experience_${exp.id}`]} className="px-3 py-1 text-xs bg-brand-primary text-white rounded-md shadow-md hover:bg-brand-secondary disabled:bg-gray-400 transition-colors">
                                        {aiIsLoading[`experience_${exp.id}`] ? 'Generating...' : '✨ AI Bullets'}
                                    </button>
                                    <button onClick={() => removeExperience(exp.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={addExperience} className="w-full mt-2 py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-neumorphic-sm hover:shadow-neumorphic-sm-inset transition-shadow">
                        + Add Experience
                    </button>
                </div>
            </AccordionSection>

            <AccordionSection title="🚀 Projects">
                <div className="space-y-4">
                    {data.projects.map((proj) => (
                        <div key={proj.id} className="p-4 rounded-lg border border-gray-200 bg-white/50">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="Project Name" value={proj.name} onChange={(e) => handleProjectChange(proj.id, 'name', e.target.value)} />
                                <Input label="Project Link" value={proj.link} onChange={(e) => handleProjectChange(proj.id, 'link', e.target.value)} />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={proj.description.join('\n')}
                                    onChange={(e) => handleProjectChange(proj.id, 'description', e.target.value.split('\n'))}
                                    className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg shadow-neumorphic-sm-inset focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    placeholder="Describe your project, one bullet point per line."
                                />
                                <div className="flex justify-between items-center mt-2">
                                     <button onClick={() => generateProjectDescriptionWithAI(proj)} disabled={aiIsLoading[`project_${proj.id}`]} className="px-3 py-1 text-xs bg-brand-primary text-white rounded-md shadow-md hover:bg-brand-secondary disabled:bg-gray-400 transition-colors">
                                        {aiIsLoading[`project_${proj.id}`] ? 'Generating...' : '✨ AI Bullets'}
                                    </button>
                                    <button onClick={() => removeProject(proj.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button onClick={addProject} className="w-full mt-2 py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-neumorphic-sm hover:shadow-neumorphic-sm-inset transition-shadow">
                        + Add Project
                    </button>
                </div>
            </AccordionSection>

            <AccordionSection title="🎓 Education">
                <div className="space-y-4">
                    {data.education.map((edu) => (
                        <div key={edu.id} className="p-4 rounded-lg border border-gray-200 bg-white/50">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="Institution" value={edu.institution} onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)} />
                                <Input label="Degree" value={edu.degree} onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)} />
                                <Input label="Location" value={edu.location} onChange={(e) => handleEducationChange(edu.id, 'location', e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                     <Input label="Start Date" value={edu.startDate} onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)} />
                                     <Input label="End Date" value={edu.endDate} onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)} />
                                </div>
                            </div>
                             <div className="text-right mt-2">
                                <button onClick={() => removeEducation(edu.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                            </div>
                        </div>
                    ))}
                    <button onClick={addEducation} className="w-full mt-2 py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-neumorphic-sm hover:shadow-neumorphic-sm-inset transition-shadow">
                        + Add Education
                    </button>
                </div>
            </AccordionSection>
            
            <AccordionSection title="✨ Skills" actions={
                 <button onClick={generateSkillsWithAI} disabled={aiIsLoading['skills']} className="px-3 py-1 text-xs bg-brand-primary text-white rounded-md shadow-md hover:bg-brand-secondary disabled:bg-gray-400 transition-colors">
                    {aiIsLoading['skills'] ? 'Suggesting...' : '✨ Auto-suggest'}
                </button>
            }>
                 <div className="flex flex-wrap gap-2 mb-4">
                    {data.skills.map(skill => (
                        <span key={skill.id} className="flex items-center bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                            {skill.name}
                            <button onClick={() => removeSkill(skill.id)} className="ml-2 text-gray-500 hover:text-gray-800">
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                <form onSubmit={addSkill} className="flex gap-2">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a new skill"
                        className="flex-grow p-3 bg-gray-100 text-gray-800 rounded-lg shadow-neumorphic-sm-inset focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                    <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary transition-colors">
                        Add
                    </button>
                </form>
            </AccordionSection>

             <AccordionSection title="🏆 Certifications">
                 <div className="space-y-4">
                    {data.certifications.map((cert) => (
                        <div key={cert.id} className="p-4 rounded-lg border border-gray-200 bg-white/50">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="Certificate Name" value={cert.name} onChange={(e) => handleCertificationChange(cert.id, 'name', e.target.value)} />
                                <Input label="Issuing Organization" value={cert.organization} onChange={(e) => handleCertificationChange(cert.id, 'organization', e.target.value)} />
                                <Input label="Date Issued" value={cert.date} onChange={(e) => handleCertificationChange(cert.id, 'date', e.target.value)} className="sm:col-span-2" />
                            </div>
                             <div className="text-right mt-2">
                                <button onClick={() => removeCertification(cert.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                            </div>
                        </div>
                    ))}
                    <button onClick={addCertification} className="w-full mt-2 py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-neumorphic-sm hover:shadow-neumorphic-sm-inset transition-shadow">
                        + Add Certification
                    </button>
                </div>
            </AccordionSection>

            <AccordionSection title="🌐 Languages">
                <div className="space-y-4">
                    {data.languages.map((lang) => (
                        <div key={lang.id} className="p-4 rounded-lg border border-gray-200 bg-white/50">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="Language" value={lang.name} onChange={(e) => handleLanguageChange(lang.id, 'name', e.target.value)} />
                                <Input label="Proficiency" value={lang.proficiency} onChange={(e) => handleLanguageChange(lang.id, 'proficiency', e.target.value)} placeholder="e.g., Native, Fluent, Professional" />
                            </div>
                             <div className="text-right mt-2">
                                <button onClick={() => removeLanguage(lang.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                            </div>
                        </div>
                    ))}
                    <button onClick={addLanguage} className="w-full mt-2 py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-neumorphic-sm hover:shadow-neumorphic-sm-inset transition-shadow">
                        + Add Language
                    </button>
                </div>
            </AccordionSection>
        </div>
    );
};

export default EditorForm;