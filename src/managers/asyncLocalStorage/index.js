const { AsyncLocalStorage } = require('async_hooks');
const { handleError, isUndefined } = require('../../lib');
const { ExecutionContextErrors } = require('../../ExecutionContext/constants');

/**
 * Check whether a given async local storage has a valid store.
 * @param {AsyncLocalStorage} asyncLocalStorage - The async local storage to validate it's store presence
 * @return {Boolean}
 */
const validateStore = (asyncLocalStorage) => !isUndefined(
    asyncLocalStorage.getStore()
);

/**
 * @type {ExecutionContextAPI}
 */
class AsyncLocalStorageContext {
    constructor() {
        this.asyncLocaleStorage = new AsyncLocalStorage();
    }

    /**
     * Creates a given context for the current asynchronous execution.
     * Note that if this method will be called not within a AsyncResource context, it will effect current execution context.
     * @param {*} context - The context to expose.
     * @return void
     */
    create(context){
        this.asyncLocaleStorage.enterWith({ context });
    }

    /**
     * Runs given callback and exposed under a given context.
     * This will expose the given context within all callbacks and promise chains that will be called from given fn.
     * @param {Function} fn - The function to run.
     * @param {*} context - The context to expose.
     */
    run(fn, context) {
        return this.asyncLocaleStorage.run(
            { context },
            fn
        );
    }

    /**
     * Gets the current asynchronous execution context.
     * @return {*}
     */
    get() {
        if (!validateStore(this.asyncLocaleStorage)) {
            return handleError(ExecutionContextErrors.CONTEXT_DOES_NOT_EXISTS);
        }

        const { context } = this.asyncLocaleStorage.getStore();

        return context;
    }

    /**
     * Sets the current asynchronous execution context to given value.
     * @param {*} context - The new context to expose current asynchronous execution.
     * @returns void
     */
    set(context) {
        if (!validateStore(this.asyncLocaleStorage)) {
            return handleError(ExecutionContextErrors.CONTEXT_DOES_NOT_EXISTS);
        }

        this.asyncLocaleStorage.getStore().context = context;
    }

    configure() {
        console.warn('Configure is relevant only for AsyncHooks context manager, and should not be used on this current node version.'); // eslint-disable-line no-console
    }

    monitor() {
        console.warn('Monitoring is based over node `AsyncLocalStorage` feature and should not be monitor'); // eslint-disable-line no-console
    }
}

module.exports = AsyncLocalStorageContext;