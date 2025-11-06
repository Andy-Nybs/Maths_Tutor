import { useState } from 'react';
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

interface DivisionStep {
  stepNumber: number;
  currentNumber: number;
  quotientDigit: number;
  product: number;
  remainder: number;
  broughtDownDigit: number;
}

export default function DivisionBoard({ difficulty, onBack, onNext }: DivisionBoardProps) {
  const [problem, setProblem] = useState<MathProblem>(generateDivisionProblem(difficulty));
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>({});
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime] = useState(Date.now());

  const divisionStepsData = getDivisionSteps(problem.dividend!, problem.divisor!);
  const correctAnswer = calculateDivisionAnswer(problem.dividend!, problem.divisor!);

  const handleInputChange = (key: string, value: string) => {
    setUserInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Clear error when user starts typing
    setInputErrors((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  const validateStep = (stepIndex: number) => {
    const step = divisionStepsData.steps[stepIndex];
    const quotientKey = `quotient-${stepIndex}`;
    const productKey = `product-${stepIndex}`;
    const subtractKey = `subtract-${stepIndex}`;

    const userQuotient = parseInt(userInputs[quotientKey] || '');
    const userProduct = parseInt(userInputs[productKey] || '');
    const userSubtract = parseInt(userInputs[subtractKey] || '');

    let allValid = true;

    if (userQuotient !== step.quotientDigit) {
      setInputErrors((prev) => ({ ...prev, [quotientKey]: true }));
      allValid = false;
    }
    if (userProduct !== step.product) {
      setInputErrors((prev) => ({ ...prev, [productKey]: true }));
      allValid = false;
    }
    if (userSubtract !== step.remainder) {
      setInputErrors((prev) => ({ ...prev, [subtractKey]: true }));
      allValid = false;
    }

    return allValid;
  };

  const handleCheckStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < divisionStepsData.steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // All steps complete
        setIsCorrect(true);
        setSubmitted(true);
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        updateProgressWithAnswer({
          type: 'division',
          problemId: problem.id,
          steps: [],
          finalAnswer: correctAnswer,
          isCorrect: true,
          timeSpent,
        });
      }
    }
  };

  const handleSkipToFinal = () => {
    setSubmitted(true);
    setIsCorrect(false);
  };

  const handleNext = () => {
    setProblem(generateDivisionProblem(difficulty));
    setUserInputs({});
    setInputErrors({});
    setSubmitted(false);
    setIsCorrect(false);
    setCurrentStep(0);
    setShowHint(false);
  };

  const step = divisionStepsData.steps[currentStep];
  const dividendStr = problem.dividend!.toString();

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
          <button onClick={onBack} className="btn-secondary">
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
          {/* Main Division Grid */}
          <div className="mb-8 flex justify-center">
            <div className="font-mono text-lg space-y-2">
              {/* Quotient Row */}
              <div className="flex items-center gap-1 mb-4">
                {dividendStr.split('').map((_, idx) => (
                  <div key={`quotient-${idx}`} className="relative">
                    <input
                      type="number"
                      min="0"
                      max="9"
                      maxLength="1"
                      placeholder="?"
                      value={userInputs[`quotient-${idx}`] || ''}
                      onChange={(e) => {
                        if (e.target.value.length <= 1) {
                          handleInputChange(`quotient-${idx}`, e.target.value);
                        }
                      }}
                      disabled={submitted || idx >= currentStep + 1}
                      className={`input-cell w-10 h-10 text-center font-bold ${
                        inputErrors[`quotient-${idx}`] ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Divisor Line */}
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold">{problem.divisor}</div>
                <div className="border-b-4 border-black" style={{ width: '100px' }}></div>
              </div>

              {/* Dividend Row */}
              <div className="flex items-center gap-1 mb-4">
                {dividendStr.split('').map((digit, idx) => (
                  <div key={`dividend-${idx}`} className="w-10 h-10 flex items-center justify-center font-bold border border-gray-400">
                    {digit}
                  </div>
                ))}
              </div>

              {/* Steps Display */}
              {!submitted && (
                <>
                  {/* Current Step Instructions */}
                  <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-3">
                      Step {currentStep + 1}: Work through the division step by step
                    </p>

                    <div className="space-y-3 text-sm">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">
                          How many times does {problem.divisor} go into {step.currentNumber}?
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="9"
                          maxLength="1"
                          placeholder="?"
                          value={userInputs[`quotient-step-${currentStep}`] || ''}
                          onChange={(e) => handleInputChange(`quotient-step-${currentStep}`, e.target.value)}
                          disabled={submitted}
                          className="input-cell w-16 h-10 text-center font-bold"
                        />
                        <span className="text-xs text-gray-600 ml-2">(Answer: {step.quotientDigit})</span>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">
                          {step.quotientDigit} × {problem.divisor} = ?
                        </label>
                        <input
                          type="number"
                          placeholder="?"
                          value={userInputs[`product-step-${currentStep}`] || ''}
                          onChange={(e) => handleInputChange(`product-step-${currentStep}`, e.target.value)}
                          disabled={submitted}
                          className="input-cell w-16 h-10 text-center font-bold"
                        />
                        <span className="text-xs text-gray-600 ml-2">(Answer: {step.product})</span>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">
                          {step.currentNumber} - {step.product} = ?
                        </label>
                        <input
                          type="number"
                          placeholder="?"
                          value={userInputs[`subtract-step-${currentStep}`] || ''}
                          onChange={(e) => handleInputChange(`subtract-step-${currentStep}`, e.target.value)}
                          disabled={submitted}
                          className="input-cell w-16 h-10 text-center font-bold"
                        />
                        <span className="text-xs text-gray-600 ml-2">(Answer: {step.remainder})</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-center mt-6">
                    <button onClick={handleCheckStep} className="btn-primary">
                      {currentStep === divisionStepsData.steps.length - 1 ? 'Complete Division' : 'Next Step →'}
                    </button>
                    <button onClick={handleSkipToFinal} className="btn-secondary">
                      Skip to Answer
                    </button>
                  </div>
                </>
              )}

              {/* Completion Message */}
              {submitted && isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mt-6 text-center"
                >
                  <p className="text-lg font-bold text-green-800 mb-2">✅ Perfect! Division Complete!</p>
                  <p className="text-green-700 mb-4">
                    {problem.dividend} ÷ {problem.divisor} = {correctAnswer}
                  </p>
                  <button onClick={handleNext} className="btn-primary">
                    Next Problem →
                  </button>
                </motion.div>
              )}

              {submitted && !isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border-2 border-red-500 rounded-lg p-4 mt-6 text-center"
                >
                  <p className="text-lg font-bold text-red-800 mb-2">❌ Let's try another problem</p>
                  <p className="text-red-700 mb-4">
                    The answer is {problem.dividend} ÷ {problem.divisor} = {correctAnswer}
                  </p>
                  <button onClick={handleNext} className="btn-primary">
                    Next Problem →
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Reference Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-800 mb-3">How Long Division Works:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li><strong>Divide:</strong> How many times does the divisor go into the current digits?</li>
                <li><strong>Multiply:</strong> Multiply that quotient digit by the divisor</li>
                <li><strong>Subtract:</strong> Subtract the product from the current number</li>
                <li><strong>Bring Down:</strong> Bring down the next digit and repeat</li>
              </ol>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-3">All Steps for This Problem:</h4>
              <div className="space-y-2 text-xs text-gray-700 max-h-48 overflow-y-auto">
                {divisionStepsData.steps.map((s, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${
                      idx === currentStep ? 'bg-amber-200 font-semibold' : 'bg-white'
                    } border border-amber-100`}
                  >
                    <p>
                      <strong>Step {s.stepNumber}:</strong> {s.quotientDigit} × {problem.divisor} = {s.product}
                    </p>
                    <p>{s.currentNumber} - {s.product} = {s.remainder}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Help Panel */}
      <HelpPanel
        problemType="division"
        helpContext={{ stepNumber: currentStep, attemptNumber: submitted ? 1 : 0 }}
        isOpen={showHint}
        onToggle={() => setShowHint(!showHint)}
      />
    </div>
  );
}
