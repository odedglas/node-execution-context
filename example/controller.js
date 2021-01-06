const Context = require('../src');

const delay = (callback, timeout = 1000) => setTimeout(() => {
	callback();
}, timeout);

class UserController {
	get(req, res) {

		delay(() => {
			console.log('Callback1: ', Context.get()); // Callback: { val: true }
		});

		// Creates another context under Timeout AsyncResource un effected/effecting from current one.
		setTimeout(() => {
			Context.create({ value: 'domain' });
			console.log('Domain: ', Context.get()); // Promise: { val: 'domain' }

			delay(() => {
				console.log('Domain Callback: ', Context.get()) // Promise: { val: 'domain' }
			}, 3000);
		}, 300);

		delay(() => {
			console.log('Callback2: ', Context.get()); // Callback: { val: true }
		}, 500);

		res.send(Context.get()); // { val: true }
	}
}

module.exports = new UserController();
