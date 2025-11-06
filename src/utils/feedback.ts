import { HelpContext } from '../types';

// Congratulatory messages
const congratulations = [
  "Fantastic work! 🎉",
  "You nailed it! 💪",
  "Excellent! Keep it up! ⭐",
  "Perfect! You're a math star! 🌟",
  "Amazing! That's the way! 🚀",
];

// Encouragement messages for incorrect answers
const encouragement = [
  "Not quite! Let's try again.",
  "Close, but not quite there yet.",
  "Not this time, but you're getting it!",
  "Let's double-check this step.",
  "Keep going! You've got this!",
];

function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

// Specific feedback for division
const divisionFeedback = {
  quotientDigit: {
    correct: "Great! You correctly found the quotient digit.",
    incorrect: "Let's check the quotient digit. How many times does {divisor} go into {currentNumber}?",
  },
  multiply: {
    correct: "Perfect! You correctly multiplied {quotientDigit} × {divisor} = {product}.",
    incorrect: "Let's check: {quotientDigit} × {divisor} should equal {correctProduct}.",
  },
  subtract: {
    correct: "Excellent! {currentNumber} - {product} = {remainder}.",
    incorrect: "Let's check the subtraction: {currentNumber} - {product} should equal {correctRemainder}.",
  },
  bringDown: {
    correct: "Good! You brought down the {digit}.",
    incorrect: "Let's bring down the next digit carefully.",
  },
};

// Specific feedback for multiplication
const multiplicationFeedback = {
  partialProduct: {
    correct: "Perfect! {multiplicand} × {digit} = {partialProduct}.",
    incorrect: "Let's check: {multiplicand} × {digit} should equal {correctProduct}.",
  },
  alignment: {
    correct: "Great alignment! Remember to shift left by {positions} place(s).",
    incorrect: "Let's check the alignment of this partial product.",
  },
  addition: {
    correct: "Excellent addition!",
    incorrect: "Let's check the final addition.",
  },
};

// Contextual hints
const hints = {
  divisionStart: "Start by asking: How many times does the divisor go into the first digit(s)?",
  divisionMultiply: "Multiply the quotient digit by the divisor.",
  divisionSubtract: "Subtract the product from the current number.",
  divisionBringDown: "Bring down the next digit and repeat the process.",
  multiplicationStart: "Start multiplying from the rightmost digit.",
  multiplicationPartial: "Each digit gets multiplied separately to create partial products.",
  multiplicationAlignment: "Remember: shift each partial product left based on the digit's position.",
  multiplicationAddition: "Add all the partial products together to get the final answer.",
};

export function getCorrectFeedback(): string {
  return getRandomMessage(congratulations);
}

export function getEncouragementFeedback(): string {
  return getRandomMessage(encouragement);
}

export function getDivisionStepFeedback(
  stepType: 'quotientDigit' | 'multiply' | 'subtract' | 'bringDown',
  isCorrect: boolean,
  context: any
): string {
  const feedbackSet = divisionFeedback[stepType];
  const messageTemplate = isCorrect ? feedbackSet.correct : feedbackSet.incorrect;

  return formatMessage(messageTemplate, context);
}

export function getMultiplicationStepFeedback(
  stepType: 'partialProduct' | 'alignment' | 'addition',
  isCorrect: boolean,
  context: any
): string {
  const feedbackSet = multiplicationFeedback[stepType];
  const messageTemplate = isCorrect ? feedbackSet.correct : feedbackSet.incorrect;

  return formatMessage(messageTemplate, context);
}

export function getHint(helpContext: HelpContext, problemType: 'division' | 'multiplication'): string {
  if (problemType === 'division') {
    if (!helpContext.stepNumber) return hints.divisionStart;
    if (helpContext.stepNumber === 1) return hints.divisionMultiply;
    if (helpContext.stepNumber === 2) return hints.divisionSubtract;
    return hints.divisionBringDown;
  } else {
    if (!helpContext.stepNumber) return hints.multiplicationStart;
    if (helpContext.stepNumber === 1) return hints.multiplicationPartial;
    if (helpContext.stepNumber === 2) return hints.multiplicationAlignment;
    return hints.multiplicationAddition;
  }
}

function formatMessage(template: string, context: any): string {
  let message = template;

  // Replace placeholders with actual values
  Object.keys(context).forEach((key) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    message = message.replace(regex, context[key]);
  });

  return message;
}

// Get feedback for specific error types
export function getErrorTypeFeedback(errorType: 'arithmetic' | 'alignment' | 'carryOver' | 'other'): string {
  const errorFeedback = {
    arithmetic: "Let's check the arithmetic. Recalculate this step carefully.",
    alignment: "Check that you've aligned the numbers correctly.",
    carryOver: "Remember to handle the carry-over correctly.",
    other: "Let's review this step. Work through it step by step.",
  };

  return errorFeedback[errorType];
}
