import { filter } from 'ramda';
import { Marble } from './marble.model';

const isRed = (marble: Marble): boolean => marble.color === 'red';

export function reds(marbles: Marble[]): Marble[] {
  return filter(isRed, marbles);
}
