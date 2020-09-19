const Context = require('../src');

const delay = (callback, timeout = 1000) => setTimeout(() => {
	callback();
}, timeout);

class UserController {
	get(req, res) {

		delay(() => {
			console.log('Callback : ', Context.get()); // { val: true }
		});

		// Creates a dedicate domain context ( exclude this following chain from root context )
		// Updates mae from domain will not effect root context.
		delay(() => {
			Context.create({ specific: true }, 'custom-domain');

			delay(() => {
				console.log('Domain callback ', Context.get()) // { val: true, specific: true }
				Context.update({ inner: true });

			}, 400);
		}, 4000)

		res.send(Context.get());
	}
}

module.exports = new UserController();
