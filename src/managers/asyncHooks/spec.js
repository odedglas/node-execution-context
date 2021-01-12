const asyncHooks = require('async_hooks');
const hooks = require('./hooks');

describe('AsyncHooksContext', () => {
    beforeEach(() => {
        const ExecutionContext = jest.requireActual('.');
        new ExecutionContext();
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
});
