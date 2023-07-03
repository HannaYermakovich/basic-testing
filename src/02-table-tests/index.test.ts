import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 2, b: 2, action: Action.Subtract, expected: 0 },
  { a: 8, b: 2, action: Action.Subtract, expected: 6 },
  { a: 7, b: 4, action: Action.Subtract, expected: 3 },
  { a: 3, b: 2, action: Action.Multiply, expected: 6 },
  { a: 2, b: 2, action: Action.Multiply, expected: 4 },
  { a: 4, b: 4, action: Action.Multiply, expected: 16 },
  { a: 8, b: 4, action: Action.Divide, expected: 2 },
  { a: 2, b: 2, action: Action.Divide, expected: 1 },
  { a: 6, b: 2, action: Action.Divide, expected: 3 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 3, b: 3, action: Action.Exponentiate, expected: 27 },
  { a: 4, b: 4, action: Action.Exponentiate, expected: 256 },
];

describe('simpleCalculator', () => {
  testCases.forEach(({ a, b, action, expected }) => {
    test(`should ${action} ${a} and ${b} to equal ${expected}`, () => {
      const input = { a, b, action };
      const result = simpleCalculator(input);
      expect(result).toBe(expected);
    });
  });

  test('should return null for invalid arguments', () => {
    const input = { a: '5', b: 3, action: Action.Add };
    const result = simpleCalculator(input);
    expect(result).toBeNull();
  });
});
