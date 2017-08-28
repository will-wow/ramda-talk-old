import { Marble } from './marble.model';
import * as _ from 'lodash';

export function reds(marbles: Marble[]): Marble[] {
  return marbles.filter((marble: Marble): boolean => {
    return marble.color === 'red';
  });
}

function filterMarble(
  marble: Marble,
  attribute: keyof Marble,
  value: string
): boolean {
  return marble[attribute] === value;
}

function filterMarbles(
  marbles: Marble[],
  attribute: keyof Marble,
  value: string
): Marble[] {
  return marbles.filter(marble =>
    filterMarble(marble, attribute, value)
  );
}

export function blues(marbles: Marble[]): Marble[] {
  return _.filter(marbles, marble =>
    filterMarble(marble, 'color', 'blue')
  );
}

export function smalls(marbles: Marble[]): Marble[] {
  return _.filter(marbles, marble =>
    filterMarble(marble, 'size', 'small')
  );
}

export function notReds(marbles: Marble[]): Marble[] {
  return _.reject(marbles, marble =>
    filterMarble(marble, 'color', 'blue')
  );
}

export function bigReds(marbles: Marble[]): Marble[] {
  return marbles
    .filter(marble => filterMarble(marble, 'color', 'red'))
    .filter(marble => filterMarble(marble, 'size', 'big'));
}
