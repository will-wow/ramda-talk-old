import {
  both,
  compose,
  curry,
  equals,
  filter,
  groupBy,
  head,
  last,
  length,
  mapObjIndexed,
  not,
  pipe,
  prop,
  sortBy,
  toPairs,
} from 'ramda';

import { Marble } from './marble.model';

const hasValue = curry(<T extends keyof Marble>(type: T, value: Marble[T]): ((
  a: Marble
) => boolean) => pipe(prop(type), equals(value)));
const isColor = hasValue('color');
const isRed = isColor('red');
const isSize = hasValue('size');
const isLarge = isSize('large');
const isSmall = isSize('small');

export const reds = filter(isRed);
export const blues = filter(isColor('blue'));
export const smalls = filter(isSmall);
export const notReds = filter(compose(not, isRed));
export const bigReds = filter(both(isRed, isLarge));

type ColorPair = [string, number];

const highestPair: (a: ColorPair[]) => ColorPair = last;
const colorFromPair: (a: [string, number]) => string = head;
const countFromPair: (a: [string, number]) => number = head;

export const favoriteColor: (a: Marble[]) => string = pipe(
  groupBy(prop('color')),
  mapObjIndexed(length),
  toPairs,
  sortBy(countFromPair),
  highestPair,
  colorFromPair
);
