import React from 'react';
import { ResumeData } from '../../../types';

const MonacoTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;
    
    const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <section className="mb-6">
            <h2 className="text-lg font-bold text-indigo-600 uppercase tracking-wider mb-2">{title}</h2>
            {children}
        </section>
    );

    const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <section className="mb-6">
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">{title}</h2>
            {children}
        </section>
    );

    return (
        <div className="h-full flex font-sans bg-white text-gray-800 text-sm">
            {/* Sidebar */}
            <aside className="w-1/3 bg-gray-50 p-6 flex flex-col">
                <header className="text-left mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">{personalInfo.fullName}</h1>
                    <p className="text-md text-gray-600 mt-1">{personalInfo.jobTitle}</p>
                </header>

                <SidebarSection title="Contact">
                    <div className="space-y-1 text-xs">
                        {personalInfo.email && <p className="break-all">{personalInfo.email}</p>}
                        {personalInfo.phone && <p>{personalInfo.phone}</p>}
                        {personalInfo.linkedin && <p className="break-all">{personalInfo.linkedin}</p>}
                        {personalInfo.website && <p className="break-all">{personalInfo.website}</p>}
                    </div>
                </SidebarSection>
                
                <SidebarSection title="Skills">
                    <ul className="text-sm space-y-1">
                        {skills.map(skill => <li key={skill.id}>{skill.name}</li>)}
                    </ul>
                </SidebarSection>

                <SidebarSection title="Education">
                     {education.map(edu => (
                        <div key={edu.id} className="text-sm mb-2">
                            <h3 className="font-semibold">{edu.degree}</h3>
                            <p className="text-xs">{edu.institution}</p>
                            <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </SidebarSection>
            </aside>

            {/* Main Content */}
            <main className="w-2/3 p-8">
                <MainSection title="Summary">
                    <p className="leading-relaxed">{summary}</p>
                </MainSection>

                <MainSection title="Experience">
                     {experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-md font-semibold">{exp.jobTitle}</h3>
                                <p className="text-xs font-mono text-gray-500">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-sm italic text-gray-600">{exp.company}</p>
                            <ul className="list-disc list-outside ml-5 mt-1 space-y-1 text-sm">
                                {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                            </ul>
                        </div>
                    ))}
                </MainSection>

                 {projects.length > 0 && (
                    <MainSection title="Projects">
                        {projects.map(proj => (
                            <div key={proj.id} className="mb-4">
                                <h3 className="text-md font-semibold">{proj.name}</h3>
                                <ul className="list-disc list-outside ml-5 mt-1 space-y-1 text-sm">
                                    {proj.description.map((desc, i) => <li key={i}>{desc}</li>)}
                                </ul>
                            </div>
                        ))}
                    </MainSection>
                )}
            </main>
        </div>
    );
};

export default MonacoTemplate;