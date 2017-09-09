class: front-slide

<div class="front">
  <h1>Say What You Mean</h1>

  <h2>Declarative programing with TypeScript and Ramda</h2>

  <h3>Will Ockelmann-Wagner • wow@carbonfive.com</h3>

  <img class="front-logo" src="deck/images/c5-logo-full.png">

  <p>carbonfive.com</p>
</div>

???

Say hi

Today I want to talk about Ramda, which is a functional utility library for javascript, and the functional, declarative, compositional style of programming that it allows for. We’ve been using it on a project at Carbon Five recently, and I think the team has found it to be a useful, and particularly fun way to program. So today we’ll see some of the benefits of this style of programming, and see how TypeScript can make it even more powerful.

---

## What makes ramda different

- Curried by default
- Data-last
- Composable

???

So what is ramda? It’s a utility library like lodash or underscore, and in fact has most of the same functions. Real quick, is anyone here not familiar with lodash or underscore?

What makes ramda different is three main things: it’s curried by default, it’s data-last, and because of the first two, it’s particularly composable. Let’s see what that jargon actually means.

---

## Currying

### Types

```typescript
(x: number, y: number) => number
(x: number) => (y: number) => number
```

### Example

```typescript
add(1, 2) // 3
add(1)(2) // 3
```

???

Quickly, I want to explain what’s going on up here. For those who haven’t seen quite this syntax before, these are typescript type declarations for function signatures. The first one describes a function that takes two numbers, x and y, and returns a number. The second describes a function that takes one number, x, and returns a function that takes one number and returns a number.

Given that, we can talk about currying. Currying is a technique (named after the mathematician Haskell Curry, and not the delicious food) that says that if you have a function that takes two arguments, like the first signature, and you pass one argument in, you get back a function like the second signature - it the first argument in memory, takes the second argument, and then does whatever it’s supposed to do. Currying is really similar to partial application, which you may have used with something like lodash dot partial.

Put another way, if add is curried, both add(1, 2) and add(1)(2) work the same way. Does that make sense to everybody?

---

## Curried by default

### lodash

```typescript
function addOne(n: number): number {
  return _.add(1, n);
}
```

### ramda

```typescript
const addOne: (n: number) => number = add(1);
```

???

We can see what currying actually does for us here - in the first example, with lodash, if I wanted a function that adds one to a number, I would do it in the normal way - take a number argument, add it, and return it. And yeah, I could have just used plus.

But the ramda version of add is curried - so when I pass only one argument to it, I get back a function exactly like the first example - it takes in a number, and adds one to it. But I was able to do that is this really concise, declarative way - addOne literally is just add one, and currying lets me say that.

A couple notes here:
In typescript, I can declare that a constant has a function type, like I’m doing here. In this case I wouldn’t actually have to do it, because add already has the type number to number to number, but I thought it would be clearer to actually show the types.
Also lodash (like ramda) has a curry function that takes a normal function and makes it curried, so you can use this same technique with lodash. It’s just not on by default, and as we’ll see in a second, not as useful with lodash.

---

## Data-Last

### Lodash

```typescript
function addOneToAll(numbers: number[]): number[] {
  return _.map(numbers, addOne);
}
```

### Ramda

```typescript
const addOneToAll: (ns: number[]) => number[] = map(addOne);
```

???

Data-last. With lodash, most functions take the data they’re operating on as the first argument, and the function doing the work as the second argument. So for instance map is a function that takes an array, applies a function to every item in the array, and returns the results as a new array. So we can pass map an array of numbers, then pass our adder function from the last slide, and get an array of numbers plus one. Easy enough.

With ramda, the order of arguments is reversed - we pass the function first, then the array. It’s a small change, but because of that, map being curried becomes a lot more useful. Now I can pass my adder function from the last slide to map, and I’m done. When addOneToAll gets passed an array, it’ll apply that function to each item and return them.

---

## Composable

```typescript
const addAndSumPositives: (ns: number[]) => number = pipe(
  filter(gt(0)),
  map(add(1)),
  sum
);
```

???

So the curried functions are kind of cool, because they save you some keystrokes. Fine. That’s cool, but probably not worth a whole new library. The power of ramda comes with function composition. Because it’s easy to define functions as partial applications of other functions, you can chain them together into these pipelines, without ever having to actually get a hold of the argument. In the Haskell language (another thing named after Haskell Curry), which Ramda takes a lot of inspiration from, this is called “point-free style”.

So for instance, here we’re defining an addAndSumPositives function. You can see from the type signature that it takes an array of numbers and returns a number. And the pipeline says to take that array of numbers, filter for numbers greater than zero, add one to each one, then sum the whole thing. This is pretty concise, sure, but I think it’s also really easy to follow - do the filter, do the adding, sum it up. Obviously you could do all this with normal functions, but you’d end up with either deeply nested function calls, or using something like lodash dot chain, which is a lot less flexible.

So this is cool, I think, but we’re not being paid to write cool code. We get paid to write software that is correct, and that is easy to maintain. So what I want to do next is go through a small scenario that might be similar to something you’d do at work, though of course a lot simpler. That way, we can see how ramda can make our lives a little easier when building, maintaining, and refactoring our actual code.

---
class: center

## marbl.ly

<img src="deck/images/marbles.jpg" width="80%" />

???

So here’s the scenario: we’re all working for a new startup, marbl.ly. Here’s the pitch: say you have a bag of marbles, with this app, if you tell it about your marbles, it will sort and count them for you, and then if you lose one, someone will bring you a new one. It’s like Uber for marbles, it’s going to be huge.

But for now this is a startup, so we’re going to try to be agile about building this - we’ll start with something really simple, and then refactor it a little as we do more features, and we’ll see how that goes with and without ramda.

---

## The marble model

```typescript
interface Marble {
  size: string;
  color: string;
}
```

???

Here’s the model for our app. It’s a TypeScript interface, so it describes the shape of an object, so elsewhere functions can say, “I only take arguments that match this interface.” And as you can see, there’s not a lot going on here. A marble has a size and a color, both of which are just strings like “large” or “red”.

So we have marbles, and a bag of marbles is represented by just an array of these marble objects. What we’re going to be building as part of our MVP is a set of functions that take an array of marbles, and just filter it in different ways.

---

class: center

## Red marbles

<img src="deck/images/red-marble.jpg" width="80%" />

???

So where to begin? Well we want to build part of the core functionality first, so the product owners can get their hands on it as soon as possible. So maybe our first story is to just be able to find all the red marbles in the bag.

---

## reds()

```typescript
function reds(marbles: Marble[]): Marble[] {
  return marbles.filter((marble: Marble): boolean => {
    return marble.color === 'red';
  });
}
```

???

So first we... set up our complicated build pipeline because that’s step one with javascript these days. But then we pick up the story, and pretty soon we’ve got something reasonable. We take the array of marbles, and filter for the ones where color equals red. Other than the type signatures, this should look pretty familiar to anyone doing ES6 development. It looks good, and certainly this is a lot better than something like a for loop - we’re talking about marbles and how to filter them, and not indexes and pushing and popping, which is great.

So how can we refactor this with ramda?

---

## reds(): refactor 1

```typescript
import { filter } from 'ramda';
import { Marble } from './marble.model';

const isRed = (marble: Marble): boolean => marble.color === 'red';

function reds(marbles: Marble[]): Marble[] {
  return filter(isRed, marbles);
}
```

???

Step one is probably to pull out that isRed function, and to use ramda’s filter instead of the native one. Now that we’ve done this, we can see that we’re just taking in marbles, and passing them right to filter. Filter is curried, so we don’t need to declare this function at all! That leads to the third refactor step

---

## reds(): refactor 2

```typescript
const isRed = (marble: Marble): boolean => marble.color === 'red';
const reds: (a: Marble[]) => Marble[] = filter(isRed);
```

???

We can drop the function declaration entirely, and just declare reds as filter(isRed). Since filter is curried, when it We’re adding a type signature to both make it clear to readers what this function does, and to make sure that our function does what we expect it to. One thing you might notice is that I’m just calling the Marble argument “a”. That’s usually bad practice - you want to name your variables with full words, so you’re not confused about what they do later. In this case though, we’re not passing that “a” to anything, and we don’t really care about the name, only the types - mable array to marble array. So on my current project we’ve been just naming those variables abc, to keep the focus on the types.

---

## reds(): refactor 2 - inferred type

### Visual Studio Code

<img src="deck/images/red-refactor-2-infer.png" width="100%">

???

However, we didn’t actually have to add that type declaration - since isRed is already typed, TypeScript can correctly infer the type signature of reds. This lets you be a little more concise, but there’s a cost - if you’re not careful, TypeScript could infer something incorrect. And since using a statically typed language is all about letting the compiler catch mistakes, that might not be worth it.

---

## reds(): refactor 2 - type error

<img src="deck/images/red-refactor-2-bug.png" width="100%">

???

For instance, if what we actually wanted was to not filter for all reds, but to find the first red, and we expressed that in the types, typescript would be able to catch that mistake right away. You definitely don’t need to use TypeScript to use Ramda, and in some ways it’s easier with standard JavaScript, since typescript has some problems with passing generic functions as callbacks, which we’ll see a little later. But since your functions are so concise, it’s really nice to have a compiler checking that the right type of data is passing through your pipelines. Now, you still need unit tests, but between the declarative nature of ramda, and the type safety of typescript - if a function looks right, and typechecks, it’s probably correct. And if it doesn’t typecheck, you probably made a mistake. That level of confidence is really nice.

---

class: center

## filterMarbles()

<img src="deck/images/green-marbles.jpg" width="80%" >

???

Okay, so we can find red marbles. We get that branch merged in, and pick up the next story - filter for any color or size marble.

---

## filterMarbles() - ES6

```typescript
function isMatchingMarble(
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
  return marbles.filter(marble => isMatchingMarble(marble, attribute, value));
}
```

???

If we wanted to do that in ES6, it would probably look something like this. We learned from our last Ramda refactor, so this time we pull that isMatchingMarble function out to start witah. And this time it takes in an attribute and a value, checks if they match. Then our filter function just takes in all the data, and for each marble passes it along to the isMatchingMarble function. Since isMatchingMarble isn’t curried, this is kind of verbose, but still, pretty reasonable, and now we can run filterMarbles with marbles, color, red, to recreate our old reds function. Still, let’s see what ramda can do to clean this up.

---

## filterMarbles(): refactor

```typescript
const filterMarbles = (
  attribute: keyof Marble,
  value: string
): ((a: Marble[]) => Marble[]) => filter(propEq(attribute, value));
```

???

Well, this is certainly a lot shorter - but let’s break down what’s going on. First of all, ramda actually supplies a propEquals function - it takes an attribute and a value, and an object, and returns true if they match. So we don’t need our isMatchingMarble function at all. And since it’s curried, we can pass the first two arguments in, and then pass that directly to filter. When filter gets a list of marbles, it’ll pass each one to our curried function, and get the boolean back. So far so good.

So what the heck is going on with the types? Well this can’t be a pure point-free function, because attribute and value don’t get passed to the end of filter - the get passed to a function inside it, propEquals. So instead we define a function that takes attribute and value, and returns a function that takes a marble array and returns a marble array. Basically, we’re manually curring the function, so we don’t have to take and pass the marbles array. The types are a little goofy, but when you’re reading them, you can basically just ignore all the colons and fat arrows, and instead focus on the types - filterMarbles takes a key of Marble, a string, and an array of Marbles, and returns an array of marbles.

---

## filterMarbles(): calling

```typescript
const filterMarbles = (
  attribute: keyof Marble,
  value: string
): ((a: Marble[]) => Marble[]) => filter(propEq(attribute, value));
```

```typescript
filterMarbles('color', 'red')(marbles);
```

???

Because of the way we defined filterMarbles, we’d have to call it in two rounds, like this. If you’re going to be defining functions like smalls or reds, that’s probably ideal.

---

## filterMarbles(): curry

```typescript
const filterMarbles = curry(
  (
    attribute: keyof Marble,
    value: string,
    marbles: Marble[]
  ): Marble[] => filter(propEq(attribute, value), marbles)
);
```

???

On the other hand if you’re going to be passing all three in at once, or sometimes one and sometimes the other, then maybe just passing marbles to the filter directly, and currying the whole thing, would be a better option. It depends on what you’re going to do with the function, and how much you want to avoid passing that marbles variable around manually.

---
