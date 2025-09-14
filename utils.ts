import { ResumeData } from './types';
import { generateId } from './constants';

/**
 * Processes a parsed resume JSON object to add unique IDs to array items.
 * This is necessary for the React components that render lists.
 * @param parsedJson - The partial resume data parsed by the AI.
 * @returns The processed resume data with unique IDs.
 */
export const processParsedResume = (parsedJson: Partial<ResumeData>): Partial<ResumeData> => {
    return {
        ...parsedJson,
        experience: parsedJson.experience?.map(e => ({ ...e, id: generateId() })) || [],
        education: parsedJson.education?.map(e => ({ ...e, id: generateId() })) || [],
        skills: parsedJson.skills?.map(s => ({ ...s, name: s.name, id: generateId() })) || [],
        projects: parsedJson.projects?.map(p => ({ ...p, id: generateId() })) || [],
        certifications: parsedJson.certifications?.map(c => ({ ...c, id: generateId() })) || [],
        languages: parsedJson.languages?.map(l => ({ ...l, id: generateId() })) || [],
    };
};
