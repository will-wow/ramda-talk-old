import {
  greeting,
  ramdaGreeting,
  lodashAddAndSum,
  ramdaAddAndSum
} from '../src/tldr';

describe('normal greeting', () => {
  it('says hello', () => {
    expect(greeting('bob')).toBe('hello world and bob');
  });
});

describe('ramda greeting', () => {
  it('says hello', () => {
    expect(ramdaGreeting('bob')).toBe('hello world and bob');
  });
});

describe('addAndSum', () => {
  const numbers = [1, 2, 3];

  describe('lodash', () => {
    it('does the math', () => {
      expect(lodashAddAndSum(numbers)).toBe(9);
    });
  });

  describe('ramda', () => {
    it('does the math', () => {
      expect(ramdaAddAndSum(numbers)).toBe(9);
    });
  });
});
