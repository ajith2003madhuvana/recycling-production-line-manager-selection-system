// Core domain types for the Recycling Production Line Manager Selection System

export interface Candidate {
  id: number;
  name: string;
  years_experience: number;
  skills: string[];
  background: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface Evaluation {
  id: number;
  candidate_id: number;
  crisis_management: number; // 1-10
  sustainability: number; // 1-10
  team_motivation: number; // 1-10
  evaluated_at: string;
  evaluator_notes?: string;
}

export interface Ranking {
  id: number;
  candidate_id: number;
  total_score: number; // Sum of evaluation scores
  rank: number; // Computed rank based on total_score
  updated_at: string;
}

export interface CandidateWithEvaluation extends Candidate {
  evaluation: Evaluation;
  ranking: Ranking;
}

export type SortField = 'rank' | 'name' | 'total_score' | 'crisis_management' | 'sustainability' | 'team_motivation' | 'years_experience';
export type SortDirection = 'asc' | 'desc';
