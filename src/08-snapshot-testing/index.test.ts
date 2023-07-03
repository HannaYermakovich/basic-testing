import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const elements = [1, 2, 3];
    const expectedList = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null
          }
        }
      }
    };
    expect(generateLinkedList(elements)).toStrictEqual(expectedList);
  });

  test('should generate linked list from values 2', () => {
    const elements = [5, 10, 15];
    const expectedList = {
      value: 5,
      next: {
        value: 10,
        next: {
          value: 15,
          next: {
            value: null,
            next: null
          }
        }
      }
    };
    expect(generateLinkedList(elements)).toStrictEqual(expectedList);
  });

  test('should generate linked list from empty array', () => {
    const elements: number[] = [];
    const expectedList = {
      value: null,
      next: null
    };
    expect(generateLinkedList(elements)).toStrictEqual(expectedList);
  });
});
