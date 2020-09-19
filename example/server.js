const express = require('express');
const UserController = require('./controller');
const ContextMiddleware = require('./middleware');

const app = express();

app.get('/', function(req,res){
	res.sendFile(__dirname + '/static/index.html');
});

const port = process.env.PORT || 8080;

app.use('/', ContextMiddleware);

app.get('/user', UserController.get);

app.listen(port, () => {
	console.log('Server is running');
});