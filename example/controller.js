const Context = require('../src');

const delay = (callback, timeout = 1000) => setTimeout(() => {
	callback();
}, timeout);


class UserController {
	get(req, res) {

		delay(() => {
			console.log('Callback : ', Context.get()); // { val: true }
		}, 300);

		// Creates a dedicated context bounded to Timeout AsyncResource
		// Any changes that will apply on that context will not effect outter scope.
		delay(() => {
			Context.create({ specific: true });

			delay(() => {
				console.log('Domain callback ', Context.get()) // { specific: true }
			}, 400);
		}, 4000)

		res.send(Context.get()); // Returns { val: true }
	}
}

module.exports = new UserController();
