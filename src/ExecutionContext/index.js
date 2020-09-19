const asyncHooks = require('async_hooks');
const { isProduction, monitorMap, ExecutionContextResource } = require('../lib');
const { create: createHooks, onChildProcessDestroy } = require('../hooks');
const {
    DEFAULT_CONFIG,
    ROOT_DOMAIN,
    ExecutionContextErrors
} = require('./constants');

/**
 * The execution context maps which acts as the execution context in memory storage.
 * @see ExecutionContext.monitor
 * @type ExecutionContextMap
 */
const executionContextMap = new Map();

/**
 * Creates a root execution context node.
 * @param {Number} asyncId - The current async id.
 * @param {Object} initialContext - The initial context ro provide this execution chain.
 * @param {Object} config - The configuration the root context created with.
 * @param {Object} domain - The domain to create the execution context under.
 * @return {ExecutionContextNode}
 */
const createRootContext = ({ asyncId, initialContext, config, domain = ROOT_DOMAIN }) => ({
    asyncId,
    domain,
    context: { ...initialContext, executionId: asyncId },
    children: [],
    ...config,
    ...(config.monitor && { created: Date.now() })
});

/**
 * Handles execution context error, throws when none production.
 * @param {String} code - The error code to log.
 */
const handleError = (code) => {
    if (!isProduction()) {
        throw code;
    }

    console.error(code); // eslint-disable-line no-console
};

class ExecutionContext {
    constructor() {
        this.config = { ...DEFAULT_CONFIG };

        // Sets node async hooks setup
        asyncHooks.createHook(
            createHooks(executionContextMap)
        ).enable();
    }

    /**
     * Configures current execution context.
     * @param {ExecutionContextConfig} config - the configuration to use.
     */
    configure(config) {
        this.config = config;
    }

    /**
     * Creates an execution context for the current asyncId process.
     * This will expose Context get / update at any point after.
     * @param {Object} initialContext - The initial context to be used.
     * @param {String} domain - The domain the context is created under.
     * @returns void
     */
    create(initialContext = {}, domain = ROOT_DOMAIN) {
        const config = this.config;
        const asyncId = asyncHooks.executionAsyncId();

        const refContext = executionContextMap.get(asyncId);
        if (refContext) {

            // Execution context creation is allowed once per domain
            if (domain === refContext.domain) return handleError(ExecutionContextErrors.CONTEXT_ALREADY_DECLARED);

            // Setting up domain initial context
            initialContext = { ...this.get(), ...initialContext };

            // Disconnecting current async id from stored parent chain
            onChildProcessDestroy(executionContextMap, asyncId, refContext.ref);
        }

        // Creating root context node
        const rootContext = createRootContext({
            asyncId,
            initialContext,
            config,
            domain
        });

        executionContextMap.set(asyncId, rootContext);
    }

    /**
     * Updates the current async process context.
     * @param {Object} update - The update to apply on the current process context.
     * @returns void
     */
    update(update = {}) {
        const asyncId = asyncHooks.executionAsyncId();

        if (!executionContextMap.has(asyncId)) return handleError(ExecutionContextErrors.CONTEXT_DOES_NOT_EXISTS);

        const contextData = executionContextMap.get(asyncId);

        // Update target is always the root context, ref updates will need to be channeled
        const targetContextData = contextData.ref
            ? executionContextMap.get(contextData.ref)
            : contextData;

        targetContextData.context = { ...targetContextData.context, ...update };
    }

    /**
     * Gets the current async process execution context.
     * @returns {Object}
     */
    get() {
        const asyncId = asyncHooks.executionAsyncId();
        if (!executionContextMap.has(asyncId)) return handleError(ExecutionContextErrors.CONTEXT_DOES_NOT_EXISTS);

        const { context = {}, ref } = executionContextMap.get(asyncId);
        if (ref) {

            // Ref will be used to point out on the root context
            return executionContextMap.get(ref).context;
        }

        // Root context
        return context;
    }

    /**
     * Runs a given function within "AsyncResource" context, this will ensure the function executed within a uniq execution context.
     * @param {Function} fn - The function to run.
     * @param {Object} initialContext - The initial context to expose to the function execution.
     * @param {String} domain - The domain to create the exectuion context under.
     */
    run(fn, initialContext, domain) {
        const resource = new ExecutionContextResource();

        resource.runInAsyncScope(() => {
            this.create(initialContext, domain);

            fn();
        });
    }

    /**
     * Monitors current execution map usage
     * @return {ExecutionMapUsage}
     */
    monitor() {
        if (!this.config.monitor) {
            throw new Error(ExecutionContextErrors.MONITOR_MISS_CONFIGURATION);
        }

        return monitorMap(executionContextMap);
    }
}

module.exports = ExecutionContext;
