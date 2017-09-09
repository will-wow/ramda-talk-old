import { Marble } from './marble.model';
import { allPass, curry, filter, propEq, not, compose } from 'ramda';

// const isRed = (marble: Marble): boolean => marble.color === 'red';
// const reds: (a: Marble[]) => Marble[] = filter(isRed);

// const red: (a: Marble[]) => Marble = filter(isRed);

const filterMarbles = (
  attribute: keyof Marble,
  value: string
): ((a: Marble[]) => Marble[]) => filter(propEq(attribute, value));

const filterMarbles = curry(
  (
    attribute: keyof Marble,
    value: string,
    marbles: Marble[]
  ): Marble[] => filter(propEq(attribute, value), marbles)
);

let marbles: Marble[];
filterMarbles('color', 'red')(marbles);

const isRed: (a: Marble) => boolean = propEq('color', 'red');
const isWhite: (a: Marble) => boolean = propEq('color', 'red');
const isBlue: (a: Marble) => boolean = propEq('color', 'red');
const isSmall: (a: Marble) => boolean = propEq('size', 'small');

const isAmerican = (marble: Marble): boolean =>
  isRed(marble) &&
  isWhite(marble) &&
  isBlue(marble) &&
  !isSmall(marble);

const isAmerican: (a: Marble) => boolean = allPass([
  isRed,
  isWhite,
  isBlue,
  compose(not, isSmall)
]);
