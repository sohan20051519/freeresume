import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import { ResumeData, PersonalInfo, Experience, Education, Skill, Project, Certification, Language } from '../types';
import { DUMMY_RESUME_DATA } from '../constants';

type Action =
  | { type: 'SET_RESUME_DATA'; payload: ResumeData }
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<PersonalInfo> }
  | { type: 'UPDATE_SUMMARY'; payload: string }
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'UPDATE_EXPERIENCE'; payload: Experience }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: Education }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'ADD_CERTIFICATION'; payload: Certification }
  | { type: 'UPDATE_CERTIFICATION'; payload: Certification }
  | { type: 'REMOVE_CERTIFICATION'; payload: string }
  | { type: 'ADD_LANGUAGE'; payload: Language }
  | { type: 'UPDATE_LANGUAGE'; payload: Language }
  | { type: 'REMOVE_LANGUAGE'; payload: string }
  | { type: 'SET_TEMPLATE'; payload: string };


export interface ResumeState {
    data: ResumeData;
    templateId: string;
}

const initialState: ResumeState = {
    data: DUMMY_RESUME_DATA,
    templateId: 'classic',
};

const ResumeContext = createContext<{ state: ResumeState; dispatch: Dispatch<Action> } | undefined>(undefined);

const resumeReducer = (state: ResumeState, action: Action): ResumeState => {
  switch (action.type) {
    case 'SET_RESUME_DATA':
      return { ...state, data: action.payload };
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...action.payload } } };
    case 'UPDATE_SUMMARY':
        return { ...state, data: { ...state.data, summary: action.payload } };
    case 'ADD_EXPERIENCE':
        return { ...state, data: { ...state.data, experience: [...state.data.experience, action.payload] } };
    case 'UPDATE_EXPERIENCE':
        return { ...state, data: { ...state.data, experience: state.data.experience.map(exp => exp.id === action.payload.id ? action.payload : exp) } };
    case 'REMOVE_EXPERIENCE':
        return { ...state, data: { ...state.data, experience: state.data.experience.filter(exp => exp.id !== action.payload) } };
    case 'ADD_EDUCATION':
        return { ...state, data: { ...state.data, education: [...state.data.education, action.payload] } };
    case 'UPDATE_EDUCATION':
        return { ...state, data: { ...state.data, education: state.data.education.map(edu => edu.id === action.payload.id ? action.payload : edu) } };
    case 'REMOVE_EDUCATION':
        return { ...state, data: { ...state.data, education: state.data.education.filter(edu => edu.id !== action.payload) } };
    case 'ADD_SKILL':
        return { ...state, data: { ...state.data, skills: [...state.data.skills, action.payload] } };
    case 'REMOVE_SKILL':
        return { ...state, data: { ...state.data, skills: state.data.skills.filter(skill => skill.id !== action.payload) } };
     // Project Cases
    case 'ADD_PROJECT':
        return { ...state, data: { ...state.data, projects: [...state.data.projects, action.payload] } };
    case 'UPDATE_PROJECT':
        return { ...state, data: { ...state.data, projects: state.data.projects.map(p => p.id === action.payload.id ? action.payload : p) } };
    case 'REMOVE_PROJECT':
        return { ...state, data: { ...state.data, projects: state.data.projects.filter(p => p.id !== action.payload) } };
    
    // Certification Cases
    case 'ADD_CERTIFICATION':
        return { ...state, data: { ...state.data, certifications: [...state.data.certifications, action.payload] } };
    case 'UPDATE_CERTIFICATION':
        return { ...state, data: { ...state.data, certifications: state.data.certifications.map(c => c.id === action.payload.id ? action.payload : c) } };
    case 'REMOVE_CERTIFICATION':
        return { ...state, data: { ...state.data, certifications: state.data.certifications.filter(c => c.id !== action.payload) } };
        
    // Language Cases
    case 'ADD_LANGUAGE':
        return { ...state, data: { ...state.data, languages: [...state.data.languages, action.payload] } };
    case 'UPDATE_LANGUAGE':
        return { ...state, data: { ...state.data, languages: state.data.languages.map(l => l.id === action.payload.id ? action.payload : l) } };
    case 'REMOVE_LANGUAGE':
        return { ...state, data: { ...state.data, languages: state.data.languages.filter(l => l.id !== action.payload) } };
    case 'SET_TEMPLATE':
        return { ...state, templateId: action.payload };
    default:
      return state;
  }
};

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialState);
  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};