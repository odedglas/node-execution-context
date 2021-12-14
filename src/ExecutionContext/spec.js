const { ExecutionContextErrors } = require('./constants');

describe('Context', () => {
    let Context;
    beforeEach(() => {
        const ExecutionContext = jest.requireActual('.');
        Context = new ExecutionContext();
    });

    describe('Api', () => {
        describe('Create', () => {
            it('Creates an execution context', () => {
                const context = { val: true };
                Context.create(context);

                expect(Context.get()).toEqual(context);
            });
        });

        describe('Get', () => {
            it('Throws an error when context is not created', () => {
                expect(() => Context.get())
                    .toThrow(ExecutionContextErrors.CONTEXT_DOES_NOT_EXIST);
            });

            describe('When context is created', () => {
                it('Returns context', () => {
                    Context.create({ val: 'value' });
                    const context = Context.get();

                    expect(context.val).toEqual('value');
                });
            });
        });

        describe('Set', () => {
            it('Throws an error when context is not created', () => {
                expect(() => Context.get())
                    .toThrow(ExecutionContextErrors.CONTEXT_DOES_NOT_EXIST);
            });

            describe('When context is created', () => {
                it('Set context', () => {
                    Context.create({ val: 'value' });
                    const context = Context.get();

                    expect(context.val).toEqual('value');

                    Context.set({ val: false });
                    expect(Context.get().val).toBeFalsy();
                });
            });
        });

        describe('Update', () => {
            it('Throws an error when context is not created', () => {
                expect(() => Context.get())
                    .toThrow(ExecutionContextErrors.CONTEXT_DOES_NOT_EXIST);
            });

            it('Throws an error when context is a pain `object`', () => {
                Context.create({ my: 'thing' });

                expect(() => Context.update('Hey'))
                    .toThrow(ExecutionContextErrors.UPDATE_BLOCKED);
            });

            describe('When context is created', () => {
                it('Update context', () => {
                    Context.create({ val: 'value', other: 'o' });
                    const context = Context.get();

                    expect(context.val).toEqual('value');

                    Context.update({ val: false });
                    expect(Context.get()).toMatchObject({
                        val: false,
                        other: 'o'
                    });
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
                    execute
                };

                Context.run(execute, initialContext);
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
                Context.set({ hey: false });

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
                Context.set({ hey: false });

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
                Context.set({ hey: false });

                process.nextTick(() => {
                    expect(get()).toBeFalsy();
                    done();
                });
            });
        });

        describe('Support Domains', () => {
            it('Allows to create sub domains under a root context', (done) => {
                create();

                expect(Context.get().hey).toBeTruthy();

                setTimeout(() => {
                    Context.create({ some: 'where' }, 'that-domain');
                    Context.set({ hey: false });

                    expect(Context.get().hey).toBeFalsy();
                }, 500);

                setTimeout(() => {
                    expect(Context.get().hey).toBeTruthy();

                    done();
                }, 1500);
            });
        });
    });
});
