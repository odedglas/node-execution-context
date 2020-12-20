const asyncHooks = require('async_hooks');
const { create: createHooks } = require('.');

describe('Context / Hooks', () => {
    const triggerAsyncId = asyncHooks.executionAsyncId();
    let executionMap;
    let spies;
    let init;
    let destroy;

    const spawn = (trigger) => new Promise((resolve) => setTimeout(() => {
        const childAsyncId = asyncHooks.executionAsyncId();

        init(childAsyncId, 'type', trigger);
        resolve(childAsyncId);
    }));

    beforeEach(() => {
        executionMap = new Map();

        const callbacks = createHooks(executionMap);

        spies = {
            initHook: jest.spyOn(callbacks, 'init'),
            destroyHook: jest.spyOn(callbacks, 'destroy'),
            contextMapSet: jest.spyOn(executionMap, 'set'),
            contextMapDelete: jest.spyOn(executionMap, 'delete'),
        };

        init = callbacks.init;
        destroy = callbacks.destroy;
    });

    describe('Init', () => {
        describe('When context is not present', () => {
            beforeEach(() => init());

            it('Prevent map entries', (done) => {
                expect(executionMap.size).toEqual(0);

                setTimeout(() => {
                    expect(spies.contextMapSet).toHaveBeenCalledTimes(0);
                    done();
                }, 100);
            });
        });

        describe('When context is present', () => {
            let childAsyncId;

            beforeEach(async() => {
                executionMap.set(triggerAsyncId, {
                    context: { val: 'value' },
                    children: []
                });

                childAsyncId = await spawn(triggerAsyncId);
            });

            it('Register sub process as ref entry under root process', () => {
                expect(executionMap.size).toEqual(2);

                expect(executionMap.get(childAsyncId)).toMatchObject({
                    ref: triggerAsyncId
                });
            });

            it('Adds sub process to trigger context as children', () => {
                const { children: triggerChildren } = executionMap.get(triggerAsyncId);

                expect(triggerChildren.length).toEqual(1);
                expect(triggerChildren).toContain(childAsyncId);
            });

            it('Register nested sub process as ref entry under root process', async() => {
                const nestedChildAsyncId = await spawn(childAsyncId);

                expect(executionMap.size).toEqual(3);
                expect(executionMap.get(nestedChildAsyncId)).toMatchObject({
                    ref: triggerAsyncId
                });

                const { children: triggerChildren } = executionMap.get(triggerAsyncId);
                expect(triggerChildren.length).toEqual(2);
                expect(triggerChildren).toContain(nestedChildAsyncId);
            });
        });
    });

    describe('Destroy', () => {
        it('Ignores triggers for non existing entries', () => {
            destroy('something');
            expect(spies.contextMapDelete).toHaveBeenCalledTimes(0);
        });

        describe('Parent process entry', () => {
            it('Prevents removal when still has running child processes', () => {
                executionMap.set(triggerAsyncId, {
                    context: {},
                    children: [3]
                });

                destroy(triggerAsyncId);

                expect(executionMap.get(triggerAsyncId)).toBeDefined();
                expect(spies.contextMapDelete).toHaveBeenCalledTimes(0);
            });

            it('Removes parent when no children depends on it', (done) => {
                executionMap.set(triggerAsyncId, {
                    context: {},
                    children: []
                });

                destroy(triggerAsyncId);

                setImmediate(() => {
                    expect(executionMap.get(triggerAsyncId)).toBeUndefined();
                    expect(spies.contextMapDelete).toHaveBeenCalledWith(triggerAsyncId);

                    done();
                });
            });
        });

        describe('Child process entry', () => {
            let children;
            beforeEach(async() => {
                executionMap.set(triggerAsyncId, {
                    context: {},
                    children: []
                });

                children = [
                    await spawn(triggerAsyncId),
                    await spawn(triggerAsyncId)
                ];

            });

            it('Removes child', (done) => {
                const [ firstChild ] = children;
                destroy(firstChild);

                setImmediate(() => {
                    expect(spies.contextMapDelete).toHaveBeenCalledWith(firstChild);

                    done();
                });
            });

            it('Triggers parent cleanup when all child process died', (done) => {
                children.forEach(destroy);

                setTimeout(() => {
                    expect(executionMap.size).toEqual(0);

                    done();
                }, 200);
            });
        });
    });
});
