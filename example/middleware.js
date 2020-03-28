const Context = require('../src');

module.exports = (req, res, next) => {
	Context.create({
		val: true
	});
	next();
};
