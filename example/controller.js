const Context = require('../src');

const delay = (callback) => setTimeout(() => {
	callback();
}, 2000);

class UserController {
	get(req, res) {

		delay(() => {
			console.log('Callback : ', Context.get());
		});

		res.send(Context.get());
	}
}

module.exports = new UserController();
