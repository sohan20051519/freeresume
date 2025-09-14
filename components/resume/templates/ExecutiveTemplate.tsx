import React from 'react';
import { ResumeData } from '../../../types';

interface TemplateProps {
    data: ResumeData;
}

const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;
    const contactInfo = [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.linkedin,
        personalInfo.website
    ].filter(Boolean);

    return (
        <div className="h-full bg-white p-10 font-serif text-gray-800 text-base">
            {/* Header */}
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-wider">{personalInfo.fullName}</h1>
                <p className="text-xl font-light text-gray-600 mt-2">{personalInfo.jobTitle}</p>
                <div className="text-xs text-gray-500 mt-4 flex justify-center items-center flex-wrap">
                     {contactInfo.map((info, index) => (
                        <React.Fragment key={index}>
                            <span>{info}</span>
                            {index < contactInfo.length - 1 && <span className="mx-3 text-gray-300">&bull;</span>}
                        </React.Fragment>
                    ))}
                </div>
            </header>

            {/* Summary */}
            <section className="mb-6">
                <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase pb-2 mb-3 border-b border-gray-300">Executive Summary</h2>
                <p className="text-sm leading-relaxed">{summary}</p>
            </section>
            
             {/* Core Competencies */}
            <section className="mb-6">
                <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase pb-2 mb-3 border-b border-gray-300">Core Competencies</h2>
                <div className="columns-2 sm:columns-3 text-sm">
                    {skills.map(skill => (
                        <p key={skill.id} className="mb-1">{skill.name}</p>
                    ))}
                </div>
            </section>

            {/* Experience */}
            <section className="mb-6">
                <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase pb-2 mb-3 border-b border-gray-300">Professional Experience</h2>
                {experience.map(exp => (
                    <div key={exp.id} className="mb-5">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{exp.jobTitle}</h3>
                            <p className="text-sm font-sans font-light text-gray-600">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="text-md italic text-gray-700">{exp.company}, {exp.location}</p>
                        <ul className="list-disc list-outside ml-5 mt-2 space-y-1.5 text-sm text-gray-700">
                            {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                        </ul>
                    </div>
                ))}
            </section>

            {/* Projects */}
            {projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase pb-2 mb-3 border-b border-gray-300">Key Projects</h2>
                    {projects.map(proj => (
                        <div key={proj.id} className="mb-5">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-lg font-bold text-gray-900">{proj.name}</h3>
                                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm font-sans font-light text-brand-primary hover:underline">View Project</a>}
                            </div>
                            <ul className="list-disc list-outside ml-5 mt-2 space-y-1.5 text-sm text-gray-700">
                                {proj.description.map((desc, i) => <li key={i}>{desc}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
            )}
            
            {/* Education */}
            <section className="mb-6">
                <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase pb-2 mb-3 border-b border-gray-300">Education</h2>
                {education.map(edu => (
                    <div key={edu.id} className="flex justify-between items-baseline mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{edu.institution}</h3>
                            <p className="text-md italic text-gray-700">{edu.degree}</p>
                        </div>
                         <p className="text-sm font-sans font-light text-gray-600">{edu.startDate} - {edu.endDate}</p>
                    </div>
                ))}
            </section>

            {/* Certifications & Training */}
            {certifications.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase pb-2 mb-3 border-b border-gray-300">Certifications & Training</h2>
                    {certifications.map(cert => (
                         <div key={cert.id} className="mb-2">
                            <p className="text-sm"><span className="font-semibold text-gray-900">{cert.name}</span>, {cert.organization} ({cert.date})</p>
                        </div>
                    ))}
                </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
                <section>
                    <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase pb-2 mb-3 border-b border-gray-300">Languages</h2>
                    <p className="text-sm">
                        {languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' | ')}
                    </p>
                </section>
            )}
        </div>
    );
};

export default ExecutiveTemplate;