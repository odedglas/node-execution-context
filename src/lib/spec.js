const lib = require ('.');

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
});
