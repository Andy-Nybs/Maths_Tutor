import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MathProblem, DifficultyLevel } from '../types';
import { generateMultiplicationProblem } from '../utils/problemGenerator';
import { getMultiplicationSteps, calculateMultiplicationAnswer } from '../utils/validation';
import { updateProgressWithAnswer } from '../utils/progressTracker';
import HelpPanel from './HelpPanel';

interface MultiplicationBoardProps {
  difficulty: DifficultyLevel;
  onBack: () => void;
  onNext: (newDifficulty?: DifficultyLevel) => void;
}

export default function MultiplicationBoard({ difficulty, onBack, onNext }: MultiplicationBoardProps) {
  const [problem, setProblem] = useState<MathProblem>(generateMultiplicationProblem(difficulty));
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());

  const steps = getMultiplicationSteps(problem.multiplicand!, problem.multiplier!);
  const correctAnswer = calculateMultiplicationAnswer(problem.multiplicand!, problem.multiplier!);

  const handleInputChange = (key: string, value: string) => {
    setUserInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCheck = () => {
    const userAnswer = userInputs['final'] ? parseInt(userInputs['final']) : null;
    const correct = userAnswer === correctAnswer;

    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      updateProgressWithAnswer({
        type: 'multiplication',
        problemId: problem.id,
        steps: [],
        finalAnswer: userAnswer!,
        isCorrect: true,
        timeSpent,
      });
    }
  };

  const handleNext = () => {
    setProblem(generateMultiplicationProblem(difficulty));
    setUserInputs({});
    setSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const colors = ['bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-yellow-100'];

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
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Long Multiplication</h1>
          <div className="w-20"></div>
        </div>

        {/* Problem Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card mb-8"
        >
          {/* Problem Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Multiplication Grid */}
            <div className="overflow-x-auto">
              <div className="font-mono space-y-1 inline-block min-w-full">
                {/* First Number */}
                <div className="flex justify-end gap-0">
                  {problem.multiplicand!.toString().split('').map((digit, idx) => (
                    <div key={`top-${idx}`} className="w-12 h-12 border-2 border-gray-300 flex items-center justify-center font-bold text-lg">
                      {digit}
                    </div>
                  ))}
                </div>

                {/* Multiplier */}
                <div className="flex justify-end gap-0 mb-2">
                  <span className="w-12 h-12 flex items-center justify-center font-bold text-lg">×</span>
                  {problem.multiplier!.toString().split('').map((digit, idx) => (
                    <div key={`bottom-${idx}`} className="w-12 h-12 border-2 border-gray-300 flex items-center justify-center font-bold text-lg">
                      {digit}
                    </div>
                  ))}
                </div>

                {/* Separator Line */}
                <div className="flex justify-end gap-0 mb-2">
                  <div className="w-12 h-1 bg-gray-800"></div>
                  {problem.multiplicand!.toString().split('').map((_, idx) => (
                    <div key={`sep-${idx}`} className="w-12 h-1 bg-gray-800"></div>
                  ))}
                </div>

                {/* Partial Products */}
                <div className="space-y-1">
                  {steps.partialProducts.map((product, idx) => (
                    <div key={idx} className="flex justify-end gap-0">
                      <input
                        type="number"
                        placeholder="?"
                        value={userInputs[`partial-${idx}`] || ''}
                        onChange={(e) => handleInputChange(`partial-${idx}`, e.target.value)}
                        className={`w-12 h-12 border-2 flex items-center justify-center font-mono text-sm text-center input-cell ${colors[idx % colors.length]}`}
                        disabled={submitted}
                      />
                      <div style={{ width: `${product.position * 48}px` }}></div>
                    </div>
                  ))}
                </div>

                {/* Final Separator */}
                <div className="flex justify-end gap-0 my-2">
                  <div className="border-b-2 border-gray-800" style={{ width: `${(problem.multiplicand!.toString().length + 1) * 48}px` }}></div>
                </div>

                {/* Final Answer */}
                <div className="flex justify-end gap-0">
                  <input
                    type="number"
                    placeholder="?"
                    value={userInputs['final'] || ''}
                    onChange={(e) => handleInputChange('final', e.target.value)}
                    className="border-2 border-indigo-600 px-3 py-2 font-mono text-lg font-bold text-center input-cell"
                    disabled={submitted}
                  />
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-4">
              {/* Problem Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Problem Details</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <strong>{problem.multiplicand}</strong> × <strong>{problem.multiplier}</strong> = <strong>?</strong>
                  </p>
                  <div className="text-2xl font-bold text-indigo-600 text-center py-2">
                    = {correctAnswer}
                  </div>
                </div>
              </div>

              {/* Steps Guide */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-bold text-green-800 mb-2">How to Solve:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Multiply {problem.multiplicand} by each digit of {problem.multiplier}</li>
                  <li>Write each result (partial product)</li>
                  <li>Remember to shift left for each digit position</li>
                  <li>Add all partial products</li>
                </ol>
              </div>

              {/* Partial Products Breakdown */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h4 className="font-bold text-amber-800 mb-2">Partial Products:</h4>
                <div className="space-y-1 text-sm">
                  {steps.partialProducts.map((product, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span>{problem.multiplicand} × {product.digit}</span>
                      <span className="font-bold text-amber-700">{product.partialProduct}</span>
                    </div>
                  ))}
                </div>
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
                {isCorrect ? '✅ Fantastic work!' : `❌ Not quite. The answer is ${correctAnswer}.`}
              </p>
              {!isCorrect && (
                <p className="text-red-700 mt-2">
                  Double-check your partial products and addition!
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
        problemType="multiplication"
        helpContext={{ stepNumber: 0, attemptNumber: submitted ? 1 : 0 }}
        isOpen={showHint}
        onToggle={() => setShowHint(!showHint)}
      />
    </div>
  );
}
