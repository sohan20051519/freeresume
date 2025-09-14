import React from 'react';
import { ResumeData } from '../../../types';

interface TemplateProps {
    data: ResumeData;
}

const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

    return (
        <div className="h-full flex font-sans bg-white text-gray-800 text-sm">
            {/* Left Column */}
            <aside className="w-1/3 bg-gray-100 p-8 text-gray-700">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">{personalInfo.fullName}</h1>
                    <p className="text-lg text-brand-primary font-medium mt-1">{personalInfo.jobTitle}</p>
                </div>

                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Contact</h2>
                    <div className="space-y-2 text-xs">
                        {personalInfo.phone && <p>{personalInfo.phone}</p>}
                        {personalInfo.email && <p>{personalInfo.email}</p>}
                        {personalInfo.address && <p>{personalInfo.address}</p>}
                        {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
                        {personalInfo.website && <p>{personalInfo.website}</p>}
                    </div>
                </section>

                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Skills</h2>
                    <ul className="space-y-1 text-sm">
                        {skills.map(skill => (
                            <li key={skill.id}>{skill.name}</li>
                        ))}
                    </ul>
                </section>

                {languages.length > 0 && (
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Languages</h2>
                    <ul className="space-y-1 text-sm">
                        {languages.map(lang => (
                            <li key={lang.id}>{lang.name} <span className="text-xs text-gray-500">({lang.proficiency})</span></li>
                        ))}
                    </ul>
                </section>
                )}
            </aside>

            {/* Right Column */}
            <main className="w-2/3 p-8">
                <section className="mb-6">
                    <h2 className="text-xl font-bold text-brand-secondary border-b-2 border-gray-200 pb-2 mb-3">Summary</h2>
                    <p className="leading-relaxed">{summary}</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-bold text-brand-secondary border-b-2 border-gray-200 pb-2 mb-3">Experience</h2>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-md font-bold text-gray-900">{exp.jobTitle}</h3>
                                <p className="text-xs font-mono text-gray-500">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-sm italic text-gray-700">{exp.company} | {exp.location}</p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>

                {projects.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-xl font-bold text-brand-secondary border-b-2 border-gray-200 pb-2 mb-3">Projects</h2>
                        {projects.map(proj => (
                            <div key={proj.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-md font-bold text-gray-900">{proj.name}</h3>
                                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-brand-primary hover:underline">View Project</a>}
                                </div>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                    {proj.description.map((desc, i) => <li key={i}>{desc}</li>)}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                <section className="mb-6">
                    <h2 className="text-xl font-bold text-brand-secondary border-b-2 border-gray-200 pb-2 mb-3">Education</h2>
                    {education.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-md font-bold text-gray-900">{edu.institution}</h3>
                                <p className="text-xs font-mono text-gray-500">{edu.startDate} - {edu.endDate}</p>
                            </div>
                            <p className="text-sm italic text-gray-700">{edu.degree} | {edu.location}</p>
                        </div>
                    ))}
                </section>

                {certifications.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-brand-secondary border-b-2 border-gray-200 pb-2 mb-3">Certifications</h2>
                        {certifications.map(cert => (
                            <div key={cert.id} className="mb-2">
                                <p className="text-sm"><span className="font-bold">{cert.name}</span>, {cert.organization} ({cert.date})</p>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
};

export default ModernTemplate;