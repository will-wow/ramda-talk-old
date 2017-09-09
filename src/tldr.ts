import { reject, compose, pipe, map, add, sum, isNil } from 'ramda';
import * as _ from 'lodash';

export function addOne(n: number): number {
  return _.add(1, n);
}

export function addOneToAll(numbers: number[]): number[] {
  return _.map(numbers, addOne);
}

export const addOneRamda: (n: number) => number = add(1);
export const addOneToAllRamda: (ns: number[]) => number[] = map(addOne);

export const addAndSum: (ns: number[]) => number = pipe(
  reject(isNil),
  map(add(1)),
  sum
);
