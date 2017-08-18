import { Marble } from './marble.model';

export function reds(marbles: Marble[]): Marble[] {
  return marbles.filter((marbel: Marble): boolean => {
    return marbel.color === 'red';
  });
}

function getColors(marbles: Marble[], color: string, not?: boolean): Marble[] {
  return marbles.filter((marbel: Marble): boolean => {
    return not ? marbel.color !== color : marbel.color === color;
  });
}

export function blues(marbles: Marble[]): Marble[] {
  return getColors(marbles, 'blue');
}

export function notReds(marbles: Marble[]): Marble[] {
  return getColors(marbles, 'red', true);
}

export function bigReds(marbles: Marble[]): Marble[] {
  return reds(marbles).filter((marble: Marble) => {
    return marble.size === 'large';
  });
}
