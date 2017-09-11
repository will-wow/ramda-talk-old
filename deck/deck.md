class: front-slide

<div class="front">
  <h1>Say What You Mean</h1>

  <h2>Declarative programming with TypeScript and Ramda</h2>

  <h3>Will Ockelmann-Wagner • wow@carbonfive.com • @WowItsWillWow</h3>

  <img class="front-logo" src="deck/images/c5-logo-full.png">

  TODO: explain our code is a bunch of small functions

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

Given that, we can talk about currying. Currying is a technique (named after the mathematician Haskell Curry, and not the delicious food) that says that if you have a function that takes two arguments, like the first signature, and you pass one argument in, you get back a function, like in the second signature. It keeps the first argument in memory, takes the second argument, and then does whatever it’s supposed to do. Currying is really similar to partial application, which you may have used with something like lodash dot partial.

Put another way, if add is curried, both add(1, 2) and add(1)(2) work the same way. Does that make sense to everybody?

---

## Curried by default

### lodash

```typescript
function addOne(n: number): number {
*  return _.add(1, n);
}
```

### ramda

```typescript
const addOne: (n: number) => number = add(1);
```

???

We can see what currying actually does for us here - in the first example, with lodash, if I wanted a function that adds one to a number, I would do it in the normal way - take a number argument, add it, and return it. And yes, I could have just used plus.

But the ramda version of add is curried - so when I pass only one argument to it, I get back a function exactly like the first example - it takes in a number, and adds one to it. They also have the same type signature. But I was able to do that is this really concise, declarative way - addOne literally is just add one, and currying lets me say that.

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
const addOneToAll: (ns: number[]) => number[] = `map(addOne)`;
```

???

Data-last. With lodash, most functions take the data they’re operating on as the first argument, and the function doing the work as the second argument. So for instance map is a function that takes an array, applies the function to every item in the array, and returns the results as a new array. So we can pass map an array of numbers, then pass our adder function from the last slide, and get an array of numbers plus one. Easy enough.

With ramda, the order of arguments is reversed - we pass the function first, then the array. It’s a small change, but because of that, map being curried becomes a lot more useful. Now I can pass my adder function from the last slide to map, and I’m done. When addOneToAll gets passed an array, it’ll apply that function to each item and return them.

---

## Composable

```typescript
export function tenTimesSum(`numbers`: number[]): number {
  return multiply(10, sum(`numbers`));
}
```

???

So the curried functions are kind of cool, because they save you some keystrokes. Fine. That’s nice, but probably not worth a whole new library. The power of ramda comes with function composition. Because it’s easy to define functions as partial applications of other functions, it's easy to put together a set of functions that are all awaiting a final value, like add 1, and compose them together in a chain. Let's see how that actually looks.

So in this code, we've got a function that takes an array of numbers, sums them up, and multiplies the answer by 10. I don't know why you need to do that, but I don't judge.

Anyway as a ramda developer, I see a code smell. I'm taking an argument, numbers, and passing it as the last argument to a function, and then wrapping that whole thing as the last argument to another function. That means we can refactor this code into a function composition. And once you start looking for this smell, you'll start seeing it everywhere. So what's the refactor?


--

```typescript
const tenTimesSum: (numbers: number[]) => number =
*compose(multiply(10), sum);
```

???

Using ramda's compose function, we can chain the functions together, without ever having to actually get a hold of the parameter or use the function keyword.  Starting from the end, sum gets passed the numbers parameter, then passes its return value to multiply 10, and so on if there were more. In the Haskell language (another thing named after Haskell Curry), which Ramda takes a lot of inspiration from, this sort of composition is called “point-free style”.

--

```typescript
const tenTimesSum: (numbers: number[]) => number =
*pipe(sum, multiply(10));
```

???

Another option is to use pipe instead of compose. It works exactly the same, but fips the order - sum comes first instead of last. Compose is great for refactoring, because you can see how easy it is to go from the first version to the second version. Pipe, we've found, is easier to read later - reading functions left-to-right is a lot more natural for english speakers. It's really just a matter of preference.

So why is this actually useful? Well other that being arguably more beautiful, it keeps the focus on the functions, instead of the values being passed through. It can also be a lot easier to maintian. For instance, there's a potential bug in this code - if one of the values in the numbers array was undefined, sum would fail, and return NaN. How can we fix it?

--

```typescript
const tenTimesSum: (numbers: number[]) => number = pipe(
* reject(isNil),
  sum,
  multiply(10)
);
```

???

We can just add a function that removes all nil values to our pipeline. Nice and easy, and much better than having to insert it into some deeply nested function calls.

---

class: center middle

## lodash/fp

???

If all this is sounding familiar to you, I should mention is that lodash actually comes with something really similar to ramda, called lodash/fp. It's all the normal lodash functions, but with the curryed-by-default, data-last stuff. It works pretty well, and if you're used to lodash the function names might be more familiar. But my big issue with it is it doesn't have typescript type definitons yet, so you can't really use it with TypeScript. If you're on a javascript project though, it could be a good choice.

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
```

???

Here’s the model for our app. This is a TypeScript interface; it describes the shape of an object, so elsewhere functions can say, “I only take arguments that match this interface.” And as you can see, there’s not a lot going on here. A marble has a size and a color, both of which are just strings like “large” or “red”.

So we have marbles, and a bag of marbles is represented by just an array of these marble objects. What we’re going to be building as part of our MVP is a set of functions that take an array of marbles, and just filter and count them in different ways.

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

function reds(`marbles`: Marble[]): Marble[] {
  return filter(isRed, `marbles`);
}
```

???

Step one is probably to pull out that isRed function, and to use ramda’s filter instead of the native one. Now that we’ve done this, we can see that we’re just taking in marbles, and passing them right to filter. But filter is curried, so we don’t need to declare this function at all! That leads to the second refactor:

---

## reds(): refactor 2

```typescript
const isRed = (marble: Marble): boolean => marble.color === 'red';
const reds: (a: Marble[]) => Marble[] = `filter(isRed)`;
```

???

We can actually drop the function declaration entirely, and just declare reds as filter(isRed). Since filter is curried, that's all we need. 

---

count: false

## reds(): refactor 2

```typescript
const isRed = (marble: Marble): boolean => marble.color === 'red';
const reds: `(a: Marble[]) => Marble[]` = filter(isRed);
```

???

I'm adding a type signature both to make it clear to readers what this function does, and to make sure that our function does what we expect it to. 

---

count: false

## reds(): refactor 2

```typescript
const isRed = (marble: Marble): boolean => marble.color === 'red';
const reds: (`a`: Marble[]) => Marble[] = filter(isRed);
```

???

One thing you might notice is that I’m just calling the Marble argument “a”. That’s usually bad programming practice - you want to name your variables with full words, so you’re not confused about what they do later. In this case though, we’re not passing that “a” to anything, and we don’t really care about the name, only the types - mable array to marble array. So on my current project we’ve been just naming those variables abc, to keep the focus on the types.

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

<img src="deck/images/filtered-marbles.jpg" width="80%" >

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
*  return marble[attribute] === value;
}

function filterMarbles(
  marbles: Marble[],
  attribute: keyof Marble,
  value: string
): Marble[] {
*  return marbles.filter(marble =>
*    isMatchingMarble(marble, attribute, value)
  );
}
```

???

If we wanted to do that in ES6, it would probably look something like this. We learned from our last Ramda refactor, so this time we pull that isMatchingMarble function out to start with. And this time it takes in an attribute and a value, and checks if they match. Then our filter function just takes in all the data, and for each marble passes it along to the isMatchingMarble function. Since isMatchingMarble isn’t curried, this is kind of verbose, but still, pretty reasonable, and now we can run filterMarbles with marbles, color, red, to recreate our old reds function. Still, let’s see what ramda can do to clean this up.

---

## filterMarbles(): refactor

```typescript
const filterMarbles = curry(
  (
    attribute: keyof Marble,
    value: string,
    marbles: Marble[]
  ): Marble[] => filter(`propEq(attribute, value)`, marbles)
);
```

???

So this is nice - Ramda actually supplies a propEquals function that does the same thing as our isMatchingMarble function, but is curried for easier use. 

---

count: false

## filterMarbles(): refactor

```typescript
const filterMarbles = curry(
  (
*    attribute: keyof Marble,
*    value: string,
*    marbles: Marble[]
  ): Marble[] => filter(propEq(`attribute, value`), marbles)
);
```

???

Sadly, because we have to pass attribute and value to an interior function call, this can't be a point-free function - we have to actually declare our formal parameters and pass them around.

---

count: false

## filterMarbles(): refactor

```typescript
const filterMarbles = `curry`(
  (
    attribute: keyof Marble,
    value: string,
    marbles: Marble[]
  ): Marble[] => filter(propEq(`attribute, value`), marbles)
);

filterMarbles('color')('red')(marbles);
*filterMarbles('color', 'red')(marbles);
filterMarbles('color', 'red', marbles);
```

???

But, we can wrap Ramda's curry function around our function, which means that like the library functions, we can call filterMarbles color, red to make a function that pulls out red marbles, which is nice.

---

class: center

## Favorite Color

<img src="deck/images/green-marbles.jpg" width="80%" >

???

Okay, so by now hopefully you're feeling pretty good on currying and types. So for the last example, let's try something a little more complicated. Our next story is to build a favorite color feature - we want to search through a user's bag of marbles, find the most common color, and return it. Not too crazy, but this will definitly take a little more logic than the other examples.

---

## favoriteColor() types

```typescript
interface Marble {
  size: string;
  color: string;
}
```

```typescript
const favoriteColor: (a: Marble[]) => string;
```

???

Before we go on to the ramda answer, can anyone tell me an approach on how you would solve this? Here are the types again for a Marble and our favoriteColor function, if that helps. I'll give you a moment to think about it, and don't worry if your idea is only half-baked - if you're answer is too good, you won't be impressed by my solution!

---

## favoriteColor() - imperitive

```typescript
function favoriteColor(marbles: Marble[]): string {
  const counts: { [color: string]: number } = {};

  _.forEach(marbles, (marble: Marble): void => {
    counts[marble.color] = (counts[marble.color] || 0)  + 1;
  });

  let biggestNumber: number = 0;
  let biggestColor: string;

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

Here's my imperitive solution. It's not really that interesting to take a close look, but there are a couple loops, some mutation, and a couple contionals. You could probably make it more functional with reduce, and more readable by extracting some functions. Whatever. Let's see what this looks like in ramda.

---

## favoriteColor() pipeline

```typescript
const favoriteColor: (a: Marble[]) => string = pipe(
  groupBy(prop('color')),
  mapObjIndexed(length),
  toPairs,
  sortBy(last),
  last,
  head
);
```

???

So unlike the previous examples, this looks nothing like the imperitive solution. It's also pretty dense, so let's walk through what's going on here.

---

count: false

## favoriteColor() pipeline

```typescript
const favoriteColor: (a: Marble[]) => string = `pipe`(
  groupBy(prop('color')),
  mapObjIndexed(length),
  toPairs,
  sortBy(last),
  last,
  head
);
```

???

First, we're using the pipe function we saw at the begining of the talk, so our marbles go into groupBy, and its output goes into mapObjIndexed, and so on, until it returns. This is where typescript can really shine - the types make sure that as you tranform your data, the output type from one function matches the input type of the next one.

So what's happening here?

---

count: false

## favoriteColor() pipeline

```typescript
const favoriteColor: (a: Marble[]) => string = pipe(
  groupBy(`prop('color')`),
  mapObjIndexed(length),
  toPairs,
  sortBy(last),
  last,
  head
);
```

???

We use prop color to make a function that extracts the color from a marble

---

count: false

## favoriteColor() pipeline

```typescript
const favoriteColor: (a: Marble[]) => string = pipe(
* groupBy(prop('color')),
  mapObjIndexed(length),
  toPairs,
  sortBy(last),
  last,
  head
);
```

???

GroupBy is a function that does mostly the same thing as the first part of the imperitive solution - takes an array of marbles, and a function that gets colors from marbles, and turns it into a dictionary where the keys are colors and the values are arrays of the matching marbles.

---

count: false

## favoriteColor() pipeline

```typescript
const favoriteColor: (a: Marble[]) => string = pipe(
  groupBy(prop('color')),
* mapObjIndexed(length),
  toPairs,
  sortBy(last),
  last,
  head
);
```

???

mapObjIndexed is ramda mapping function for objects. It works like map, but returns an object where only the values are changed. This lets us transform a dictionary of marble arrays into a dictionary of marble counts.

---

count: false

## favoriteColor() pipeline

```typescript
const favoriteColor: (a: Marble[]) => string = pipe(
  groupBy(prop('color')),
  mapObjIndexed(length),
* toPairs,
  sortBy(last),
  last,
  head
);
```

???

Next we use toPairs to transform the key-value combinations to an array of arrays of color comma count

---

count: false

## favoriteColor() pipeline

```typescript
const favoriteColor: (a: Marble[]) => string = pipe(
  groupBy(prop('color')),
  mapObjIndexed(length),
  toPairs,
* sortBy(last),
  last,
  head
);
```

???

Now that we have an array, we can sort it by count. Last just gives us the last item in an array, which in this case for each element is the count.

---

count: false

## favoriteColor() pipeline

```typescript
const favoriteColor: (a: Marble[]) => string = pipe(
  groupBy(prop('color')),
  mapObjIndexed(length),
  toPairs,
  sortBy(last),
* last,
  head
);
```

???

Then we use last again to get the higest count

---

count: false

## favoriteColor() pipeline

```typescript
const favoriteColor: (a: Marble[]) => string = pipe(
  groupBy(prop('color')),
  mapObjIndexed(length),
  toPairs,
  sortBy(last),
  last,
* head
);
```

???

And finally use head to get the first element in the pair, the color. Done!

So I think that reasonable people could disagree on if they like this or the imeritive version more. For me, this is nice. It's certainly very functional, and I like the clear step-by-step process. It does rely on the pairs construct, which isn't super intuitive, and the the last, last, head thing is a little hard to follow. Let's see if we can do something at least about the latter issue.

---

## favoriteColor() refactor

```typescript
type ColorPair = [string, number];

*const highestPair: (a: ColorPair[]) => ColorPair = last;
*const colorFromPair: (a: [string, number]) => string = head;
*const countFromPair: (a: [string, number]) => number = head;

export const favoriteColor: (a: Marble[]) => string = pipe(
  groupBy(prop('color')),
  mapObjIndexed(length),
  toPairs,
* sortBy(countFromPair),
* highestPair,
* colorFromPair
);
```

???

This is a little more code, but a lot easier to read. On my current ramda project, we've found ourselves doing this pattern a lot - redefining ramda functions with description names. It's definitly good for readability - colorFromPair makes a lot more sense than head. It's also sometimes nessecary to get things to TypeCheck. TypeScript has a concept of generics, which let you define polymorphic functions, but they don't really work when you pass a function as a parameter. Generics are probably worth their own talk, so I won't get into it, but if you end up using TypeScript with Ramda (and you should), keep this technique in mind.

So as you can see, using Ramda doesn't just allow you code to be shorter - it also pushes you towards somtimes radically different solutions than what would be easy to do without it.

---

## Other Cool Stuff

- lenses
- ifEquals/cond
- FantasyLand (Monads, Functors, etc.)
- [Searchable Docs](http://ramdajs.com/docs)
- [What Function Should I Use](https://github.com/ramda/ramda/wiki/What-Function-Should-I-Use%3F)

???

So that's probably enough for one talk. But there's a lot more in ramda to dig into, if you're interseted.

- Lenses are a way of creating functions that can get and set deeply neseted data without mutation, which can be great for something like redux.
- ifEquals and cond are functions that can let you embed conditional logic in your pipelines
- FantasyLand is interesting - it's a set of interfaces for functional construcuts like Monads and Functors. If that's something that you're interested in, ramda supports fantasy land, so map can map over any FantasyLand-complient functor, for instance. If that doesn't mean anything to you, don't worry, you don't have to know about that stuff to get a lot out of ramda.
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
