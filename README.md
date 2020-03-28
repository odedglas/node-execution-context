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

This will expose any point of your code form this point that handles that request. 

```js
// ./controller/user/index.js

const Context = require('node-execution-context');
const mongo = require('../service/mongo');
const logger = require('../service/logger');

export class UserController {
    async create (req, res, next) {
        const { user } = req.body;
        
        // This will return the reference number set by out ContextMiddleware
        const { reference } = Context.get();
        
        logger.info('Created user for reference: ', reference);
        
        return await mongo.create('user', user);
    }
}
```

## API

### create(initialContext?: object)

Creates for the current async resource an execution context entry identified with his asyncId.
Any future processes that will be added to the async execution chain will be exposed to this context.

### update(update: object)
Updates the current execution context with a given update obect.

### get()

Returns the current execution context identified with the current asyncId.

### API Usage


```js
const Context = require('node-execution-context');

Context.create({
    value: true
});

Promise.resolve().then(() => {
    console.log(Context.get()); // outputs: {"value": true}
    
    Context.update({
        value: false
    });
    
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(Context.get()); // outputs: {"value": false}
            
            Context.update({
                butter: 'fly'
            });
            
            process.nextTick(() => {
                console.log(Context.get()); // outputs: {"value": false, "butter": 'fly'}
                resolve();
            });
            
        }, 1000);
        
        console.log(Context.get()); // outputs: {"value": true}
    });
});
```

The following errors can be thrown while accessing to the context API :

| Code | when |
|-|-
| CONTEXT_ALREADY_DECLARED | When trying to `create` execution context, but current async resource already exists.
| CONTEXT_DOES_NOT_EXISTS | When try to `get` / `update` the context, but it yet been created.

