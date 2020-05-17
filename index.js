const processPipe = (arg, accumulator) => {
	if (typeof arg === 'function') {
		if (accumulator.length > 1 && Array.isArray(accumulator[0])) {
			return arg.apply(arg, accumulator);
		} else {
			return arg.call(arg, accumulator);
		}
	} else {
		return [ accumulator, arg ];
	}
};
const wrapPromise = (arg, accumulator) => {
	return accumulator
		.then((value) => {
			return Promise.resolve(processPipe(arg, value));
		})
		.catch((error) => {
			return Promise.reject(error);
		});
};
const pipe = (...args) => {
	return (params) => {
		if (!params) {
			if (args && args.length > 0) {
				return args.reduce((accumulator, arg) => {
					if (accumulator instanceof Promise) {
						return wrapPromise(arg, accumulator);
					} else {
						return processPipe(arg, accumulator);
					}
				});
			}
		} else {
			return pipe(...args, params);
		}
	};
};

module.exports = pipe();
