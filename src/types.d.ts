import { ExecutionMapUsage, ExecutionMapUsageEntry } from './lib/types';
import { HookCallbacks } from './managers/asyncHooks/hooks/types';
import { ExecutionContextConfig, ExecutionContextNode, ExecutionContextMap } from './ExecutionContext/types';

interface ExecutionContextAPI {

    /**
     * Creates a given context for the current asynchronous execution.
     * Note that if this method will be called not within a AsyncResource context, it will effect current execution context.
     * @param context - The context to expose.
     */
    create(context: unknown): void;

    /**
     * Sets the current asynchronous execution context to given value.
     * @param context - The new context to expose current asynchronous execution.
     */
    set(context: unknown): void;

    /**
     * Updates the current asynchronous execution context with a given value.
     * @param context - The value to update.
     */
    update(context: Record<string, unknown>): void;

    /**
     * Gets the current asynchronous execution context.
     */
    get<T>(): T;

    /**
     * Runs given callback that will be exposed to the given context.
     * This will expose the given context within all callbacks and promise chains that will be called from given fn.
     * @param fn - The function to run.
     * @param context - The context to expose.
     */
    run<T>(fn: () => T, context: unknown): T;

    /**
     * Configures current execution context manager.
     * [Note] Relevant for node v12.17.0 and below
     * @param config - the configuration to use.
     */
    config(config: ExecutionContextConfig): void;

    /**
     * Monitors current execution map usage
     * [Note] Relevant for node v12.17.0 and below
     * @return {ExecutionMapUsage|undefined}
     */
    monitor(): ExecutionMapUsage | undefined;
}

declare const context: ExecutionContextAPI;

export {
    HookCallbacks,
    ExecutionMapUsageEntry,
    ExecutionMapUsage,
    ExecutionContextMap,
    ExecutionContextNode,
    ExecutionContextConfig,
    ExecutionContextAPI
};

export default context;