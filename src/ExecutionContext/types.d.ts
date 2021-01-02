export interface ExecutionContextAPI {

    /**
     * Creates a given context for the current asynchronous execution.
     * Note that if this method will be called not within a AsyncResource context, it will effect current execution context.
     * @param context
     */
    create(context: unknown): void;

    /**
     * Sets the current asynchronous execution context to given value.
     * @param context - The new context to expose current asynchronous execution.
     */
    set(context: unknown): void;

    /**
     * Gets the current asynchronous execution context.
     */
    get<T>(): T;

    /**
     * Runs given callback and exposed under a given context.
     * This will expose the given context within all callbacks and promise chains that will be called from given fn.
     * @param fn
     * @param context
     */
    run(fn: Function, context: unknown): void;
}
