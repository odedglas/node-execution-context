const Context = require('../src');

class UserController {
	get(req, res) {
		res.send(Context.get());
	}
}

module.exports = new UserController();
