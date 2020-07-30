const asyncHooks = require('async_hooks');
const { isProduction } = require('./lib');
const { create: createHooks } = require('./hooks');
const { ExecutionContextErrors } = require('./constants');

/**
 * Handles execution context error, throws when none production
 * @param code
 */
const handleError = (code) => {
    if (!isProduction()) {
        throw code;
    }

    console.warn(code);
};

/**
 * The Execution Context API
 * @return {ExecutionContextAPI}
 */
const createExecutionContext = () => {

    /**
     * The global service context execution map
     * @type ExecutionContextMap
     */
    const executionContextMap = new Map();

    // Sets node async hooks setup
    asyncHooks.createHook(
        createHooks(executionContextMap)
    ).enable();

    return {

        /**
         * Creates an execution context for the current asyncId process.
         * This will expose Context get / update at any point after.
         * @param {Object} initialContext - The initial context to be used
         * @returns void
         */
        create: (initialContext = {}) => {
            console.log('Creating execution context : ', executionContextMap);
            const asyncId = asyncHooks.executionAsyncId();

            // Creation is allowed once per execution context
            if (executionContextMap.has(asyncId)) handleError(ExecutionContextErrors.CONTEXT_ALREADY_DECLARED);

            executionContextMap.set(asyncId, {
                context: { ...initialContext, executionId: asyncId },
                children: []
            });
        },

        /**
         * Updates the current async process context.
         * @param {Object} update - The update to apply on the current process context.
         * @returns void
         */
        update: (update = {}) => {
            const asyncId = asyncHooks.executionAsyncId();

            if (!executionContextMap.has(asyncId)) handleError(ExecutionContextErrors.CONTEXT_DOES_NOT_EXISTS);

            const contextData = executionContextMap.get(asyncId);

            // Update target is always the root context, ref updates will need to be channeled
            const targetContextData = contextData.ref
                ? executionContextMap.get(contextData.ref)
                : contextData;

            targetContextData.context = { ...targetContextData.context, ...update };
        },

        /**
         * Gets the current async process execution context.
         * @returns {Object}
         */
        get: () => {
            const asyncId = asyncHooks.executionAsyncId();
            if (!executionContextMap.has(asyncId)) handleError(ExecutionContextErrors.CONTEXT_DOES_NOT_EXISTS);

            const { context = {}, ref } = executionContextMap.get(asyncId);
            if (ref) {

                // Ref will be used to point out on the root context
                return executionContextMap.get(ref).context;
            }

            // Root context
            return context;
        }
    };
}

global.ExecutionContext = global.ExecutionContext || createExecutionContext();

module.exports = global.ExecutionContext;
