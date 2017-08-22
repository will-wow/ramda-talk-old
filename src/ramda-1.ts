import { both, compose, not, pipe, filter, equals } from 'ramda';

import { Marble } from './marble.model';

const getSize = (a: Marble) => a.size;
const getColor = (a: Marble) => a.color;

const isRed = pipe(getColor, equals('red'));
const isColor = (color: string) => pipe(getColor, equals(color));
const isSize = (size: string) => pipe(getSize, equals(size));
const isLarge = isSize('large');

export const reds = filter(isRed);
export const blues = filter(isColor('blue'));
export const smalls = filter(isSize('small'));
export const notReds = filter(compose(not, isRed));
export const bigReds = filter(both(isRed, isLarge));
