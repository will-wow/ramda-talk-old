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

function isMatch(x: string, y: string, not: boolean) {
  if (not) {
    return x !== y;
  } else {
    return x === y;
  }
}

function getColors(marbles: Marble[], color: string, not?: boolean): Marble[] {
  const matches: Marble[] = [];

  for (let i = 0; i < marbles.length; i++) {
    if (isMatch(marbles[i].color, color, not)) {
      matches.push(marbles[i]);
    }
  }

  return matches;
}

export function blues(marbles: Marble[]): Marble[] {
  return getColors(marbles, 'blue');
}

export function notReds(marbles: Marble[]): Marble[] {
  return getColors(marbles, 'red', true);
}
