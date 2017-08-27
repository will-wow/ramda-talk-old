import { greeting, ramdaGreeting } from '../src/tldr';

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
