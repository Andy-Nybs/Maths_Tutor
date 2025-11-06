import { motion } from 'framer-motion';
import { ProblemType } from '../types';
import ProgressTracker from './ProgressTracker';

interface WelcomeScreenProps {
  onSelectProblemType: (type: ProblemType) => void;
}

export default function WelcomeScreen({ onSelectProblemType }: WelcomeScreenProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Math Tutor
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
            Master Long Division & Multiplication
          </p>
        </motion.div>

        {/* Problem Selection Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {/* Division Card */}
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectProblemType('division')}
            className="card group"
          >
            <div className="text-5xl mb-4 text-center">÷</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Long Division
            </h2>
            <p className="text-gray-600 text-center group-hover:text-gray-800 transition-colors">
              Learn to divide step by step
            </p>
          </motion.button>

          {/* Multiplication Card */}
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectProblemType('multiplication')}
            className="card group"
          >
            <div className="text-5xl mb-4 text-center">×</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Long Multiplication
            </h2>
            <p className="text-gray-600 text-center group-hover:text-gray-800 transition-colors">
              Master the multiplication method
            </p>
          </motion.button>
        </motion.div>

        {/* Progress Stats */}
        <motion.div variants={itemVariants}>
          <ProgressTracker />
        </motion.div>
      </motion.div>
    </div>
  );
}
