const lib = require ('.');
const Context = require('../');

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

    describe('monitorMap', () => {
        describe('When no context is open', () => {
            let report;
            beforeEach(() => {
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
                        done()
                    });
                });
            });
        });
    });
});
