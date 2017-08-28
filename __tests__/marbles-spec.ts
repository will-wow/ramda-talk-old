const _ = require('lodash/fp');

import * as ramda1 from '../src/ramda-1';
import * as ramda2 from '../src/ramda-2';
import * as ramda3 from '../src/ramda-3';
import * as lodashFp from '../src/lodash-fp';
import * as es6 from '../src/es6';
import * as es3 from '../src/es3';

import { forEachObjIndexed } from 'ramda';

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

  const modules = { ramda1, ramda2, ramda3, lodashFp, es6, es3 };

  forEachObjIndexed((module: any, name: string) => {
    describe(`for ${name}`, () => {
      it('counts reds', () => {
        expect(module.reds(marbles).length).toBe(2);
      });

      it('counts blues', () => {
        expect(module.blues(marbles).length).toBe(1);
      });

      it('counts smalls', () => {
        expect(module.smalls(marbles).length).toBe(1);
      });

      it('counts not reds', () => {
        expect(module.notReds(marbles).length).toBe(3);
      });

      it('counts large reds', () => {
        expect(module.bigReds(marbles).length).toBe(1);
      });
    });
  }, modules);
});
