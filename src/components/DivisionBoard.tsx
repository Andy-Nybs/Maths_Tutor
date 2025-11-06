import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MathProblem, DifficultyLevel } from '../types';
import { generateDivisionProblem } from '../utils/problemGenerator';
import { getDivisionSteps, calculateDivisionAnswer } from '../utils/validation';
import { updateProgressWithAnswer } from '../utils/progressTracker';
import HelpPanel from './HelpPanel';

interface DivisionBoardProps {
  difficulty: DifficultyLevel;
  onBack: () => void;
  onNext: (newDifficulty?: DifficultyLevel) => void;
}

export default function DivisionBoard({ difficulty, onBack, onNext }: DivisionBoardProps) {
  const [problem, setProblem] = useState<MathProblem>(generateDivisionProblem(difficulty));
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());

  const steps = getDivisionSteps(problem.dividend!, problem.divisor!);
  const correctAnswer = calculateDivisionAnswer(problem.dividend!, problem.divisor!);

  const handleInputChange = (key: string, value: string) => {
    setUserInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCheck = () => {
    const userAnswer = userInputs['quotient'] ? parseInt(userInputs['quotient']) : null;
    const correct = userAnswer === correctAnswer;

    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      updateProgressWithAnswer({
        type: 'division',
        problemId: problem.id,
        steps: [],
        finalAnswer: userAnswer!,
        isCorrect: true,
        timeSpent,
      });
    }
  };

  const handleNext = () => {
    setProblem(generateDivisionProblem(difficulty));
    setUserInputs({});
    setFeedback({});
    setSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="btn-secondary"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Long Division</h1>
          <div className="w-20"></div>
        </div>

        {/* Problem Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card mb-8"
        >
          {/* Division Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Visual Division Layout */}
            <div className="flex items-center justify-center">
              <div className="font-mono text-2xl">
                <div className="flex items-center gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="?"
                      value={userInputs['quotient'] || ''}
                      onChange={(e) => handleInputChange('quotient', e.target.value)}
                      className="input-cell w-20 mb-2"
                      disabled={submitted}
                    />
                    <div className="border-b-4 border-gray-800 pb-1 mb-2"></div>
                    <div className="text-center">{problem.divisor}</div>
                  </div>
                  <div className="text-3xl">)‾</div>
                  <div className="text-3xl font-bold">{problem.dividend}</div>
                </div>
              </div>
            </div>

            {/* Problem Info */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Problem Steps</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">
                    <strong>Dividend:</strong> {problem.dividend}
                  </p>
                  <p className="text-gray-600">
                    <strong>Divisor:</strong> {problem.divisor}
                  </p>
                </div>
                <div className="bg-white rounded p-3 border-l-4 border-blue-500">
                  <p className="text-gray-700">
                    <strong>Question:</strong> How many times does {problem.divisor} go into {problem.dividend}?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hints and Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-800 mb-2">Steps to Follow:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Ask: how many times does {problem.divisor} go into the first digits?</li>
                <li>Write the answer in the quotient row</li>
                <li>Multiply and write the product</li>
                <li>Subtract to find the remainder</li>
                <li>Bring down the next digit and repeat</li>
              </ol>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-2">Detailed Steps:</h4>
              <div className="space-y-2 text-xs text-gray-700 max-h-48 overflow-y-auto">
                {steps.steps.map((step, idx) => (
                  <div key={idx} className="bg-white p-2 rounded border border-amber-100">
                    <p>
                      <strong>Step {step.stepNumber}:</strong> {step.quotientDigit} × {problem.divisor} = {step.product}
                    </p>
                    <p className="text-gray-600">
                      {step.currentNumber} - {step.product} = {step.remainder}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-6 ${
                isCorrect
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-red-100 border-2 border-red-500'
              }`}
            >
              <p className={`text-lg font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? '✅ Correct! Great job!' : `❌ Not quite. The answer is ${correctAnswer}.`}
              </p>
              {!isCorrect && (
                <p className="text-red-700 mt-2">
                  Try again with the next problem to reinforce your learning!
                </p>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {!submitted ? (
              <button onClick={handleCheck} className="btn-primary">
                Check Answer
              </button>
            ) : (
              <>
                {isCorrect && (
                  <button onClick={handleNext} className="btn-primary">
                    Next Problem →
                  </button>
                )}
                {!isCorrect && (
                  <button onClick={() => setSubmitted(false)} className="btn-secondary">
                    Try Again
                  </button>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Help Panel */}
      <HelpPanel
        problemType="division"
        helpContext={{ stepNumber: 0, attemptNumber: submitted ? 1 : 0 }}
        isOpen={showHint}
        onToggle={() => setShowHint(!showHint)}
      />
    </div>
  );
}
