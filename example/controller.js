const Context = require('../src');

const delay = (callback, timeout = 1000) => setTimeout(() => {
	callback();
}, timeout);

const promise = (name) => new Promise(resolve => {
	Context.run(() => {
		setTimeout(() => {
			console.log('Promise domain :', Context.get());
			resolve();
		}, 1000)
	}, { name }, `domain-${name}`);
})

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
				Context.set({ inner: true });

			}, 400);
		}, 4000)

		promise('oded');
		promise('lotem');

		console.log('Final : ', Context.get())
		res.send(Context.get());
	}
}

module.exports = new UserController();
