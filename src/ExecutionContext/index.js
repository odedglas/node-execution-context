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

    /**
     * Creates a given context for the current asynchronous execution.
     * Note that this method will override the current execution context if called twice within the same `AsyncResource`.
     * Calling this method in a separate `AsyncResource` will create a new execution context for that resource.
     * @param {*} context - The context to expose.
     * @return void
     */
    create(context) {
        this.manager.create(context);
    }

    /**
     * Sets the current asynchronous execution context to given value.
     * @param {*} context - The new context to expose current asynchronous execution.
     * @returns void
     */
    set(context) {
        this.manager.set(context);
    }

    /**
     * Updates the current asynchronous execution context with a given value.
     * @param {*} context - The new context to expose current asynchronous execution.
     * @returns void
     */
    update(context) {
        this.manager.update(context);
    }

    /**
     * Gets the current asynchronous execution context.
     * @return {*}
     */
    get() {
        return this.manager.get();
    }

    /**
     * Runs given callback and exposed under a given context.
     * This will expose the given context within all callbacks and promise chains that will be called from given fn.
     * @param {Function} fn - The function to run.
     * @param {*} context - The context to expose.
     */
    run(fn, context) {
        return this.manager.run(fn, context);
    }

    /**
     * Configures current execution context manager.
     * [Note] Relevant for node v12.17.0 and below
     * @param {ExecutionContextConfig} config - the configuration to use.
     */
    configure(config) {
        this.manager.configure(config);
    }

    /**
     * Monitors current execution map usage
     * [Note] Relevant for node v12.17.0 and below
     * @return {ExecutionMapUsage|undefined}
     */
    monitor() {
        return this.manager.monitor();
    }
}

module.exports = ExecutionContext;
