const asyncHooks = require('async_hooks');
const { monitorMap, handleError, isObject, ExecutionContextResource } = require('../../lib');
const { create: createHooks, onChildProcessDestroy } = require('./hooks');
const { ExecutionContextErrors } = require('../../ExecutionContext/constants');
const { DEFAULT_CONFIG } = require('./constants');

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

    create(context) {
        const config = this.config;
        const asyncId = asyncHooks.executionAsyncId();

        const rootContext = this._getRootContext(asyncId);
        if (rootContext) {

            // Disconnecting current async id from stored parent chain
            onChildProcessDestroy(executionContextMap, asyncId, rootContext.asyncId);
        }

        // Creating root context node
        const root = createRootContext({
            asyncId,
            context,
            monitor: config.monitor
        });

        executionContextMap.set(asyncId, root);
    }

    run(fn, context) {
        const resource = new ExecutionContextResource();

        resource.runInAsyncScope(() => {
            this.create(context);

            fn();
        });
    }

    get() {
        const asyncId = asyncHooks.executionAsyncId();

        if (!executionContextMap.has(asyncId)) return handleError(ExecutionContextErrors.CONTEXT_DOES_NOT_EXIST);

        return this._getRootContext(asyncId).context;
    }

    set(context) {
        const asyncId = asyncHooks.executionAsyncId();

        if (!executionContextMap.has(asyncId)) return handleError(ExecutionContextErrors.CONTEXT_DOES_NOT_EXIST);

        // Update target is always the root context, ref updates will need to be channeled
        const rootContext = this._getRootContext(asyncId);

        rootContext.context = context;
    }

    update(context) {
        const asyncId = asyncHooks.executionAsyncId();

        if (!executionContextMap.has(asyncId)) return handleError(ExecutionContextErrors.CONTEXT_DOES_NOT_EXIST);
        if (!isObject(context)) return handleError(ExecutionContextErrors.UPDATE_BLOCKED);

        // Update target is always the root context, ref updates will need to be channeled
        const rootContext = this._getRootContext(asyncId);

        Object.assign(rootContext.context, context);
    }

    configure(config) {
        this.config = config;
    }

    monitor() {
        if (!this.config.monitor) {
            throw new Error(ExecutionContextErrors.MONITOR_MISS_CONFIGURATION);
        }

        return monitorMap(executionContextMap);
    }
}

module.exports = AsyncHooksContext;
