import React from 'react';
import { ResumeData } from '../../../types';

interface TemplateProps {
    data: ResumeData;
}

const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

    const IconWrapper: React.FC<{ children: React.ReactNode, text?: string }> = ({ children, text }) => (
        text ? <div className="flex items-center text-xs text-gray-600">
            {children}
            <span>{text}</span>
        </div> : null
    );

    return (
        <div className="h-full bg-white p-8 font-sans text-gray-800 text-sm">
            {/* Header */}
            <header className="flex justify-between items-center mb-8 pb-4 border-b-2 border-brand-secondary">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 tracking-tight">{personalInfo.fullName}</h1>
                    <p className="text-xl font-medium text-brand-primary mt-1">{personalInfo.jobTitle}</p>
                </div>
                <div className="text-right space-y-1">
                    <IconWrapper text={personalInfo.email}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </IconWrapper>
                    <IconWrapper text={personalInfo.phone}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </IconWrapper>
                    <IconWrapper text={personalInfo.linkedin}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor" ><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </IconWrapper>
                </div>
            </header>

            {/* Summary */}
            <section className="mb-6">
                <h2 className="text-lg font-bold text-brand-secondary uppercase tracking-wider mb-2">Profile</h2>
                <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
            </section>

            {/* Experience */}
            <section className="mb-6">
                <h2 className="text-lg font-bold text-brand-secondary uppercase tracking-wider mb-2">Experience</h2>
                {experience.map(exp => (
                    <div key={exp.id} className="mb-4">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-md font-semibold text-gray-900">{exp.jobTitle} at {exp.company}</h3>
                            <p className="text-xs font-mono text-gray-500">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="text-sm italic text-gray-600 mb-1">{exp.location}</p>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-gray-700">
                            {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                        </ul>
                    </div>
                ))}
            </section>

            {/* Projects */}
            {projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-brand-secondary uppercase tracking-wider mb-2">Projects</h2>
                    {projects.map(proj => (
                        <div key={proj.id} className="mb-4">
                             <div className="flex justify-between items-baseline">
                                <h3 className="text-md font-semibold text-gray-900">{proj.name}</h3>
                                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-brand-primary hover:underline">View Project</a>}
                            </div>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-gray-700">
                                {proj.description.map((desc, i) => <li key={i}>{desc}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
            )}
            
            {/* Education */}
            <section className="mb-6">
                <h2 className="text-lg font-bold text-brand-secondary uppercase tracking-wider mb-2">Education</h2>
                {education.map(edu => (
                    <div key={edu.id} className="mb-2">
                         <div className="flex justify-between items-baseline">
                            <h3 className="text-md font-semibold text-gray-900">{edu.institution}</h3>
                            <p className="text-xs font-mono text-gray-500">{edu.startDate} - {edu.endDate}</p>
                        </div>
                        <p className="text-sm italic text-gray-600">{edu.degree}</p>
                    </div>
                ))}
            </section>

            {/* Skills */}
            <section className="mb-6">
                <h2 className="text-lg font-bold text-brand-secondary uppercase tracking-wider mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                        <span key={skill.id} className="bg-brand-primary/10 text-brand-primary text-xs font-semibold px-3 py-1 rounded-full">{skill.name}</span>
                    ))}
                </div>
            </section>

            {/* Certifications */}
            {certifications.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-brand-secondary uppercase tracking-wider mb-2">Certifications</h2>
                    {certifications.map(cert => (
                        <div key={cert.id} className="mb-2">
                             <p className="text-sm"><span className="font-semibold">{cert.name}</span>, {cert.organization} ({cert.date})</p>
                        </div>
                    ))}
                </section>
            )}
            {/* Languages */}
            {languages.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold text-brand-secondary uppercase tracking-wider mb-3">Languages</h2>
                    <div className="flex flex-wrap gap-2">
                        {languages.map(lang => (
                            <span key={lang.id} className="bg-brand-secondary/10 text-brand-secondary text-xs font-semibold px-3 py-1 rounded-full">{lang.name} ({lang.proficiency})</span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default CreativeTemplate;