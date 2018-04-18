class: front-slide

<div class="front">
  <h1>Say What You Mean</h1>

  <h2>Declarative programming with Ramda and TypeScript</h2>

  <h3>Will Ockelmann-Wagner • wow@carbonfive.com • @WowItsWillWow</h3>

  <img class="front-logo" src="deck/images/c5-logo-full.png">

  <p>carbonfive.com</p>
</div>

???

Say hi

Today I want to talk about Ramda, which is a functional utility library for javascript, and the functional, declarative, compositional style of programming that it allows for. We’ve been using it on a project at Carbon Five recently, and I think the team has found it to be a useful, and particularly fun way to program. So today we’ll see some of the benefits of this style of programming, and then see how TypeScript can make it even more powerful.

---

## What makes ramda different

- Curried by default
- Data-last
- Composable

???

So what is ramda? It’s a utility library like lodash or underscore, and in fact has most of the same functions. Real quick, is anyone here not familiar with lodash or underscore?

No problem. Briefly, they're these utility libraries that give you a grab bag of useful functions, like map and reduce and sort. They were particularly useful before ES6 added a lot of those kinds of functions to the array prototype, but most modern JavaScript projects still include one of them.

What makes ramda different is three main things: it’s curried by default, it’s data-last, and because of the first two, it’s particularly composable. And by the way that also describes lodash/fp, which we'll get to in a few slides. So let’s see what all that jargon actually means.

---

## Currying

### Under the hood

```javascript
function add(n1) {
  return function(n2) {
    return n1 + n2;
  }
}
```

### Example

```javascript
add(1)(2) // 3
add(1, 2) // 3
```

???

Currying. Currying is a technique (named after the mathematician Haskell Curry, and not the delicious food) that says that if you have a function that takes say two arguments, if you called it with one argument, you'd get back a function that's waiting for the second argument. Once you pass in that second argument, the functions returns as normal.

Currying is really similar to partial application, which you may have used with something like lodash dot partial.

So we can see what that looks like at the top here - it's basically just a higher order function. The difference between this and the real thing is that with a real curried function, you can either pass arguments one at a time, or all at once, as you can see at the bottom.

Since add is curried, add(1)(2) does the same thing as add(1, 2)

Currying is a pretty simple concept, but it can unlock some pretty powerful techniques.

---

## Curried by default

### lodash

```javascript
function addSalesTax(price) {
*  return price * 1.1025;
}

addSalesTax(20); // 22.05
```

### ramda

```javascript
import R from 'ramda';

const addSalesTax = R.multiply(1.1025);

addSalesTax(20); // 22.05
```

???

We can see what currying actually does for us here. Sales tax in Santa Monica is 10.25%. So if I wanted a function that adds sales tax to a price, in the first example without Ramda, I would do it in the normal way - take a number and multiply it by one point ten 25.

But the ramda has a curried multiply function - so when I pass only one argument to it, I get back a function exactly like the first example - it takes in a number, and sales tax to it. But I was able to do that is this really concise, declarative way - addSalesTax literally is just multiply by 1 point ten 25, and currying lets me say that.

One thing to note is that lodash (like ramda) also has a curry function that takes a normal function and makes it curried, so you can use this same technique with lodash. It’s just not on by default, and as we’ll see in a second, not as useful with lodash.

---

## Data-Last

### Lodash

```javascript
function addSalesTaxToAll(prices) {
  return _.map(numbers, addSalesTax);
}

addSalesTaxToAll([20, 40]) // [22.05, 44.10];
```

### Ramda

```javascript
const addSalesTaxToAll = R.map(addSalesTax);

addSalesTaxToAll([20, 40]) // [22.05, 44.10];
```

???

Data-last. With lodash, most functions take the data they’re operating on as the first argument, and the function doing the work as the second argument. So for instance map is a well-known function that takes an array, applies a function to every item in the array, and returns the results as a new array. So we can pass map an array of numbers, then pass our sales tax function from the last slide, and get an array of prices with sales tax. Easy enough.

With ramda, the order of arguments is reversed - we pass the function first, then the array. It’s a small change, but because of that, map being curried becomes a lot more useful. Now we can pass the sales tax function from the last slide to map, and we're done. When addSalesTaxToSum gets passed an array, it’ll apply that function to each item and return an array.

---

## Composable

```javascript
function addSalesTaxForTen(`prices`) {
  return addSalesTax(_.multiply(10, `prices`));
}

addSalesTaxForTen(2); // 22.05
```

???

So the curried functions are kind of cool, because they save you some keystrokes. Fine. That’s nice, but probably not worth a whole new library. The power of ramda comes with function composition. Because it’s easy to define functions as partial applications of other functions, it's easy to put together a set of functions that are all awaiting final data argument, like add(1), and compose them together in a chain. Let's see how that actually looks.

So in this non-ramda code, we've got a function that takes a prices, multiplies it by 10, then calculates sales tax for the whole thing.

Anyway as a ramda developer, I see a code smell. I'm taking an argument, prices, and passing it as the last argument to a function, and then wrapping that whole thing as the last argument to another function. And once you start looking for this pattern, you'll start seeing it everywhere. It means that we can refactor this code into a function composition.  So what's that look like?

--

```javascript
const addSalesTaxForTen = R.compose(addSalesTax, R.multiply(10));

addSalesTaxForTen(2); // 22.05
```

???

Using ramda's compose function, we can chain the functions together, without ever having to actually get a hold of the parameter or use the function keyword.  Starting from the end, sum gets passed the numbers array, then passes its return value to multiply 10, and so on if there were more. In the Haskell language (another thing named after Haskell Curry), which Ramda takes a lot of inspiration from, this sort of composition is called "point-free style", because the parameters, or "points", are never formally declared.

--

```javascript
const addSalesTaxForTen = R.pipe(R.multiply(10), addSalesTax);

addSalesTaxForTen(2.27); // 25.02675
```

???

Another option is to use pipe instead of compose. It works exactly the same, but flips the order - multiply comes first instead of last (which doesn't matter in this case, but whatever). Compose is great for refactoring, because you can see how easy it is to go from the first version to the second version - just move some parentheses around. Pipe, we've found, is easier to read later - reading functions left-to-right is a lot more natural for english speakers. Which you use is really just a matter of preference.

So why is this actually useful? Well other that being arguably more beautiful, it keeps the focus on the functions, instead of the values being passed through. It can also be a lot easier to maintain. For instance, addSalesTax doesn't round to the nearest penny. How can we add that in?

--

```javascript
const addSalesTaxForTen = R.pipe(
  R.multiply(10),
  addSalesTax,
  roundToCents
);

addSalesTaxForTen(2.27); // 25.03
```

???

Given a roundToCents function, with pipe it's easy - we add it to our pipeline, and now our answers are rounded. Nice and easy, and much better than having to insert it into some deeply nested function calls.

---

class: center middle

## lodash/fp

???

If all this is sounding familiar to you, I should mention is that lodash actually comes with something really similar to ramda, called lodash/fp. It's all the normal lodash functions, but with the curryed-by-default, data-last stuff. It works pretty well, and if you're used to lodash the function names might be more familiar. But my big issue with it is it doesn't have typescript type definitons yet, so you can't really use it with TypeScript. As we'll see at the end of the talk, that's a big loss. If you're on a javascript project though, it could be a good choice, and you can use all the techniques I'm talking about tonight.

---

class: center middle

<img src="deck/images/hipster.jpg" />

???

So anyway maybe all this is cool, but tragically we’re not being paid to write cool code. We get paid to write software that is correct, and that is easy to maintain. So what I want to do next is go through a small scenario that might be similar to something you’d do at work, though of course a lot simpler. That way, we can see how ramda can make our lives a little easier when building, maintaining, and refactoring our actual code.

---

class: center

## marbl.ly

<img src="deck/images/marbles.jpg" width="80%" />

???

So this is the scenario: we’re all working for a new startup, marbl.ly. And here’s the pitch: say you have a bag of marbles, with this app, if you tell it about your marbles, it will sort and count them for you, and then if you lose one, someone will bring you a new one. It’s like Uber for marbles, it’s going to be huge.

But for now this is a startup, so we’re going to try to be agile about building this - we’ll start with something really simple to make sure we're on the right track, build up from there. We'll also start with standard ES6 code, and then refactor into a more compositional style.

---

## The marble model

```typescript
interface Marble {
  size: string;
  color: string;
}

const marble: Marble = {
  color: 'red',
  size: 'large'
}
```

???

Here’s the model for our app. This is a TypeScript interface; it describes the shape of an object, so elsewhere functions can say, “I only take arguments that match this interface.” And as you can see, there’s not a lot going on here. A marble has a size and a color, both of which are just strings like “large” or “red”. In TypeScript you declare a type for an object by putting it after a colon - so here we're saying that marble implements the marble interface.

So we have marbles, and a bag of marbles is represented by just an array of these marble objects. What we’re going to be building as part of our MVP is a set of functions that take an array of marbles, and just filter and count them in different ways.

---

class: center

## Red marbles

<img src="deck/images/red-marble.jpg" width="80%" />

???

So where to begin? Well we want to build part of the core functionality first, so the product owners can get their hands on it as soon as possible. So maybe our first story is to just be able to find all the red marbles in the bag.

---

## reds()

```javascript
function reds(marbles) {
  return marbles.filter((marble) => {
    return marble.color === 'red';
  });
}
```

???

So first we... set up our complicated build pipeline because that’s step one with javascript these days. But then we pick up the story, and pretty soon we’ve got something reasonable. We take the array of marbles, and filter for the ones where color equals red. This should look pretty familiar to anyone doing ES6 development. It looks good, and certainly this is a lot better than something like a for loop - we’re talking about marbles and how to filter them, and not indexes and pushing and popping, which is great.

So how can we refactor this with ramda?

---

## reds(): refactor 1

```javascript
const isRed = (marble) => marble.color === 'red';

function reds(`marbles`) {
  return R.filter(isRed, `marbles`);
}
```

???

Step one is probably to pull out that isRed function, and to use ramda’s filter instead of the native one. Now that we’ve done this, we can see that that pattern show up again - we’re just taking in marbles, and passing them as the last argument to filter. Since filter is curried, so we don’t need to declare this function at all! That leads to the second refactor:

---

## reds(): refactor 2

```typescript
const isRed = (marble) => marble.color === 'red';
*const reds = R.filter(isRed);
```

???

Here we've dropped the function declaration entirely, and just declared reds as filter(isRed). Pretty nice.

---

class: center

## filterMarbles()

<img src="deck/images/filtered-marbles.jpg" width="80%" >

???

Okay, so we can find red marbles. We get that branch merged in, and pick up the next story - filter for any color or size marble.

---

## filterMarbles() - ES6

```typescript
function isMatchingMarble(marble, attribute, value) {
* return marble[attribute] === value;
}

function filterMarbles(marbles, attribute, value) {
  return marbles.filter(marble =>
*   isMatchingMarble(marble, attribute, value)
  );
}

function reds(marbles) {
  return filterMarbles(marbles, 'color', 'red');
}
```

???

If we wanted to do that in ES6, it would probably look something like this. We learned from our last Ramda refactor, so this time we extract this isMatchingMarble function to start with. And this time it takes in an attribute and a value, and checks if they match. Then our filterMarbles function just takes in all the data, and for each marble passes it along to the isMatchingMarble function. Since isMatchingMarble isn’t curried, this is kind of verbose, since we're taking in three parameters, and passing them directly to another function that also has to take three parameters. Still, pretty reasonable, and now we can run filterMarbles with marbles, color, red, to recreate our old reds function. But we can do better: let’s see what ramda can do to clean this up.

---

## filterMarbles(): refactor

```javascript
const filterMarbles = R.curry((attribute, value, marbles) =>
  R.filter(`propEq(attribute, value)`, marbles)
);

const reds = filterMarbles('color', 'red');
```

???

So first of all - Ramda actually supplies a propEquals function that does the same thing as our isMatchingMarble function - it takes an attribute like color and a value like red, and an object, and sees if it has a color red or whatever. But it's curried for easier use. So we can drop that function entierly.

---

count: false

## filterMarbles(): refactor

```javascript
const filterMarbles = R.curry((`attribute, value`, marbles) =>
  R.filter(R.propEq(`attribute, value`), marbles)
);

const reds = filterMarbles('color', 'red');
```

???

Unfortunatly, because we have to pass attribute and value to an interior function call, this can't be a point-free function - we have to actually declare our formal parameters and pass them around.

---

count: false

## filterMarbles(): refactor

```javascript
const filterMarbles = `R.curry`((attribute, value, marbles) =>
  R.filter(R.propEq(attribute, value), marbles)
);

*const reds = filterMarbles('color', 'red');
const filterByColor = filterMarbles('color');
const redMarbles = filterMarbles('color', 'red', marbles);
```

???

But, we wrapped Ramda's curry function around our function deceleration. That means that like with the library functions, we can call filterMarbles color, red to re-create the function that pulled out red marbles, which is nice. But we could also make a function that takes a color and a marble array, or just call the whole thing at once.

---

class: center

## Favorite Color

<img src="deck/images/green-marbles.jpg" width="80%" >

???

Okay, so by now hopefully you're feeling pretty good on function currying and composition. So for the last example, let's try something a little more complicated. Our next story is to build a favorite color feature - we want to search through a user's bag of marbles, find the most common color, and return it. Not too crazy, but this will definitly take a little more logic than the other examples.

---

## favoriteColor() types

```typescript
const marbles = [
  { color: 'red', size: 'small' },
  { color: 'blue', size: 'small' },
  { color: 'red', size: 'large' },
];
```

```typescript
function favoriteColor(marbles) {
  return 'red';
}
```

???

Before we go on to the ramda answer, can anyone tell me an approach on how you would solve this? Here's some sample data, and a stubbed out favoriteColor function, if that helps. I'll give you a moment to think about it, and don't worry if your idea is only half-baked - if you're answer is too good, you won't be impressed by the ramda solution!

---

## favoriteColor() - imperative

```javascript
function favoriteColor(marbles) {
  const counts = {};

  _.forEach(marbles, marble => {
    counts[marble.color] = (counts[marble.color] || 0)  + 1;
  });

  let biggestNumber = 0;
  let biggestColor;

  _.forEach(counts, (count, color) => {
    if (count > biggestNumber) {
      biggestColor = color;
      biggestNumber = count;
    }
  });

  return biggestColor;
}
```

???

Here's my imperitive solution. It's not really that interesting to take a close look, but there are a couple loops, some mutation, and a couple contionals. You could probably make it more functional with reduce, and more readable by extracting some functions. Whatever, I don't want to program like this anymore anyway. Let's see what this looks like in ramda.

---

## favoriteColor() pipeline

```typescript
const favoriteColor = R.pipe(
  R.groupBy(R.prop('color')),
  R.mapObjIndexed(length),
  R.toPairs,
  R.sortBy(last),
  R.last,
  R.head
);
```

???

So unlike the previous examples, this looks nothing like the imperitive solution. It's also pretty dense, so let's walk through what's going on here.

---

## favoriteColor() pipeline

```typescript
const favoriteColor = `R.pipe`(
  R.groupBy(R.prop('color')),
  R.mapObjIndexed(length),
  R.toPairs,
  R.sortBy(last),
  R.last,
  R.head
);
```

???

First, we're again using the pipe function we saw at the begining of the talk, so our marbles go into groupBy, and its output goes into mapObjIndexed, and so on, until it returns. 
<!-- This is where typescript can really shine - the types make sure that as you tranform your data, the output type from one function matches the input type of the next one. -->

So what's happening here?

---

## favoriteColor() pipeline

```typescript
const favoriteColor = R.pipe(
  R.groupBy(`R.prop('color')`),
  R.mapObjIndexed(length),
  R.toPairs,
  R.sortBy(last),
  R.last,
  R.head
);
```

???

First, prop is a ramda function that extracts an attribute from an object, so calling prop('color') on a marble would get you back "red".

---

## favoriteColor() pipeline

```typescript
const favoriteColor = R.pipe(
* R.groupBy(R.prop('color')),
  // {
  //   red: [
  //    { color: 'red', size: 'small' },
  //    { color: 'red', size: 'large' },
  //   ],
  //   blue: [
  //    { color: 'blue', size: 'small' },
  //   ]
  // }
  R.mapObjIndexed(length),
  R.toPairs,
  R.sortBy(last),
  R.last,
  R.head
);

favoriteColor([
  { color: 'red', size: 'small' },
  { color: 'blue', size: 'small' },
  { color: 'red', size: 'large' },
]);
```

???

GroupBy is a function that does mostly the same thing as the first part of the imperitive solution - takes an array of marbles, and a function that gets colors from marbles, and turns it into a dictionary where the keys are colors and the values are arrays of the matching marbles.

Given the sample data at the bottom, this is what groupBy would return - the same marbles, but grouped by their color prop. And hey, that's exactly what the code says it would do!

---

## favoriteColor() pipeline

```typescript
const favoriteColor = R.pipe(
  R.groupBy(R.prop('color')),
* R.mapObjIndexed(length),
  // {
  //   red: 2,
  //   blue: 1
  // }
  R.toPairs,
  R.sortBy(last),
  R.last,
  R.head
);

favoriteColor([
  { color: 'red', size: 'small' },
  { color: 'blue', size: 'small' },
  { color: 'red', size: 'large' },
]);
```

???

mapObjIndexed is ramda mapping function for objects. It works like map, but returns an object where only the values are changed, and the keys are the same. So passing the array counting function "length" in lets us transform a dictionary of marble arrays into a dictionary of marble counts.

---

## favoriteColor() pipeline

```typescript
const favoriteColor = R.pipe(
  R.groupBy(R.prop('color')),
  R.mapObjIndexed(length),
* R.toPairs,
  // [
  //   ['red', 2],
  //   ['blue', 1],
  // }
  R.sortBy(last),
  R.last,
  R.head
);

favoriteColor([
  { color: 'red', size: 'small' },
  { color: 'blue', size: 'small' },
  { color: 'red', size: 'large' },
]);
```

???

Next we use toPairs to transform the key-value combinations to an array of arrays of [color, count]. In other functional languages you'd use a tuple instead of a pair, but we're in javascript, so close enough.

In any case, this will let us sort the arrays.

---

## favoriteColor() pipeline

```typescript
const favoriteColor = R.pipe(
  R.groupBy(R.prop('color')),
  R.mapObjIndexed(length),
  R.toPairs,
* R.sortBy(last),
  // [
  //   ['blue', 1],
  //   ['red', 2],
  // }
  R.last,
  R.head
);

favoriteColor([
  { color: 'red', size: 'small' },
  { color: 'blue', size: 'small' },
  { color: 'red', size: 'large' },
]);
```

???

Here, we're sorting the arrays by count. "Last" just gives us the last item in an array, which in this case for each element is the count.

---

## favoriteColor() pipeline

```typescript
const favoriteColor = R.pipe(
  R.groupBy(R.prop('color')),
  R.mapObjIndexed(length),
  R.toPairs,
  R.sortBy(last),
* R.last,
  // ['red', 2],
  R.head
);

favoriteColor([
  { color: 'red', size: 'small' },
  { color: 'blue', size: 'small' },
  { color: 'red', size: 'large' },
]);
```

???

Then we use last again to get the higest count

---

## favoriteColor() pipeline

```typescript
const favoriteColor = R.pipe(
  R.groupBy(R.prop('color')),
  R.mapObjIndexed(length),
  R.toPairs,
  R.sortBy(last),
  R.last,
* R.head
  // 'red'
);

favoriteColor([
  { color: 'red', size: 'small' },
  { color: 'blue', size: 'small' },
  { color: 'red', size: 'large' },
]);
```

???

And finally use head, which returns the first element in an array, to get the first element in the pair, the color. Done!

So as you can see, using Ramda doesn't just allow you code to be shorter - it also pushes you towards somtimes radically different solutions than what would be easy to do without it.

That said, I think that reasonable people could disagree on if they like this or the imeritive version more. For me, this is nice. It's certainly very functional, and I like the clear step-by-step process. It does rely on the pairs construct, which isn't super intuitive, the the last, last, head thing at the end is a little hard to follow, and it's dense enough that it'd probably be easy to get the types wrong somehow and let a bug in. Let's see if we can do something at least about the last two issues.

---

## favoriteColor() refactor

```javascript
*const highestPair = R.last;
*const colorFromPair = R.head;
*const countFromPair = R.last;

const favoriteColor = R.pipe(
  R.groupBy(R.prop('color')),
  R.mapObjIndexed(length),
  R.toPairs,
* R.sortBy(countFromPair),
* highestPair,
* colorFromPair
);
```

???

So there's an easy fix to the last last head thing being confusing - declare more relevant names for the functions! This assignment is basically free, and I think it makes what the pipeline does a lot more obvious.

But even with that, you could imagine this being pretty hard to debug during development. You have to keep in your head what each function returns, to make sure that the next function takes the right kind of data. And it can be easy to make mistakes - for instance, if you forgot that the normal map function doesn't work well with objects, and used it instead of mabObjIndexed, it might take a while to track down why your function wasn't working.

Happily, matching up types is something compilers are good at. So if we introduce TypeScript, our job gets a lot easier.

---

## Side Note: TypeScript

### JavaScript

```javascript
function helloWorld(times) {
  return 'Hello World! '.repeat(times);
}
```

```typescript
function helloWorld(times: number): string {
  return 'Hello World! '.repeat(times);
}
```

???

So who here has programmed in TypeScript? As a quick primer for anyone not familar, TypeScript is a language by Microsoft that is a statically typed superset of javascript. TypeScript code looks like JavaScript, and in fact JavaScript is generally valid TypeScript - if you change the extension from .js to .ts, it'll probably compile. The difference is that in typescript you can add type annotations with a colon, like with number and string. You can also define your own types, like the Marble interface we saw earlier.

Once you have type annotation, the typescript compiler can catch all kinds of type errors for you. This ends up being super useful with complicated Ramda compositions.

---

## favoriteColor(): Typescript

```typescript
*type ColorPair = [string, number];

const highestPair: (a: ColorPair[]) => ColorPair = R.last;
const colorFromPair: (a: ColorPair) => string = R.head;
const countFromPair: (a: ColorPair) => number = R.last;

const favoriteColor: (a: Marble[]) => string = R.pipe(
  R.groupBy(R.prop('color')),
  R.mapObjIndexed(length),
  R.toPairs,
  R.sortBy(countFromPair),
  highestPair,
  colorFromPair
);
```

???

So here's our same pipeline, but now in typescript. You can see that we're defining a special pair type, to make those pairs a little easier to work with.

We're also adding type signatures to the const functions. This is nice for two reasons - first, it gives typescript enough information to find type errors. Second, it's documentation - naming colorFromPair is clear, but enforcing that it pulls a string from a colorPair is really clear. And since our point-free functions don't declare formal parameters, having a place to say what those parameters actually are is nice.

---

class: center

## favoriteColor(): Typescript catching bugs

<img src="deck/images/pipe-error.png" width="80%">

???

So we can see here that if we made that mistake of using map instead of mapIndexedObj, this time TypeScript catches it right away. If we hover over that error, it tells us that map is expecting an array and is getting an object. Perfect!

TypeScript is definitely the secret weapon with ramda, and is a big reason to chose ramda over lodash/fp. The nice thing is that between the declaritiveness of ramda, and the type safety of TypeScript - if a function looks right, and typechecks, it's probably correct. You definitely still need unit tests to catch edge cases, but the confidence you feel when you get all the red lines to go away is really nice.

---

## favoriteColor(): In Angular 4

```typescript
type ColorPair = [string, number];

*class FavoritesComponent {
* marbles: Marble[];
*
* favoriteColor() {
*   return favoriteColor(this.marbles);
* }
*}

const highestPair: (a: ColorPair[]) => ColorPair = R.last;
const colorFromPair: (a: ColorPair) => string = R.head;
const countFromPair: (a: ColorPair) => number = R.last;

const favoriteColor: (a: Marble[]) => string = R.pipe(
  R.groupBy(R.prop('color')),
  R.mapObjIndexed(length),
  R.toPairs,
  R.sortBy(countFromPair),
  highestPair,
  colorFromPair
);
```

???

So pulling it all together, we're currently using Ramda on an Angular 4 project, and this is what a lot of the code looks like - a bunch of small pointfree functions, composed together into more complicated functions, and tested in isolation. Then our component classes mostly just handle holding state, and call out to the pure functions for any logic.

It's made our code really readable and testable - and we've had some fun suggesting refactors while pairing - "hey, we can actually drop that last parameter all together".

---

## Other Cool Stuff

- lenses
- ifEquals/cond
- FantasyLand (Monads, Functors, etc.)
- [Searchable Docs](http://ramdajs.com/docs)
- [What Function Should I Use](https://github.com/ramda/ramda/wiki/What-Function-Should-I-Use%3F)

???

Okay, so that's probably enough for one talk. But there's a lot more in ramda to dig into, if you're interested.

- Lenses are a way of creating functions that can get and set deeply nested data without mutation, which can be great for something like redux.
- ifEquals and cond are functions that can let you embed conditional logic in your pipelines
- FantasyLand is interesting - it's a set of interfaces for functional constructs like Monads and Functors. If that's something that you're interested in, ramda supports fantasy land, so map can map over any FantasyLand-compliant functor, for instance. If that doesn't mean anything to you, don't worry, you don't have to know about that stuff to get a lot out of ramda.
- Finally, since there are so many functions, it's helpful that the docs are pretty good. The official API docs are pretty extensive, and they also have this nice "what function should I use" page that I find really useful.

---

class: center middle

## Wrapping up

???

So! Hopefully that was a good taste of what programming with Ramda is like. It's a pretty different and fun way to program, and is a way to get a lot of the benefits of a super functional langage like Haskell or Elixir, but within an existing javascript project. As we've seen, it's also usually pretty straightforward to refactor a lodash function into a ramda one, so this is definitly something you can start using today, if your team is up for it.

---

class: center middle

## My advice?

???

So my advice to you is:

---

count: false
class: center middle

<img src="deck/images/do-it.gif" width="80%">

---

class: center middle

## Thanks!
