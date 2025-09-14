import React from 'react';
import { ResumeData } from '../../../types';

const CompactTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

    const SidebarSection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
        <section className="mb-6">
            <h2 className="text-sm font-bold uppercase text-brand-secondary tracking-wider mb-2">{title}</h2>
            <div className="text-xs space-y-1 text-gray-700">{children}</div>
        </section>
    );

    return (
        <div className="h-full flex font-sans bg-white text-gray-800 text-sm">
            {/* Left Column (Sidebar) */}
            <aside className="w-1/3 bg-gray-50 p-6">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold">{personalInfo.fullName}</h1>
                    <p className="text-md text-gray-600">{personalInfo.jobTitle}</p>
                </header>

                <SidebarSection title="Contact">
                    {personalInfo.email && <p>{personalInfo.email}</p>}
                    {personalInfo.phone && <p>{personalInfo.phone}</p>}
                    {personalInfo.address && <p>{personalInfo.address}</p>}
                    {personalInfo.linkedin && <p className="break-all">{personalInfo.linkedin}</p>}
                    {personalInfo.website && <p className="break-all">{personalInfo.website}</p>}
                </SidebarSection>
                
                <SidebarSection title="Skills">
                    <ul className="list-disc list-inside">
                        {skills.map(skill => <li key={skill.id}>{skill.name}</li>)}
                    </ul>
                </SidebarSection>

                <SidebarSection title="Education">
                    {education.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <h3 className="font-semibold">{edu.institution}</h3>
                            <p>{edu.degree}</p>
                            <p className="text-gray-500">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </SidebarSection>
                
                {languages.length > 0 && (
                    <SidebarSection title="Languages">
                        {languages.map(lang => (
                            <p key={lang.id}>{lang.name} <span className="text-gray-500">({lang.proficiency})</span></p>
                        ))}
                    </SidebarSection>
                )}
            </aside>

            {/* Right Column (Main Content) */}
            <main className="w-2/3 p-8">
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-1 mb-2">Summary</h2>
                    <p className="text-sm leading-relaxed">{summary}</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-1 mb-2">Experience</h2>
                     {experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-md font-semibold">{exp.jobTitle}</h3>
                                <p className="text-xs font-mono text-gray-500">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-sm italic text-gray-600">{exp.company} | {exp.location}</p>
                            <ul className="list-disc list-outside ml-5 mt-1 space-y-1 text-sm">
                                {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>

                 {projects.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-1 mb-2">Projects</h2>
                        {projects.map(proj => (
                            <div key={proj.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-md font-semibold">{proj.name}</h3>
                                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-brand-primary hover:underline">View Project</a>}
                                </div>
                                <ul className="list-disc list-outside ml-5 mt-1 space-y-1 text-sm">
                                    {proj.description.map((desc, i) => <li key={i}>{desc}</li>)}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}
                
                {certifications.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-1 mb-2">Certifications</h2>
                        {certifications.map(cert => (
                            <div key={cert.id} className="mb-2">
                                <p className="text-sm"><span className="font-semibold">{cert.name}</span>, {cert.organization} ({cert.date})</p>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
};

export default CompactTemplate;
