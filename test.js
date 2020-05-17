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
let test5 = pipe(preFilter)(_.compact)(fetchBlogCommentsByPostIds)();
// Pipe with post processing of data after the Promise returns. It also returns a promise
let test6 = pipe(differenceArray)(fetchBlogCommentsByPostIds)(emailToFind)(_.filter)();
// Pipe with pre and post processing of data with 2 parameters for filter at some point. This also returns a promise.
let test7 = pipe(preFilter)(_.compact)(differenceArray)(_.difference)(fetchBlogCommentsByPostIds)(emailToFind)(
	_.filter
)();

// Test Asserts
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
	console.log(value);
});
