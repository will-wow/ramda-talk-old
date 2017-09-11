import {
  addOne,
  addOneToAll,
  addOneRamda,
  addOneToAllRamda,
  tenTimesSum,
  tenTimesSum2,
  tenTimesSum3
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

fdescribe('timeTimesSum', () => {
  const numbers = [1, 2, 3];

  it('1 does the math', () => {
    expect(tenTimesSum(numbers)).toBe(60);
  });

  it('2 does the math', () => {
    expect(tenTimesSum2(numbers)).toBe(60);
  });

  it('3 does the math', () => {
    const numbers = [1, undefined, 2, 3];
    expect(tenTimesSum3(numbers)).toBe(60);
  });
});
