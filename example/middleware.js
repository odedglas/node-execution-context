const Context = require('../src');

module.exports = (req, res, next) => {
	Context.run(next, { value: true });
};
