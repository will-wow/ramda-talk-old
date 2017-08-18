import { propEq, curry, both, compose, not, filter } from 'ramda';

import { Marble } from './marble.model';

// Type error w/out curry
const isColor: (a: string) => (b: Marble) => boolean = curry(propEq('color'));
const isRed = isColor('red');
const isLarge = propEq('size', 'large');

export const reds = filter(isRed);
export const blues = filter(isColor('blue'));
export const notReds = filter(compose(not, isRed));
export const bigReds = filter(both(isRed, isLarge));
