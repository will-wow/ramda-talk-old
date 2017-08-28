import { Marble } from './marble.model';

export function reds(marbles: Marble[]): Marble[] {
  const reds: Marble[] = [];

  for (let i = 0; i < marbles.length; i++) {
    if (marbles[i].color === 'red') {
      reds.push(marbles[i]);
    }
  }

  return reds;
}

function filterMarbles(
  marbles: Marble[],
  attribute: keyof Marble,
  value: string,
  negate?: boolean
): Marble[] {
  const matches: Marble[] = [];

  for (let i = 0; i < marbles.length; i++) {
    if (
      negate ? marbles[i][attribute] !== value : marbles[i][attribute] === value
    ) {
      matches.push(marbles[i]);
    }
  }

  return matches;
}

export function blues(marbles: Marble[]): Marble[] {
  return filterMarbles(marbles, 'color', 'blue');
}

export function smalls(marbles: Marble[]): Marble[] {
  return filterMarbles(marbles, 'size', 'small');
}

export function notReds(marbles: Marble[]): Marble[] {
  return filterMarbles(marbles, 'color', 'red', true);
}

export function bigReds(marbles: Marble[]): Marble[] {
  return filterMarbles(
    filterMarbles(marbles, 'color', 'red')
  , 'size', 'large');
}
