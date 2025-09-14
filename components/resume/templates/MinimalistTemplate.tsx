import React from 'react';
import { ResumeData } from '../../../types';

interface TemplateProps {
    data: ResumeData;
}

const MinimalistTemplate: React.FC<TemplateProps> = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;

    return (
        <div className="h-full bg-white p-10 font-sans text-gray-700 text-sm leading-relaxed">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-4xl font-light tracking-wider uppercase">{personalInfo.fullName}</h1>
                <p className="text-md font-normal text-gray-500 tracking-widest mt-1">{personalInfo.jobTitle}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs mt-4 text-gray-500">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.address && <span>{personalInfo.address}</span>}
                    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                    {personalInfo.website && <span>{personalInfo.website}</span>}
                </div>
            </header>

            {/* Summary */}
            <section className="mb-8">
                 <p>{summary}</p>
            </section>

            {/* Experience */}
            <section className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Experience</h2>
                {experience.map(exp => (
                    <div key={exp.id} className="mb-5">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-md font-semibold text-gray-800">{exp.jobTitle}, <span className="font-normal">{exp.company}</span></h3>
                            <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <ul className="list-disc list-inside mt-2 ml-2 space-y-1 text-sm text-gray-600">
                            {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                        </ul>
                    </div>
                ))}
            </section>

             {/* Projects */}
            {projects.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Projects</h2>
                    {projects.map(proj => (
                        <div key={proj.id} className="mb-5">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-md font-semibold text-gray-800">{proj.name}</h3>
                                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-primary hover:underline">View Project</a>}
                            </div>
                            <ul className="list-disc list-inside mt-2 ml-2 space-y-1 text-sm text-gray-600">
                                {proj.description.map((desc, i) => <li key={i}>{desc}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
            )}
            
            {/* Education */}
            <section className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Education</h2>
                {education.map(edu => (
                    <div key={edu.id} className="mb-2">
                         <div className="flex justify-between items-baseline">
                            <h3 className="text-md font-semibold text-gray-800">{edu.institution}</h3>
                            <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                        </div>
                        <p className="text-sm text-gray-600">{edu.degree}</p>
                    </div>
                ))}
            </section>

             {/* Certifications */}
            {certifications.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Certifications</h2>
                    {certifications.map(cert => (
                         <div key={cert.id} className="mb-2">
                            <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">{cert.name}</span>, {cert.organization} ({cert.date})</p>
                        </div>
                    ))}
                </section>
            )}

            {/* Skills */}
            <section className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Skills</h2>
                <p className="text-gray-600">
                    {skills.map(skill => skill.name).join(' · ')}
                </p>
            </section>

             {/* Languages */}
            {languages.length > 0 && (
                <section>
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">Languages</h2>
                    <p className="text-gray-600">
                        {languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' · ')}
                    </p>
                </section>
            )}
        </div>
    );
};

export default MinimalistTemplate;