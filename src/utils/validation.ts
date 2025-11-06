import { MathProblem } from '../types';

export function calculateDivisionAnswer(dividend: number, divisor: number): number {
  return Math.floor(dividend / divisor);
}

export function calculateMultiplicationAnswer(multiplicand: number, multiplier: number): number {
  return multiplicand * multiplier;
}

export function calculateCorrectAnswer(problem: MathProblem): number {
  if (problem.type === 'division') {
    return calculateDivisionAnswer(problem.dividend!, problem.divisor!);
  } else {
    return calculateMultiplicationAnswer(problem.multiplicand!, problem.multiplier!);
  }
}

export function getDivisionSteps(dividend: number, divisor: number) {
  const steps = [];
  let remainder = 0;
  const dividendStr = dividend.toString();
  let quotient = '';

  for (let i = 0; i < dividendStr.length; i++) {
    const digit = parseInt(dividendStr[i]);
    const currentNumber = remainder * 10 + digit;
    const quotientDigit = Math.floor(currentNumber / divisor);
    const product = quotientDigit * divisor;
    const newRemainder = currentNumber - product;

    steps.push({
      stepNumber: i + 1,
      currentNumber,
      quotientDigit,
      product,
      remainder: newRemainder,
      broughtDownDigit: digit,
    });

    quotient += quotientDigit;
    remainder = newRemainder;
  }

  return { steps, quotient: parseInt(quotient), remainder };
}

export function getMultiplicationSteps(multiplicand: number, multiplier: number) {
  const steps = [];
  const multiplierStr = multiplier.toString();
  const partialProducts = [];

  // Calculate partial products
  for (let i = multiplierStr.length - 1; i >= 0; i--) {
    const digit = parseInt(multiplierStr[i]);
    const partialProduct = multiplicand * digit;
    const positionIndex = multiplierStr.length - 1 - i;
    partialProducts.push({
      digit,
      partialProduct,
      position: positionIndex,
    });
  }

  return { partialProducts, finalAnswer: multiplicand * multiplier };
}
