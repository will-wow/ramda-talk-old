import {
  addOne,
  addOneToAll,
  addOneRamda,
  addOneToAllRamda,
  addAndSum,
} from '../src/tldr';

describe('addOne', () => {
  describe('lodash', () => {
    it('adds one', () => {
      expect(addOne(5)).toBe(6);
    });
  });

  describe('ramda', () => {
    it('adds one', () => {
      expect(addOneRamda(5)).toBe(6);
    });
  });
});

describe('addOneToAll', () => {
  const numbers = [1, 2, 3];
  const addedNumbers = [2, 3, 4];

  describe('lodash', () => {
    it('adds one to all', () => {
      expect(addOneToAll(numbers)).toEqual(addedNumbers);
    });
  });

  describe('ramda', () => {
    it('adds one to all', () => {
      expect(addOneToAllRamda(numbers)).toEqual(addedNumbers);
    });
  });
});

describe('addAndSum', () => {
  const numbers = [1, undefined, 2, 3];

  it('does the math', () => {
    expect(addAndSum(numbers)).toBe(9);
  });
});
