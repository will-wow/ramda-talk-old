# Say what you mean: Declarative programming with Ramda and TypeScript

Today I want to talk about Ramda, which is a functional utility library for javascript, and the functional, declarative, compositional style of programming that it allows for. We’ve been using it on a project at Carbon Five recently, and I think the team has found it to be a useful and particularly fun way to program. So today we’ll see some of the benefits of this style of programming, and then see how TypeScript can make it even more powerful.

## What makes ramda different

So what is ramda? Utility libraries that give you a grab bag of useful functions, like map and reduce and sort. They were particularly useful before ES6 added a lot of those kinds of functions to the array prototype, but most modern JavaScript projects still include one of them.

It’s a utility library like lodash or underscore, and in fact has most of the same functions, though sometimes with different names. Like lodash, it has the basic functional programming functions, like map, reduce, filter, and sort. Lodash and Underscore were particularly useful before ES6 added a lot of those kinds of functions to the array prototype, but most modern JavaScript projects still include one of the.

What makes ramda different is three main things: it’s curried by default, it’s data-last, and because of the first two, it’s particularly composable. And by the way that also describes lodash/fp, which we'll get to in a few slides. So let’s see what all that jargon actually means.

## Currying

Currying is a technique (named after the mathematician Haskell Curry, and not the delicious food) that says that if you have a function that takes say two arguments, if you called it with one argument, you'd get back a function that's waiting for the second argument. Once you pass in that second argument, the functions returns as normal. Currying is really similar to partial application, which you may have used with something like `_.partial`.

So we can see what that looks like at the top here - it's basically just a higher order function.

```javascript
function add(n1) {
  return function(n2) {
    return n1 + n2;
  }
}
```

The difference between this and the real thing is that with a real curried function, you can either pass arguments one at a time, or all at once, as you can see here:

```javascript
add(1)(2) // 3
add(1, 2) // 3
```

Since `add` is curried, `add(1)(2)` does the same thing as `add(1, 2)`

Currying is a pretty simple concept, but it can unlock some pretty powerful techniques.

For instance without currying, if I wanted a function that adds one to a number, I would do it in the normal way - take a number argument, add it, and return it.

```javascript
function addOne(n) {
  return _.add(1, n);
}
```

But the ramda version of add is curried - so when I pass only one argument to it, I get back a function exactly like the first example - it takes in a number, and adds one to it. But I was able to do that is this really concise, declarative way - addOne literally is just add one, and currying lets me say that.

```javascript
const addOne = add(1);
```

One thing to note is that lodash (like ramda) also has a curry function that takes a normal function and makes it curried, so you can use this same technique with lodash. It’s just not on by default, and not as useful with lodash.

## Data-Last

With lodash, most functions take the data they’re operating on as their first argument. So for instance `map` is a well-known function that takes an array,  applies a function to every item in the array, and returns the results as a new array. So we can pass `map` an array of numbers, then pass our `addOne` function from the last slide, and get an array of numbers plus one. Easy enough.

```javascript
function addOneToAll(numbers) {
  return _.map(numbers, addOne);
}

addOne([1, 2]) // [2, 3];
```

With ramda, the order of arguments is reversed - we pass the function first, then the array. It’s a small change, but because of that, map being curried becomes a lot more useful. Now we can pass the adder function to `map`, and we're done. When `addOneToAll` gets passed an array, it’ll apply `addOne` to each item and return.

```javascript
const addOneToAll = map(addOne);
```

## Composable

So the curried functions are kind of cool, because they save you some keystrokes. That’s nice, but probably not worth a whole new library. The power of ramda comes with function composition. Because it’s easy to define functions as partial applications of other functions, it's easy to put together a set of functions that are all awaiting that final data argument, like `add(1)`, and compose them together in a chain. Let's see how that actually looks.

In this non-ramda code, we've got a function that takes an array of numbers, sums them up, and multiplies the answer by 10. I don't know why you need to do that, but I don't judge.

```javascript
function tenTimesSum(`numbers`) {
  return multiply(10, sum(`numbers`));
}
```

As a ramda developer, I see a code smell. I'm taking an argument, numbers, and passing it as the last argument to a function, and then wrapping that whole thing as the last argument to another function. And once you start looking for this pattern, you'll start seeing it everywhere. It means that we can refactor this code into a function composition.  Here's what that looks like:

```javascript
const tenTimesSum = compose(multiply(10), sum);
```

Using ramda's compose function, we can chain the functions together, without ever having to actually get a hold of the parameter or use the function keyword.  Starting from the end, `sum` gets passed the `numbers` array, then passes its return value to `multiply(10)`, and so on if there were more. In the Haskell language (another thing named after Haskell Curry), which Ramda takes a lot of inspiration from, this sort of composition is called "point-free style", because the parameters, or "points", are never formally declared.

Another option is to use pipe instead of compose. It works exactly the same, but fips the order - sum comes first instead of last. Compose is great for refactoring, because you can see how easy it is to go from the first version to the second version - just move some parentheses around. Pipe, we've found, is easier to read later - reading functions left-to-right is a lot more natural for english speakers. Which you use is really just a matter of preference.

```javascript
const tenTimesSum = pipe(sum, multiply(10));
```

So why is this actually useful? Well other that being arguably more beautiful, it keeps the focus on the functions, instead of the values being passed through. It can also be a lot easier to maintian. For instance, there's a potential bug in this code - if one of the values in the numbers array was undefined, sum would fail, and return NaN. How can we fix it?

```javascript
const tenTimesSum = pipe(
  reject(isNil),
  sum,
  multiply(10)
);
```
