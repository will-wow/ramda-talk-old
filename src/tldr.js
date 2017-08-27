import { compose } from 'ramda';

function hello(a) {
  return 'hello ' + a;
}

function world(a) {
  return 'world and ' + a;
}

export function greeting(name) {
  return hello(world(name));
}

export const ramdaGreeting = compose(hello, world);
