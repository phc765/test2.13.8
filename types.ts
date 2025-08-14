export enum RiskLevel {
  NONE,
  SAFE,
  MEDIUM_RISK,
  HIGH_RISK,
}

export type UserRole = 'student' | 'teacher' | null;

export interface AnswerOption {
  text: string;
  score: number;
}

export interface Question {
  id: string;
  section: string;
  text: string;
  options: AnswerOption[];
}

export interface StudentInfo {
  name: string;
  className: string;
  school: string;
  province: string;
}

export interface Submission extends StudentInfo {
  id: string; // unique id for each submission
  score: number;
  riskLevel: RiskLevel;
  timestamp: number;
}
