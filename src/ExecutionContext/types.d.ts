import { ExecutionMapUsage } from '../lib/types';

interface ExecutionContextNode {
    asyncId: number;
    monitor: boolean;
    domain: string,
    ref? :number;
    children?: number[];
    context?: object;
    created?: number;
}

type ExecutionContextMap = Map<number, ExecutionContextNode>;

interface ExecutionContextAPI {

    /**
     * Creates an execution context for the current asyncId process.
     * @param initialContext
     */
    create(initialContext: object): void;

    /**
     * Updates the current async process context.
     * @param update
     */
    update(update: object): void;

    /**
     * Gets the current async process execution context.
     */
    get(): object;

    /**
     * Runs a given function within an async resource context
     * @param fn
     * @param initialContext
     */
    run(fn: Function, initialContext: object): void;

    /**
     * Monitors the current execution map usage
     */
    monitor(): ExecutionMapUsage;
}

interface ExecutionContextConfig {
    monitor: boolean;
}

export {
    ExecutionContextNode,
    ExecutionContextMap,
    ExecutionContextAPI,
    ExecutionContextConfig
}
