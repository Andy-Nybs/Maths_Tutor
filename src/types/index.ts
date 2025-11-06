export type ProblemType = 'division' | 'multiplication';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface MathProblem {
  id: string;
  type: ProblemType;
  dividend?: number; // for division
  divisor?: number;
  multiplicand?: number; // for multiplication
  multiplier?: number;
  difficulty: DifficultyLevel;
}

export interface DivisionStep {
  stepNumber: number;
  quotientDigit?: number;
  multiply: number;
  subtract: number;
  bringDown?: number;
  isCorrect?: boolean;
  feedback?: string;
}

export interface MultiplicationStep {
  rowNumber: number;
  multiplierDigit: number;
  partialProduct: number;
  isCorrect?: boolean;
  feedback?: string;
}

export interface UserAnswer {
  type: ProblemType;
  problemId: string;
  steps: (DivisionStep | MultiplicationStep)[];
  finalAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

export interface Progress {
  totalProblems: number;
  correctProblems: number;
  accuracyRate: number;
  timeSpent: number;
  problemsByType: {
    division: {
      total: number;
      correct: number;
    };
    multiplication: {
      total: number;
      correct: number;
    };
  };
  currentStreak: number;
  maxStreak: number;
}

export interface HelpContext {
  stepNumber?: number;
  currentStep?: any;
  errorType?: 'arithmetic' | 'alignment' | 'carryOver' | 'other';
  attemptNumber: number;
}
