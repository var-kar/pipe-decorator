# Pipeline Decorator 🚰

**NOTE: THIS IS NOT STREAMING PIPES**

## Introduction

It's more than two years in making of pipe operator and no one knows if it's going to make it into final JS spec. For more information about Pipeline operator, please refer the below documentation.

[link to Pipeline Operator docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Pipeline_operator)

Pipeline operators are more common in functional programming languages, like Elixer, Haskell etc. Whether they are good for your codebase or how readable they are, those decisions I will leave it to you. But, if you like it and want to incorporate into your JS codebase, boy this is the library you are looking for. For more information on why I wrote this decorator, please read my blog.

[I made Pipeline Decorator for one who wants to use Pipeline Operator in JavaScript 🚰](https://codesips.io/pipeline-decorator-for-one-who-wants-to-use-pipeline-operator/)

To make things better and useful, this library works with a combination of Promise and functions.

## Use cases

1. Makes your code clean and easy to read.
2. Better and chaining
3. Makes multiple Promise handling cleaner and readable with pre and post data preparation. 

## Install

```
$ npm i pipe-decorator
```

## Usage

```
const pipe = require('pipe-decorator');

pipe(<primitive-type>)([Function])(<primitive-type>)([Promise])();
```

Notice how we close with empty invocation to return the value. 

## Examples

```
const _ = require('lodash');
const axios = require('axios');
const pipe = require('./index');

async function fetchBlogCommentsByPostIds(postIds) {
	return await axios
		.get('https://jsonplaceholder.typicode.com/comments', {
			params: {
				postId: postIds
			}
		})
		.then((response) => {
			return response.data;
		});
}

let preFilter = [ 0, 1, false, 2, '', 3 ];
let differenceArray = [ 2, 4, 5, 6 ];
let emailToFind = { email: 'Lew@alysha.tv' };

// Empty Pipe
let test1 = pipe();

// Pipe with just one param
let test2 = pipe(preFilter)();

// Pipe with param and a filter
let test3 = pipe(preFilter)(_.compact)();

// Pipe with param and a filter then along with second parameter passed to another filter
let test4 = pipe(preFilter)(_.compact)(differenceArray)(_.difference)(); //Output: [1, 3]

// Pipe with pre processing of data before an API call. It returns a promise
let test5 = pipe(preFilter)(_.compact)(fetchBlogCommentsForPostIds)();

// Pipe with post processing of data after the Promise returns. It also returns a promise
let test6 = pipe(differenceArray)(fetchBlogCommentsForPostIds)(emailToFind)(_.filter)();

// Pipe with pre and post processing of data with 2 parameters for filter at some point. This also returns a promise.
let test7 = pipe(preFilter)(_.compact)(differenceArray)(_.difference)(fetchBlogCommentsByPostIds)(emailToFind)(_.filter)();
```

## Asserts

```
console.assert(test1 === undefined);
console.assert(_.isEqual(test2, preFilter));
console.assert(_.isEqual(test3, [ 1, 2, 3 ]));
console.assert(_.isEqual(test4, [ 1, 3 ]));

test5.then((value) => {
	console.assert(value.length > 1);
});

test6.then((value) => {
	console.assert(_.isEqual(value, []));
});

test7.then((value) => {
	console.assert(value.length > 0);
});
```

## TODO

1. Pass function as argument to be invoked as part of another function's argument.
2. Make browser compatible. It only works on Nodejs.
3. Test with 3 or 4 arguments. It works, but needs more testing.
4. More testing in general.