const asyncHooks = require('async_hooks');
const hooks = require('../hooks');
const { ExecutionContextErrors } = require('./constants');

describe('Context', () => {
    let Context;
    beforeEach(() => {
        const ExecutionContext = jest.requireActual('.');
        Context = new ExecutionContext();
    });

    describe('Initialise node "async_hooks"', () => {
        const spies = {
            asyncHooksCreate: jest.spyOn(asyncHooks, 'createHook'),
            hooksCreate: jest.spyOn(hooks, 'create')
        };

        it('Trigger "async_hooks" create', () => {
            expect(spies.asyncHooksCreate).toHaveBeenCalled();
        });

        it('Uses context hooks create', () => {
            expect(spies.hooksCreate).toHaveBeenCalled();
        });
    });

    describe('Api', () => {
        describe('Create', () => {
            let lastExecutionId;

            it('Creates an execution context', () => {
                Context.create();

                expect(Context.get()).toBeInstanceOf(Object);
            });

            it('Sets executionId', () => {
                Context.create();

                const { executionId } = Context.get();

                lastExecutionId = executionId;
                expect(executionId).toBeDefined();
            });

            it('Create uniq execution id each time', () => {
                Context.create();

                const { executionId } = Context.get();
                expect(executionId === lastExecutionId).toBeFalsy();
            });

            it('Sets initial context data', (done) => {
                Context.create({ my: 'man' });

                setTimeout(() => {
                    const { my } = Context.get();

                    expect(my).toEqual('man');
                    done();
                }, 100);
            });

            it('Throws an error when trying to re-create context under same execution', () => {
                Context.create();

                expect(() => Context.create())
                    .toThrow(ExecutionContextErrors.CONTEXT_ALREADY_DECLARED);
            });
        });

        describe('Get', () => {
            it('Throws an error when context is not created', () => {
                expect(() => Context.get())
                    .toThrow(ExecutionContextErrors.CONTEXT_DOES_NOT_EXISTS);
            });

            describe('When context is created', () => {
                it('Returns context', () => {
                    Context.create({ val: 'value' });
                    const context = Context.get();

                    expect(context.val).toEqual('value');
                });
            });
        });

        describe('Update', () => {
            it('Throws an error when context is not created', () => {
                expect(() => Context.get())
                    .toThrow(ExecutionContextErrors.CONTEXT_DOES_NOT_EXISTS);
            });

            describe('When context is created', () => {
                it('Updates context', () => {
                    Context.create({ val: 'value' });
                    const context = Context.get();

                    expect(context.val).toEqual('value');

                    Context.update({ val: false });
                    expect(Context.get().val).toBeFalsy();
                });
            });
        });

        describe('Run', () => {
            let spies;
            let execute;
            const initialContext = { initial: 'value' };

            beforeEach(() => {
                execute = jest.fn();
                spies = {
                    contextCreate: jest.spyOn(Context, 'create'),
                    execute
                };

                Context.run(execute, initialContext);
            });

            it('Creates context under root domain', () => {
                expect(spies.contextCreate).toHaveBeenCalledWith(
                    initialContext,
                    undefined
                );
            });

            it('Executes given function', () => {
                expect(spies.execute).toHaveBeenCalledTimes(1);
            });

            it('Expose context to function execution', () => {
                let exposedContext = undefined;
                execute = jest.fn(() => {
                    exposedContext = Context.get();
                });

                Context.run(execute, initialContext);
                expect(exposedContext).toEqual(expect.objectContaining(
                    initialContext
                ));
            });

            describe('Errors', () => {
                const runWithinPromise = () => new Promise((resolve, reject) => {
                    const error = new Error('Promise failed');
                    Context.run(() => reject(error));
                });

                it('Bubbles up error', () => {
                    const errorFn = () => {
                        throw new Error('That went badly.');
                    };
                    expect(() => Context.run(errorFn)).toThrow();
                });

                it('Rejects promises', async (done) => {
                    try {
                        await runWithinPromise();
                        expect(true).toBeFlasy();
                    } catch (e) {
                        expect(e).toBeInstanceOf(Error);
                        done();
                    }
                });
            });
        });
    });

    describe('Context Availability', () => {
        const create = () => Context.create({ hey: true });
        const get = () => Context.get().hey;

        it('Support timeouts', (done) => {
            create();

            setTimeout(() => {
                expect(get()).toBeTruthy();
                Context.update({hey: false});

                setTimeout(() => {
                    expect(get()).toBeFalsy();
                    done();
                }, 200);
            }, 200);
        });

        it('Support micro tasks', (done) => {
            create();

            const microTask = () => new Promise((resolve) => {
                setTimeout(resolve, 200);
            });

            microTask().then(() => {
                expect(get()).toBeTruthy();
                Context.update({hey: false});

                microTask().then(() => {
                    expect(get()).toBeFalsy();
                    done();
                });
            });

        });

        it('Support next ticks', (done) => {
            create();

            process.nextTick(() => {
                expect(get()).toBeTruthy();
                Context.update({hey: false});

                process.nextTick(() => {
                    expect(get()).toBeFalsy();
                    done();
                });
            });
        });

        describe('Domains', () => {
            it('Blocks when creation is made under the same domain', () => {
                create();

                expect(create).toThrow();
            });

            it('Allows to create sub domains under a root context', (done) => {
                create();

                expect(Context.get().hey).toBeTruthy();

                setTimeout(() => {
                    Context.create({ some: 'where' }, 'that-domain');
                    Context.update({ hey: false });

                    expect(Context.get().hey).toBeFalsy();
                    expect(Context.get().some).toEqual('where');
                }, 500);

                setTimeout(() => {
                    expect(Context.get().hey).toBeTruthy();

                    done();
                }, 1500);
            });
        });
    });
});
