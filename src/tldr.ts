import { filter, gt, compose, pipe, map, add, sum } from 'ramda';
import * as _ from 'lodash';

function hello(a) {
  return 'hello ' + a;
}

function world(a) {
  return 'world and ' + a;
}

export function greeting(name) {
  return hello(world(name));
}

export const ramdaGreeting = compose(hello, world);

function addOne(n: number): number {
  return _.add(1, n);
}

function addOneToAll(numbers: number[]): number[] {
  return _.map(numbers, addOne);
}

export function lodashAddAndSum(numbers: number[]): number {
  return _.chain(numbers).map(addOne).sum().value();
}

const addOne2: (n: number) => number = add(1);
const addOneToAll2: (ns: number[]) => number[] = map(addOne);

const addAndSumPositives: (ns: number[]) => number = pipe(
  filter(gt(0)),
  map(add(1)),
  sum
);
