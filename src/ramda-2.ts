import { curry, prop, both, compose, not, pipe, filter, equals } from 'ramda';

import { Marble } from './marble.model';

const hasValue = curry((type: keyof Marble, value: string): ((
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
