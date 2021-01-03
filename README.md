# node-execution-context
A straightforward library that provides a persistent process-level context wrapper using node "async_hooks" feature.
This library will try to use by default `AsyncLocalStorage` implementation based and will fallback to raw `async_hooks` implementation for lower versions. 

## Installation

```
npm i node-execution-context
```

## Getting started

Let't start with creating the context initialisation point of our app, well take an simples express app for this example

```js
// main.js

const express = require('express');
const Context = require('node-execution-context');
const UserController = require('./controllers/user');
const app = express();
const port = 3000;

const ContextMiddleware = (req, res, next) => {
    Context.run(next, { val: true });
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
    async create (req) {
        const { user } = req.body;
        
        // This will return the reference number set by out ContextMiddleware
        const { reference } = Context.get();
        
        logger.info('Created user for reference: ', reference);
        
        return await mongo.create('user', user);
    }
}
```

## API

### create(context?: unknown)

Creates for the current async resource an execution context entry identified with his asyncId.
Any future processes that will be added to the async execution chain will be exposed to this context.

> When passing custom domain to this method, the trigger point and all of it's sub processes will be exposed to a standalone context and won't effect / be effected by root context. 

### set(context: unknown)

Sets the current execution context with a given update obect.

### get()

Returns the current execution context identified with the current asyncId.

### run(fn: Function, context: unknown)

Runs a given function under a dedicated AsyncResource, exposing given initial context to the process and it's child processes.

### configure(config: ExecutionContextConfig) : void

Configures execution context settings.

> Relevant only for node versions lower than `v12.17.0`.

### monitor(): ExecutionMapUsage

Returns an monitoring report over the current execution map resources

> Relevant only for node versions lower than `v12.17.0`.

> Before calling `monitor`, you should `configure` execution context to monitor it's nodes. by default the data kept is as possible.

```js
const Context = require('node-execution-context');

// Startup
Context.configure({ monitor: true });


// Later on
const usage = Context.monitor();
console.log(usage); // Prints execution context usage report.
```

### Raw API Usage

```js
const Context = require('node-execution-context');

Context.create({
    value: true
});

Promise.resolve().then(() => {
    console.log(Context.get()); // outputs: {"value": true}
    
    Context.set({
        value: false
    });
    
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(Context.get()); // outputs: {"value": false}
            
            Context.set({
                butter: 'fly'
            });
            
            process.nextTick(() => {
                console.log(Context.get()); // outputs: {"butter": 'fly'}
                resolve();
            });
            
        }, 1000);
        
        console.log(Context.get()); // outputs: {"value": false}
    });
});
```

The following errors can be thrown while accessing to the context API :

| Code | When |
|-|-
| CONTEXT_DOES_NOT_EXISTS | When try to `get` / `update` the context, but it yet been created.
| MONITOR_MISS_CONFIGURATION | When try to `monitor` without calling `configure` with monitoring option.

