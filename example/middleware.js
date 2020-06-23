const {  AsyncResource  } = require('async_hooks');
const Context = require('../src');

module.exports = (req, res, next) => {
	const asyncResource = new AsyncResource('REQUEST_CONTEXT');
	return asyncResource.runInAsyncScope(() => {
		Context.create({
			val: true
		});
		next();
	});
};
