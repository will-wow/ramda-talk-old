const _ = require('lodash/fp');

import { Marble } from './marble.model';

const not = (x: any): boolean => !x;
const both = <T>(f1: any, f2: any) => (x: T): boolean => f1(x) && f2(x);

const getSize = (a: Marble) => a.size;
const getColor = (a: Marble) => a.color;

const isRed = _.flow(getColor, _.isEqual('red'));
const isColor = (color: string) => _.flow(getColor, _.isEqual(color));
const isSize = (size: string) => _.flow(getSize, _.isEqual(size));
const isLarge = isSize('large');

export const reds = _.filter(isRed);
export const blues = _.filter(isColor('blue'));
export const smalls = _.filter(isSize('small'));
export const notReds = _.filter(_.flowRight(not, isRed));
export const bigReds = _.filter(both(isRed, isLarge));
