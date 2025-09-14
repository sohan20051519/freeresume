import React from 'react';
import { ResumeData } from '../../../types';

interface TemplateProps {
    data: ResumeData;
}

const TechnicalTemplate: React.FC<TemplateProps> = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

    const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
        <section className="mb-5">
            <h2 className="text-md font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-1 mb-3">{title}</h2>
            {children}
        </section>
    );

    return (
        <div className="h-full bg-white p-8 font-sans text-gray-800 text-sm leading-normal">
            {/* Header */}
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold">{personalInfo.fullName}</h1>
                <p className="text-md font-medium text-brand-primary">{personalInfo.jobTitle}</p>
                <div className="text-xs text-gray-600 mt-2 flex justify-center flex-wrap gap-x-4">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.address && <span>{personalInfo.address}</span>}
                    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                    {personalInfo.website && <span>{personalInfo.website}</span>}
                </div>
            </header>

            {/* Summary */}
            <Section title="Summary">
                <p className="text-sm">{summary}</p>
            </Section>

            {/* Skills */}
            <Section title="Technical Skills">
                <div className="columns-2 sm:columns-3 text-sm gap-x-6">
                    {skills.map(skill => (
                        <p key={skill.id} className="mb-1">{skill.name}</p>
                    ))}
                </div>
            </Section>

            {/* Experience */}
            <Section title="Experience">
                {experience.map(exp => (
                    <div key={exp.id} className="mb-4 break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-md font-semibold text-gray-900">{exp.jobTitle}</h3>
                            <p className="text-xs font-mono text-gray-500 shrink-0 ml-4">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-700">{exp.company} / {exp.location}</p>
                        <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-sm text-gray-700">
                            {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                        </ul>
                    </div>
                ))}
            </Section>

            {/* Projects */}
            {projects.length > 0 && (
                 <Section title="Projects">
                    {projects.map(proj => (
                        <div key={proj.id} className="mb-4 break-inside-avoid">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-md font-semibold text-gray-900">{proj.name}</h3>
                                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-brand-primary hover:underline shrink-0 ml-4">View Project</a>}
                            </div>
                            <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-sm text-gray-700">
                                {proj.description.map((desc, i) => <li key={i}>{desc}</li>)}
                            </ul>
                        </div>
                    ))}
                </Section>
            )}
            
            {/* Education */}
            <Section title="Education">
                {education.map(edu => (
                    <div key={edu.id} className="mb-2">
                         <div className="flex justify-between items-baseline">
                            <h3 className="text-md font-semibold text-gray-900">{edu.institution}</h3>
                            <p className="text-xs font-mono text-gray-500">{edu.startDate} - {edu.endDate}</p>
                        </div>
                        <p className="text-sm text-gray-700">{edu.degree}, {edu.location}</p>
                    </div>
                ))}
            </Section>

             {/* Certifications */}
            {certifications.length > 0 && (
                <Section title="Certifications">
                    {certifications.map(cert => (
                        <div key={cert.id} className="mb-2">
                            <p className="text-sm"><span className="font-semibold">{cert.name}</span>, {cert.organization} ({cert.date})</p>
                        </div>
                    ))}
                </Section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
                <Section title="Languages">
                    <p className="text-sm">
                        {languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}
                    </p>
                </Section>
            )}
        </div>
    );
};

export default TechnicalTemplate;