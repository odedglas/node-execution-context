# node-execution-context
A straightforward library that provides a persistent process-level context wrapper using node "async_hooks" feature. 

## Installation

```
npm i node-execution-context
```

## Getting started

Let't start with creating the context initialisation point of our app, well take an simples express app for this example

```js
// main.js

const Context = require('node-execution-context');
const express = require('express');
const UserController = require('./controllers/user');
const app = express();
const port = 3000;

const ContextMiddleware = (req, res, next) => {
    Context.create({
        reference: req.body.reference    
    });

    next();
};

app.use('/', ContextMiddleware);
app.post('/user', UserController.create);

app.listen(port);

```

This will expose the request-level context to all future points that will handle this request making it exposable by accessing the context

```js
// ./controller/user/index.js

const Context = require('node-execution-context');
const mongo = require('../service/mongo');
const logger = require('../service/logger');

export class UserController {
    async create (req, res, next) {
        const { user } = req.body;
        const { reference } = Context.get();
        
        logger.info('Created user for reference: ', reference);
        
        return await mongo.create('user', user);
    }
}
```
