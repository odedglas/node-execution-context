const asyncHooks = require('async_hooks');
const { monitorMap, ExecutionContextResource } = require('../lib');
const { create: createHooks } = require('../hooks');
const {
    DEFAULT_CONFIG,
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
 * @param {*} context - The initial context ro provide this execution chain.
 * @param {Boolean} monitor - Whether to monitor current root node or not.
 * @return {ExecutionContextNode}
 */
const createRootContext = ({ asyncId, context, monitor }) => ({
    asyncId,
    context,
    children: [],
    monitor,
    ...(monitor && { created: Date.now() })
});

/**
 * @type {ExecutionContextAPI}
 */
class AsyncHooksContext {
    constructor() {
        this.config = { ...DEFAULT_CONFIG };

        // Sets node async hooks setup
        asyncHooks.createHook(
            createHooks(executionContextMap)
        ).enable();
    }

    /**
     * Configures current execution context manager.
     * @param {ExecutionContextConfig} config - the configuration to use.
     */
    configure(config) {
        this.config = config;
    }

    /**
     * Returns current execution id root context for the current asyncId process.
     * @param {Number} asyncId - The current execution context id.
     * @return {ExecutionContextNode}
     * @private
     */
    _getRootContext(asyncId) {
        const context = executionContextMap.get(asyncId);

        if (context && context.ref) return executionContextMap.get(context.ref);

        return context;
    }

    /**
     * Creates an execution context for the current asyncId process.
     * This will expose Context get / update at any point after.
     * @param {*} context - The initial context to be used.
     * @returns void
     */
    create(context) {
        const config = this.config;
        const asyncId = asyncHooks.executionAsyncId();

        // Creating root context node
        const root = createRootContext({
            asyncId,
            context,
            monitor: config.monitor
        });

        executionContextMap.set(asyncId, root);
    }

    /**
     * Updates the current async process context.
     * @param {*} context - The new context to set.
     * @returns void
     */
    set(context) {
        const asyncId = asyncHooks.executionAsyncId();

        if (!executionContextMap.has(asyncId)) return;

        // Update target is always the root context, ref updates will need to be channeled
        const rootContext = this._getRootContext(asyncId);

        rootContext.context = context;
    }

    /**
     * Gets the current async process execution context.
     * @returns {*}
     */
    get() {
        const asyncId = asyncHooks.executionAsyncId();

        if (!executionContextMap.has(asyncId)) return;

        return this._getRootContext(asyncId).context;
    }

    /**
     * Runs a given function within "AsyncResource" context, this will ensure the function executed within a uniq execution context.
     * @param {Function} fn - The function to run.
     * @param {*} context - The initial context to expose to the function execution.
     */
    run(fn, context) {
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
