import { Marble } from './marble.model';
import {
  filter,
  groupBy,
  head,
  last,
  length,
  mapObjIndexed,
  pipe,
  prop,
  propEq,
  sortBy,
  toPairs,
} from 'ramda';

const isRed = (marble: Marble): boolean => marble.color === 'red';
export const reds: (a: Marble[]) => Marble[] = filter(isRed);

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

const marbles: Marble[] = [{ color: 'red', size: 'large' }];
filterMarbles('color', 'red')(marbles);

export const favoriteColor: (a: Marble[]) => string = pipe(
  groupBy(prop('color')),
  mapObjIndexed(length),
  toPairs,
  sortBy(last),
  last,
  head
);
