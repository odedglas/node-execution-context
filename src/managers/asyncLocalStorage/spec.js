const AsyncLocalStorageContext = require('.');

describe('AsyncLocalStorageContext', () => {
    let Context;

    beforeEach(() => {
        Context = new AsyncLocalStorageContext();
    });

    afterEach(jest.clearAllMocks);

    describe.each([
        'monitor',
        'configure'
    ])('Should warn about usage', (apiName) => {
        let spiesWarn;
        let result;

        beforeEach(() => {
            spiesWarn = jest.spyOn(console, 'warn');
            Context[apiName]();
        });

        it('Should warn about monitoring usage', () => {
            expect(spiesWarn).toHaveBeenCalledTimes(1);
        });

        it('Returns undefined', () => {
            expect(result).toBeUndefined();
        });
    });
});
