import { Role } from './constants';

export interface User {
  name: string;
  email: string;
  roles: Role[];
}

export interface Retailer {
  id: string;
  name: string;
}

export type RatingCategory = 'Excellent' | 'Good' | 'Average' | 'Poor';

export interface CompetitorAnalysis {
  id: string;
  name: string;
  isPrimary: boolean;
  overallRating: {
    score: number;
    category: RatingCategory;
    reviewCount: number;
  };
  attributes: {
    [key: string]: {
      category: RatingCategory;
      reviewCount: number;
    };
  };
  sentimentSummary: string;
  keyMentions: { term: string; count: number }[];
}

export interface AnalysisData {
  retailer: Retailer;
  competitors: CompetitorAnalysis[];
  attributes: string[];
}
