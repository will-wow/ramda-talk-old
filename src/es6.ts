import { Marble } from './marble.model';
import * as _ from 'lodash';

export function reds(marbles: Marble[]): Marble[] {
  return marbles.filter((marble: Marble): boolean => {
    return marble.color === 'red';
  });
}

function isMatchingMarble(
  marble: Marble,
  attribute: keyof Marble,
  value: string
): boolean {
  return marble[attribute] === value;
}

export function filterMarbles(
  marbles: Marble[],
  attribute: keyof Marble,
  value: string
): Marble[] {
  return marbles.filter(marble => isMatchingMarble(marble, attribute, value));
}

export function blues(marbles: Marble[]): Marble[] {
  return _.filter(marbles, marble => isMatchingMarble(marble, 'color', 'blue'));
}

export function smalls(marbles: Marble[]): Marble[] {
  return _.filter(marbles, marble => isMatchingMarble(marble, 'size', 'small'));
}

export function notReds(marbles: Marble[]): Marble[] {
  return _.reject(marbles, marble => isMatchingMarble(marble, 'color', 'blue'));
}

export function bigReds(marbles: Marble[]): Marble[] {
  return marbles
    .filter(marble => isMatchingMarble(marble, 'color', 'red'))
    .filter(marble => isMatchingMarble(marble, 'size', 'big'));
}

export function favoriteColor(marbles: Marble[]): string {
  const counts: { [color: string]: number } = {};

  _.forEach(marbles, (marble: Marble): void => {
    counts[marble.color] = (counts[marble.color] || 0)  + 1;
  });

  let biggestNumber: number = 0;
  let biggestColor: string;

  _.forEach(counts, (count, color) => {
    if (count > biggestNumber) {
      biggestColor = color;
      biggestNumber = count;
    }
  });

  return biggestColor;
}
