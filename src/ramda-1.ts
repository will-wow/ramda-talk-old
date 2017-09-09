import { Marble } from './marble.model';
import {
  allPass,
  curry,
  filter,
  propEq,
  not,
  compose,
  groupBy,
  mapObjIndexed,
  countBy,
  length,
  pipe,
  prop,
  toPairs,
  head,
  last,
  sortBy,
  map
} from 'ramda';

const isRed = (marble: Marble): boolean => marble.color === 'red';
const reds: (a: Marble[]) => Marble[] = filter(isRed);

// const red: (a: Marble[]) => Marble = filter(isRed);

const filterMarbles = (
  attribute: keyof Marble,
  value: string
): ((a: Marble[]) => Marble[]) => filter(propEq(attribute, value));

// const filterMarbles = curry(
//   (
//     attribute: keyof Marble,
//     value: string,
//     marbles: Marble[]
//   ): Marble[] => filter(propEq(attribute, value), marbles)
// );

// let marbles: Marble[];
// filterMarbles('color', 'red')(marbles);

export const favoriteColor: (a: Marble[]) => string = pipe(
  groupBy(prop('color')),
  mapObjIndexed(length),
  toPairs,
  sortBy(last),
  last,
  head
);
