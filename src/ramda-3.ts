import { propEq, curry, both, compose, not, filter } from 'ramda';

import { Marble } from './marble.model';

type isAttribute = (a: string) => (b: Marble) => boolean;

// Type error w/out curry
const isColor: isAttribute = propEq('color');
const isSize: isAttribute = curry(propEq('size'));
const isRed = isColor('red');
const isLarge = propEq('size', 'large');

export const reds = filter(isRed);
export const blues = filter(isColor('blue'));
export const smalls = filter(isSize('small'));
export const notReds = filter(compose(not, isRed));
export const bigReds = filter(both(isRed, isLarge));
