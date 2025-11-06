import { MathProblem, DifficultyLevel } from '../types';

export function generateDivisionProblem(difficulty: DifficultyLevel): MathProblem {
  let dividend: number;
  let divisor: number;

  switch (difficulty) {
    case 'easy':
      // 2-digit ÷ 1-digit
      dividend = Math.floor(Math.random() * 90) + 10;
      divisor = Math.floor(Math.random() * 8) + 2;
      break;
    case 'medium':
      // 3-digit ÷ 1-digit or 3-digit ÷ 2-digit
      if (Math.random() > 0.5) {
        dividend = Math.floor(Math.random() * 900) + 100;
        divisor = Math.floor(Math.random() * 8) + 2;
      } else {
        dividend = Math.floor(Math.random() * 900) + 100;
        divisor = Math.floor(Math.random() * 80) + 10;
      }
      break;
    case 'hard':
      // 4-digit ÷ 2-digit or 3-digit ÷ 2-digit
      dividend = Math.floor(Math.random() * 9000) + 1000;
      divisor = Math.floor(Math.random() * 80) + 10;
      break;
    default:
      throw new Error('Invalid difficulty');
  }

  return {
    id: `div_${Date.now()}_${Math.random()}`,
    type: 'division',
    dividend,
    divisor,
    difficulty,
  };
}

export function generateMultiplicationProblem(difficulty: DifficultyLevel): MathProblem {
  let multiplicand: number;
  let multiplier: number;

  switch (difficulty) {
    case 'easy':
      // 2-digit × 1-digit
      multiplicand = Math.floor(Math.random() * 90) + 10;
      multiplier = Math.floor(Math.random() * 8) + 2;
      break;
    case 'medium':
      // 2-digit × 2-digit
      multiplicand = Math.floor(Math.random() * 90) + 10;
      multiplier = Math.floor(Math.random() * 90) + 10;
      break;
    case 'hard':
      // 3-digit × 2-digit
      multiplicand = Math.floor(Math.random() * 900) + 100;
      multiplier = Math.floor(Math.random() * 90) + 10;
      break;
    default:
      throw new Error('Invalid difficulty');
  }

  return {
    id: `mul_${Date.now()}_${Math.random()}`,
    type: 'multiplication',
    multiplicand,
    multiplier,
    difficulty,
  };
}

export function generateProblem(type: 'division' | 'multiplication', difficulty: DifficultyLevel): MathProblem {
  return type === 'division'
    ? generateDivisionProblem(difficulty)
    : generateMultiplicationProblem(difficulty);
}
