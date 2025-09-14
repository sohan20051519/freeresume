import React from 'react';
import { ResumeData } from '../../../types';

const CorporateTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <section className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-[.2em] text-gray-600 border-b-2 border-gray-300 pb-1 mb-3">{title}</h2>
            {children}
        </section>
    );

    return (
        <div className="h-full bg-white p-10 font-sans text-gray-800 text-sm">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-serif font-bold tracking-wider">{personalInfo.fullName}</h1>
                <p className="text-lg font-light text-gray-700 mt-1">{personalInfo.jobTitle}</p>
                 <div className="text-xs text-gray-500 mt-3 flex justify-center flex-wrap gap-x-4">
                    <span>{personalInfo.email}</span>
                    <span>{personalInfo.phone}</span>
                    <span>{personalInfo.linkedin}</span>
                </div>
            </header>

            <Section title="Summary">
                <p className="leading-relaxed">{summary}</p>
            </Section>

            <Section title="Experience">
                {experience.map(exp => (
                    <div key={exp.id} className="mb-4">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-md font-semibold">{exp.jobTitle}, <span className="font-normal italic">{exp.company}</span></h3>
                            <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <ul className="list-disc list-outside ml-5 mt-1 space-y-1 text-gray-700">
                            {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                        </ul>
                    </div>
                ))}
            </Section>
            
            {projects.length > 0 && (
                <Section title="Projects">
                    {projects.map(proj => (
                         <div key={proj.id} className="mb-4">
                            <h3 className="text-md font-semibold">{proj.name}</h3>
                            <ul className="list-disc list-outside ml-5 mt-1 space-y-1 text-gray-700">
                                {proj.description.map((desc, i) => <li key={i}>{desc}</li>)}
                            </ul>
                        </div>
                    ))}
                </Section>
            )}

            <Section title="Education">
                {education.map(edu => (
                    <div key={edu.id} className="mb-2">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-md font-semibold">{edu.institution}</h3>
                            <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                        </div>
                        <p className="italic">{edu.degree}</p>
                    </div>
                ))}
            </Section>

            <Section title="Skills">
                <p>{skills.map(skill => skill.name).join(' | ')}</p>
            </Section>
            
        </div>
    );
};

export default CorporateTemplate;