const { AsyncLocalStorage } = require('async_hooks');
const { handleError, isUndefined } = require('../../lib');
const { ExecutionContextErrors } = require('../../ExecutionContext/constants');
const { DEPRECATION_MESSAGES } = require('./constants');

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
            return handleError(ExecutionContextErrors.CONTEXT_DOES_NOT_EXIST);
        }

        const { context } = this.asyncLocaleStorage.getStore();

        return context;
    }

    set(context) {
        if (!validateStore(this.asyncLocaleStorage)) {
            return handleError(ExecutionContextErrors.CONTEXT_DOES_NOT_EXIST);
        }

        this.asyncLocaleStorage.getStore().context = context;
    }

    configure() {
        console.warn(DEPRECATION_MESSAGES.CONFIGURE); // eslint-disable-line no-console
    }

    monitor() {
        console.warn(DEPRECATION_MESSAGES.MONITOR); // eslint-disable-line no-console
    }
}

module.exports = AsyncLocalStorageContext;