import React from 'react';
import { ResumeData } from '../../../types';

interface TemplateProps {
    data: ResumeData;
}

const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = data;
    const contactInfo = [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.address,
        personalInfo.linkedin,
        personalInfo.website
    ].filter(Boolean);

    return (
        <div className="p-8 font-serif bg-white text-gray-800 text-sm">
            {/* Header */}
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold tracking-wider uppercase">{personalInfo.fullName}</h1>
                <p className="text-lg font-semibold text-brand-primary">{personalInfo.jobTitle}</p>
                <div className="flex justify-center flex-wrap text-xs mt-2 text-gray-600">
                    {contactInfo.map((info, index) => (
                        <React.Fragment key={index}>
                            <span>{info}</span>
                            {index < contactInfo.length - 1 && <span className="mx-2">|</span>}
                        </React.Fragment>
                    ))}
                </div>
            </header>

            {/* Summary */}
            <section className="mb-6">
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2 uppercase tracking-widest">Summary</h2>
                <p className="text-sm leading-relaxed">{summary}</p>
            </section>

            {/* Experience */}
            <section className="mb-6">
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2 uppercase tracking-widest">Experience</h2>
                {experience.map(exp => (
                    <div key={exp.id} className="mb-4">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-md font-bold text-gray-900">{exp.jobTitle}</h3>
                            <p className="text-xs font-mono text-gray-500">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="text-sm italic text-gray-700">{exp.company} | {exp.location}</p>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                            {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
                        </ul>
                    </div>
                ))}
            </section>
            
             {/* Projects */}
            {projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2 uppercase tracking-widest">Projects</h2>
                    {projects.map(proj => (
                        <div key={proj.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-md font-bold text-gray-900">{proj.name}</h3>
                                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-brand-primary hover:underline">View Project</a>}
                            </div>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                                {proj.description.map((desc, i) => <li key={i}>{desc}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            <section className="mb-6">
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2 uppercase tracking-widest">Education</h2>
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

            {/* Skills */}
            <section className="mb-6">
                <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2 uppercase tracking-widest">Skills</h2>
                <div className="flex flex-wrap">
                    {skills.map(skill => (
                        <span key={skill.id} className="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full">{skill.name}</span>
                    ))}
                </div>
            </section>

            {/* Certifications */}
            {certifications.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2 uppercase tracking-widest">Certifications</h2>
                    {certifications.map(cert => (
                        <div key={cert.id} className="mb-2">
                            <p className="text-sm"><span className="font-bold">{cert.name}</span>, {cert.organization} ({cert.date})</p>
                        </div>
                    ))}
                </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-2 uppercase tracking-widest">Languages</h2>
                    <p className="text-sm">{languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}</p>
                </section>
            )}
        </div>
    );
};

export default ClassicTemplate;