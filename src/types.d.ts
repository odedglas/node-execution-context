interface ExecutionContext {
    ref? :number;
    children?: number[];
    context?: object;
    created: number;
}

type ExecutionContextMap = Map<number, ExecutionContext>;

interface HookCallbacks {

    /**
     * Called when a class is constructed that has the possibility to emit an asynchronous event.
     * @param asyncId a unique ID for the async resource
     * @param type the type of the async resource
     * @param triggerAsyncId the unique ID of the async resource in whose execution context this async resource was created
     * @param resource reference to the resource representing the async operation, needs to be released during destroy
     */
    init?(asyncId: number, type: string, triggerAsyncId: number, resource: object): void;

    /**
     * Called when a promise has resolve() called. This may not be in the same execution id
     * as the promise itself.
     * @param asyncId the unique id for the promise that was resolve()d.
     */
    promiseResolve?(asyncId: number): void;

    /**
     * Called after the resource corresponding to asyncId is destroyed
     * @param asyncId a unique ID for the async resource
     */
    destroy?(asyncId: number): void;
}

interface ExecutionMapUsageBaseEntry {
    asyncId: number;
    created: number;
    duration: number;
}

interface ExecutionMapUsageChildEntry extends ExecutionMapUsageBaseEntry {
    type: string;
}

interface ExecutionMapUsageEntry extends ExecutionMapUsageBaseEntry {
    asyncId: number;
    children: ExecutionMapUsageChildEntry[];
}

interface ExecutionMapUsage {
    size: number;
    entries: ExecutionMapUsageEntry[];
}

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

export {
    ExecutionContextMap,
    ExecutionContextAPI,
    ExecutionMapUsage,
    ExecutionMapUsageEntry
}