import * as ramda1 from '../src/ramda-1';
import * as ramda2 from '../src/ramda-2';
import * as ramda3 from '../src/ramda-3';
import * as es6 from '../src/es6';

import { Marble } from '../src/marble.model';

describe('Marbles', () => {
  let marbles: Marble[];
  describe('given some marbles', () => {
    marbles = [
      {
        size: 'large',
        color: 'red'
      },
      {
        size: 'medium',
        color: 'red'
      },
      {
        size: 'small',
        color: 'blue'
      },
      {
        size: 'large',
        color: 'black'
      },
      {
        size: 'medium',
        color: 'green'
      }
    ];
  });

  [ramda1, ramda2, ramda3, es6].forEach(suite => {
    describe('for a suite', () => {
      it('counts reds', () => {
        expect(suite.reds(marbles).length).toBe(2);
      });

      it('counts blues', () => {
        expect(suite.blues(marbles).length).toBe(1);
      });

      it('counts not reds', () => {
        expect(suite.notReds(marbles).length).toBe(3);
      });

      it('counts large reds', () => {
        expect(suite.bigReds(marbles).length).toBe(1);
      });
    });
  });
});
