import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Progress } from '../types';
import { getProgress, getTypeStats } from '../utils/progressTracker';

export default function ProgressTracker() {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
    // Listen for storage changes (when progress updates)
    const handleStorageChange = () => {
      setProgress(getProgress());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!progress) return null;

  const divisionStats = getTypeStats('division');
  const multiplicationStats = getTypeStats('multiplication');

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Progress</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Overall Accuracy */}
        <motion.div variants={statVariants} className="text-center">
          <div className="text-4xl font-bold text-indigo-600 mb-2">
            {progress.totalProblems > 0 ? progress.accuracyRate : 0}%
          </div>
          <p className="text-gray-600 font-medium">Accuracy Rate</p>
          <p className="text-sm text-gray-500">
            {progress.correctProblems}/{progress.totalProblems} correct
          </p>
        </motion.div>

        {/* Current Streak */}
        <motion.div variants={statVariants} className="text-center">
          <div className="text-4xl font-bold text-orange-500 mb-2">
            {progress.currentStreak}
          </div>
          <p className="text-gray-600 font-medium">Current Streak</p>
          <p className="text-sm text-gray-500">Max: {progress.maxStreak}</p>
        </motion.div>

        {/* Problems Solved */}
        <motion.div variants={statVariants} className="text-center">
          <div className="text-4xl font-bold text-green-500 mb-2">
            {progress.totalProblems}
          </div>
          <p className="text-gray-600 font-medium">Problems Solved</p>
          <p className="text-sm text-gray-500">
            {Math.floor(progress.timeSpent / 60)}m total
          </p>
        </motion.div>
      </div>

      {/* Problem Type Breakdown */}
      {(divisionStats.total > 0 || multiplicationStats.total > 0) && (
        <motion.div
          variants={statVariants}
          className="border-t pt-6"
        >
          <h4 className="font-semibold text-gray-800 mb-4 text-center">By Problem Type</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-lg font-bold text-blue-600 mb-1">Division</div>
              <p className="text-sm text-gray-600">
                {divisionStats.correct}/{divisionStats.total} ({divisionStats.rate}%)
              </p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <div className="text-lg font-bold text-pink-600 mb-1">Multiplication</div>
              <p className="text-sm text-gray-600">
                {multiplicationStats.correct}/{multiplicationStats.total} ({multiplicationStats.rate}%)
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {progress.totalProblems === 0 && (
        <div className="text-center text-gray-500 py-4">
          No problems solved yet. Start learning!
        </div>
      )}
    </motion.div>
  );
}
