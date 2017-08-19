import { curry, prop, both, compose, not, pipe, filter, equals } from 'ramda';

import { Marble } from './marble.model';

const hasValue = curry((type: string, value: string): ((
  a: Marble
) => boolean) => pipe(prop(type), equals(value)));
const isColor = hasValue('color');
const isRed = isColor('red');
const isLarge = hasValue('size', 'large');

export const reds = filter(isRed);
export const blues = filter(isColor('blue'));
export const notReds = filter(compose(not, isRed));
export const bigReds = filter(both(isRed, isLarge));
