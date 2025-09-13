
export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate:string;
  description: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
    id: string;
    name: string;
}

export interface Project {
    id: string;
    name: string;
    link: string;
    description: string[];
}

export interface Certification {
    id: string;
    name: string;
    organization: string;
    date: string;
}

export interface Language {
    id: string;
    name: string;
    proficiency: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}

export interface Template {
    id: string;
    name: string;
    component: React.FC<{data: ResumeData}>;
    thumbnail: string;
}