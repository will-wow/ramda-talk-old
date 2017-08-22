import { Marble } from './marble.model';

export function reds(marbles: Marble[]): Marble[] {
  return marbles.filter((marbel: Marble): boolean => {
    return marbel.color === 'red';
  });
}

function hasAttribute(
  marble: Marble,
  attribute: string,
  value: string,
  not: boolean
) {
  return not ? marble[attribute] === value : marble[attribute] === value;
}

function filterOnAttribute(
  marbles: Marble[],
  attribute: string,
  value: string,
  not?: boolean
): Marble[] {
  return marbles.filter((marbel: Marble): boolean => {
    return hasAttribute(marbel, attribute, value, not);
  });
}

export function blues(marbles: Marble[]): Marble[] {
  return filterOnAttribute(marbles, 'color', 'blue');
}

export function smalls(marbles: Marble[]): Marble[] {
  return filterOnAttribute(marbles, 'size', 'small');
}

export function notReds(marbles: Marble[]): Marble[] {
  return filterOnAttribute(marbles, 'color', 'red', true);
}

export function bigReds(marbles: Marble[]): Marble[] {
  return reds(marbles).filter((marble: Marble) => {
    return marble.size === 'large';
  });
}
