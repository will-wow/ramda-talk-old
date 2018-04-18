import {
  reject,
  inc,
  compose,
  pipe,
  map,
  add,
  sum,
  isNil,
  multiply,
} from 'ramda';
import * as _ from 'lodash';

export function addOne(n: number): number {
  return _.add(1, n);
}

export function addOneToAll(numbers: number[]): number[] {
  return _.map(numbers, addOne);
}

export const addOneRamda: (n: number) => number = add(1);
export const addOneToAllRamda: (ns: number[]) => number[] = map(addOne);

export function tenTimesSum(numbers: number[]): number {
  return multiply(10, sum(numbers));
}

export const tenTimesSum2: (numbers: number[]) => number = compose(
  multiply(10),
  sum
);

export const tenTimesSum3: (numbers: number[]) => number = pipe(
  sum,
  multiply(10)
);

export const tenTimesSum4: (numbers: number[]) => number = pipe(
  reject(isNil),
  sum,
  multiply(10)
);

function helloWorld(times) {
  return 'Hello World! '.repeat(times);
}

function helloWorld(times: number): string {
  return 'Hello World! '.repeat(times);
}
