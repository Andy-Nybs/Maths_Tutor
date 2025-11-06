import { motion } from 'framer-motion';
import { ProblemType, DifficultyLevel } from '../types';

interface DifficultySelectorProps {
  problemType: ProblemType;
  onSelectDifficulty: (level: DifficultyLevel) => void;
  onBack: () => void;
}

export default function DifficultySelector({
  problemType,
  onSelectDifficulty,
  onBack,
}: DifficultySelectorProps) {
  const difficulties: { level: DifficultyLevel; label: string; description: string; emoji: string }[] =
    problemType === 'division'
      ? [
          {
            level: 'easy',
            label: 'Easy',
            description: '2-digit ÷ 1-digit',
            emoji: '😊',
          },
          {
            level: 'medium',
            label: 'Medium',
            description: '3-digit ÷ 1-2-digit',
            emoji: '💪',
          },
          {
            level: 'hard',
            label: 'Hard',
            description: '4-digit ÷ 2-digit',
            emoji: '🔥',
          },
        ]
      : [
          {
            level: 'easy',
            label: 'Easy',
            description: '2-digit × 1-digit',
            emoji: '😊',
          },
          {
            level: 'medium',
            label: 'Medium',
            description: '2-digit × 2-digit',
            emoji: '💪',
          },
          {
            level: 'hard',
            label: 'Hard',
            description: '3-digit × 2-digit',
            emoji: '🔥',
          },
        ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Choose Your Difficulty
          </h2>
          <p className="text-lg text-white/90 drop-shadow-md">
            Select a level to get started
          </p>
        </motion.div>

        {/* Difficulty Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {difficulties.map((diff) => (
            <motion.button
              key={diff.level}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDifficulty(diff.level)}
              className="card group hover:shadow-2xl transition-all"
            >
              <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">
                {diff.emoji}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                {diff.label}
              </h3>
              <p className="text-gray-600 text-center text-sm">
                {diff.description}
              </p>
            </motion.button>
          ))}
        </motion.div>

        {/* Back Button */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <button
            onClick={onBack}
            className="btn-secondary hover:bg-gray-100"
          >
            ← Back to Menu
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
