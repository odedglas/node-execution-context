const lib = require ('.');
const { ExecutionContextErrors } = require('../ExecutionContext/constants');
const { AsyncHooksContext } = require('../managers');

describe('Lib', () => {
    describe('isProduction', () => {

        it.each([
            'something',
            'dev'
        ])('Returns falsy when env - (%p) is not production', (env) => {
            expect(lib.isProduction(env)).toBeFalsy();
        });

        it('Returns truthy when running on production', () => {
            expect(lib.isProduction('production')).toBeTruthy();
        });
    });

    describe('isUndefined', () => {
        it.each([
            'String',
            false,
            {},
            1
        ])('Returns falsy when given value is defined', (val) => {
            expect(lib.isUndefined(val)).toBeFalsy();
        });

        it.each([
            undefined,
            null
        ])('Returns truthy when value is undefined', (val) => {
            expect(lib.isUndefined(val)).toBeTruthy();
        });
    });

    describe('isObject', () => {
        it.each([
            [false, false],
            [1, false],
            ['', false],
            [undefined, false],
            [[], false],
            [() => {}, false],
            [class Test {}, false],
            [{}, true],
        ])('Returns true when given value is object (%p)', (value, expected) => {
           expect(lib.isObject(value)).toEqual(expected);
        });
    });

    describe('supportAsyncLocalStorage', () => {
        describe('When node version is lower than 12.17.0', () => {
            it.each([
                'v6.8.0',
                'v10.9.11',
                'v12.16.9'
            ])('Return false', (version) => expect(lib.supportAsyncLocalStorage(version)).toBeFalsy());
        });

        describe('When node version is greater than 12.17.0', () => {
            describe('When node version is lower than 12.17.0', () => {
                it.each([
                    'v12.17.0',
                    'v14.6.0',
                    'v15.1.0',
                ])('Return false', (version) => expect(lib.supportAsyncLocalStorage(version)).toBeTruthy());
            });
        });
    });

    describe('monitorMap', () => {
        describe('AsyncHooksContext', () => {
            const Context = new AsyncHooksContext();

            describe('When context is not configured to tracking', () => {
                it('Throws miss configured error', () => {
                    expect(() => Context.monitor()).toThrow(ExecutionContextErrors.MONITOR_MISS_CONFIGURATION);
                });
            });

            describe('When no context is open', () => {
                let report;
                beforeEach(() => {
                    Context.configure({ monitor: true });

                    report = Context.monitor();
                });
                it('Returns empty usage', () => {
                    expect(report.size).toEqual(0);
                });

                it('Return empty array entries', () => {
                    expect(Array.isArray(report.entries)).toBeTruthy();
                    expect(report.entries).toHaveLength(0);
                });
            });

            describe('When context is created', () => {
                const contextAware = (fn) => {
                    Context.create({ value: true });
                    fn();
                };

                const spwan = () => new Promise((resolve) => setTimeout(resolve, 100));

                describe('When a single process is present', () => {
                    it('Reports with empty usage', () => {
                        contextAware(() => {
                            const report = Context.monitor();

                            expect(report.size).toEqual(1);
                            expect(report.entries).toHaveLength(1);
                            expect(report.entries[0].children).toHaveLength(0);
                        });
                    });
                });

                describe('When sub process is present', () => {
                    it('Reports root context entries', (done) => {
                        contextAware(() => {
                            spwan();
                            const report = Context.monitor();

                            expect(report.size > 0).toBeTruthy();
                            expect(report.entries.length > 0).toBeTruthy();
                            done();
                        });
                    });
                });
            });
        });
    });
});
