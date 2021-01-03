const { supportAsyncLocalStorage } = require('../../lib');
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
        const shouldValidate = supportAsyncLocalStorage();

        let spiesWarn;
        let result;

        beforeEach(() => {
            spiesWarn = jest.spyOn(console, 'warn');
            shouldValidate && Context[apiName]();
        });

        it('Should warn about monitoring usage', () => {
            shouldValidate && expect(spiesWarn).toHaveBeenCalledTimes(1);
        });

        it('Returns undefined', () => {
            shouldValidate && expect(result).toBeUndefined();
        });
    });
});
