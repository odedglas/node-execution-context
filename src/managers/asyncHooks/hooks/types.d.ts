interface HookCallbacks {

    /**
     * Called when a class is constructed that has the possibility to emit an asynchronous event.
     * @param asyncId a unique ID for the async resource
     * @param type the type of the async resource
     * @param triggerAsyncId the unique ID of the async resource in whose execution context this async resource was created
     * @param resource reference to the resource representing the async operation, needs to be released during destroy
     */
    init(asyncId: number, type: string, triggerAsyncId: number, resource: object): void;

    /**
     * Called when a promise has resolve() called. This may not be in the same execution id
     * as the promise itself.
     * @param asyncId the unique id for the promise that was resolve()d.
     */
    promiseResolve(asyncId: number): void;

    /**
     * Called after the resource corresponding to asyncId is destroyed
     * @param asyncId a unique ID for the async resource
     */
    destroy(asyncId: number): void;
}

export {
    HookCallbacks
}
