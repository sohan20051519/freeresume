import React from 'react';
import { ResumeData } from '../../../types';

const ProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

    const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
        <section className={`mb-6 ${className}`}>
            <h2 className="text-lg font-bold text-brand-primary uppercase tracking-wider mb-3">{title}</h2>
            {children}
        </section>
    );

    return (
        <div className="h-full bg-white font-sans text-gray-800 text-sm p-10">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight">{personalInfo.fullName}</h1>
                <p className="text-xl font-medium text-gray-600 mt-1">{personalInfo.jobTitle}</p>
                 <div className="flex justify-center flex-wrap text-xs mt-4 text-gray-600 gap-x-5">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.address && <span>{personalInfo.address}</span>}
                    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                    {personalInfo.website && <span>{personalInfo.website}</span>}
                </div>
            </header>

            <div className="border-t-2 border-gray-200 pt-6">
                <Section title="Summary">
                    <p className="leading-relaxed">{summary}</p>
                </Section>

                <Section title="Experience">
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-md font-semibold">{exp.jobTitle} at {exp.company}</h3>
                                <p className="text-xs font-mono text-gray-500">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-sm italic text-gray-600 mb-1">{exp.location}</p>
                            <ul className="list-disc list-outside ml-5 mt-1 space-y-1">
                                {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                            </ul>
                        </div>
                    ))}
                </Section>

                {projects.length > 0 && (
                    <Section title="Projects">
                        {projects.map(proj => (
                            <div key={proj.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-md font-semibold">{proj.name}</h3>
                                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-brand-primary hover:underline">View</a>}
                                </div>
                                <ul className="list-disc list-outside ml-5 mt-1 space-y-1">
                                    {proj.description.map((desc, i) => <li key={i}>{desc}</li>)}
                                </ul>
                            </div>
                        ))}
                    </Section>
                )}

                <div className="grid grid-cols-2 gap-x-8">
                    <Section title="Education">
                        {education.map(edu => (
                            <div key={edu.id} className="mb-2">
                                <h3 className="text-md font-semibold">{edu.institution}</h3>
                                <p className="text-sm italic text-gray-600">{edu.degree}</p>
                                <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </Section>

                    <Section title="Skills">
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <span key={skill.id} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded">{skill.name}</span>
                            ))}
                        </div>
                    </Section>

                    {certifications.length > 0 && (
                        <Section title="Certifications" className="col-span-2">
                            {certifications.map(cert => (
                                <p key={cert.id} className="text-sm mb-1">{cert.name} - <span className="italic">{cert.organization}</span> ({cert.date})</p>
                            ))}
                        </Section>
                    )}

                    {languages.length > 0 && (
                        <Section title="Languages" className="col-span-2">
                            <p>{languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}</p>
                        </Section>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ProfessionalTemplate;
