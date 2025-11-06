import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import DifficultySelector from './components/DifficultySelector';
import DivisionBoard from './components/DivisionBoard';
import MultiplicationBoard from './components/MultiplicationBoard';
import { ProblemType, DifficultyLevel } from './types';

type Screen = 'welcome' | 'difficulty' | 'problem';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [problemType, setProblemType] = useState<ProblemType>('division');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');

  const handleSelectProblemType = (type: ProblemType) => {
    setProblemType(type);
    setCurrentScreen('difficulty');
  };

  const handleSelectDifficulty = (level: DifficultyLevel) => {
    setDifficulty(level);
    setCurrentScreen('problem');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleNextProblem = (newDifficulty?: DifficultyLevel) => {
    if (newDifficulty) {
      setDifficulty(newDifficulty);
    }
    // Stay on problem screen but trigger new problem generation
    setCurrentScreen('problem');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeScreen onSelectProblemType={handleSelectProblemType} />
          </motion.div>
        )}

        {currentScreen === 'difficulty' && (
          <motion.div
            key="difficulty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DifficultySelector
              problemType={problemType}
              onSelectDifficulty={handleSelectDifficulty}
              onBack={handleBackToWelcome}
            />
          </motion.div>
        )}

        {currentScreen === 'problem' && (
          <motion.div
            key="problem"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {problemType === 'division' ? (
              <DivisionBoard
                difficulty={difficulty}
                onBack={handleBackToWelcome}
                onNext={handleNextProblem}
              />
            ) : (
              <MultiplicationBoard
                difficulty={difficulty}
                onBack={handleBackToWelcome}
                onNext={handleNextProblem}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
