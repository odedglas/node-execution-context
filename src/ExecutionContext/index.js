const { supportAsyncLocalStorage } = require('../lib');
const { AsyncHooksContext, AsyncLocalStorageContext } = require('../managers');

/**
 * @type {ExecutionContextAPI}
 */
class ExecutionContext {
    constructor() {
        const ContextManager = supportAsyncLocalStorage() ? AsyncLocalStorageContext : AsyncHooksContext;

        this.manager = new ContextManager();
    }

    create(context) {
        this.manager.create(context);
    }

    set(context) {
        this.manager.set(context);
    }

    get() {
        return this.manager.get();
    }

    run(fn, context) {
        return this.manager.run(fn, context);
    }

    configure(config) {
        this.manager.configure(config);
    }

    monitor() {
        return this.manager.monitor();
    }
}

module.exports = ExecutionContext;
