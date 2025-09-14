import React from 'react';
import { ResumeData } from '../../../types';

const ChronologicalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 tracking-wide border-b border-gray-200 pb-1 mb-3">{title}</h2>
            {children}
        </section>
    );

    return (
        <div className="h-full bg-white font-sans text-gray-800 text-sm p-10">
            <header className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight">{personalInfo.fullName}</h1>
                <p className="text-xl text-gray-600 mt-1">{personalInfo.jobTitle}</p>
                 <div className="flex flex-wrap text-xs mt-4 text-gray-500 gap-x-6">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                    {personalInfo.website && <span>{personalInfo.website}</span>}
                </div>
            </header>

            <Section title="Professional Summary">
                <p className="leading-relaxed text-gray-700">{summary}</p>
            </Section>

            <Section title="Work Experience">
                <div className="relative border-l-2 border-gray-200 pl-6">
                    {experience.map((exp, index) => (
                        <div key={exp.id} className={`mb-6 ${index === experience.length - 1 ? '' : 'pb-6'}`}>
                            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-brand-primary border-2 border-white"></div>
                            <p className="text-xs font-mono text-gray-500 mb-1">{exp.startDate} - {exp.endDate}</p>
                            <h3 className="text-md font-semibold">{exp.jobTitle}</h3>
                            <p className="text-sm italic text-gray-600">{exp.company} &mdash; {exp.location}</p>
                            <ul className="list-disc list-outside ml-5 mt-2 space-y-1 text-gray-700">
                                {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </Section>

            <div className="grid grid-cols-2 gap-x-10">
                <Section title="Education">
                    {education.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <h3 className="text-md font-semibold">{edu.degree}</h3>
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                            <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </Section>
                 <Section title="Skills">
                    <ul className="columns-2">
                        {skills.map(skill => (
                            <li key={skill.id} className="mb-1">{skill.name}</li>
                        ))}
                    </ul>
                </Section>
            </div>
        </div>
    );
};

export default ChronologicalTemplate;