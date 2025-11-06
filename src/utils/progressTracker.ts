import { Progress, UserAnswer } from '../types';

const STORAGE_KEY = 'mathTutorProgress';

const DEFAULT_PROGRESS: Progress = {
  totalProblems: 0,
  correctProblems: 0,
  accuracyRate: 0,
  timeSpent: 0,
  problemsByType: {
    division: { total: 0, correct: 0 },
    multiplication: { total: 0, correct: 0 },
  },
  currentStreak: 0,
  maxStreak: 0,
};

export function getProgress(): Progress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PROGRESS;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.error('Failed to save progress');
  }
}

export function updateProgressWithAnswer(answer: UserAnswer): Progress {
  const progress = getProgress();

  // Update totals
  progress.totalProblems += 1;
  progress.timeSpent += answer.timeSpent;

  // Update by type
  const typeKey = answer.type;
  progress.problemsByType[typeKey].total += 1;

  if (answer.isCorrect) {
    progress.correctProblems += 1;
    progress.problemsByType[typeKey].correct += 1;
    progress.currentStreak += 1;
    progress.maxStreak = Math.max(progress.maxStreak, progress.currentStreak);
  } else {
    progress.currentStreak = 0;
  }

  // Update accuracy rate
  progress.accuracyRate = Math.round((progress.correctProblems / progress.totalProblems) * 100);

  saveProgress(progress);
  return progress;
}

export function resetProgress(): void {
  saveProgress(DEFAULT_PROGRESS);
}

export function getAccuracyPercentage(): number {
  const progress = getProgress();
  return progress.accuracyRate;
}

export function getStreak(): { current: number; max: number } {
  const progress = getProgress();
  return {
    current: progress.currentStreak,
    max: progress.maxStreak,
  };
}

export function getTypeStats(type: 'division' | 'multiplication'): { total: number; correct: number; rate: number } {
  const progress = getProgress();
  const stats = progress.problemsByType[type];
  const rate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  return { total: stats.total, correct: stats.correct, rate };
}
