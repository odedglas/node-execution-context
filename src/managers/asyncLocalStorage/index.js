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
 * @class {ExecutionContextAPI}
 */
class AsyncLocalStorageContext {
    constructor() {
        this.asyncLocaleStorage = new AsyncLocalStorage();
    }

    create(context){
        this.asyncLocaleStorage.enterWith({ context });
    }

    run(fn, context) {
        return this.asyncLocaleStorage.run(
            { context },
            fn
        );
    }

    get() {
        if (!validateStore(this.asyncLocaleStorage)) {
            return handleError(ExecutionContextErrors.CONTEXT_DOES_NOT_EXISTS);
        }

        const { context } = this.asyncLocaleStorage.getStore();

        return context;
    }

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