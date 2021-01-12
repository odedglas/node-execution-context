const { supportAsyncLocalStorage } = require('../../lib');
const AsyncLocalStorageContext = require('.');

/**
 * Runs given assertion only in case "AsyncLocalStorage" feature supported by current running node.
 * @param {Function} assertion - The assertion to call.
 * @return {Boolean}
 */
const safeAssert = (assertion) => supportAsyncLocalStorage() && assertion();

describe('AsyncLocalStorageContext', () => {
    let Context;

    afterEach(jest.clearAllMocks);

    describe.each([
        'monitor',
        'configure'
    ])('Should warn about usage', (apiName) => {
        const shouldValidate = supportAsyncLocalStorage();

        let spiesWarn;
        let result;

        const setup = () => {
            spiesWarn = jest.spyOn(console, 'warn');
            Context = shouldValidate && new AsyncLocalStorageContext();
            result = shouldValidate ? Context[apiName]() : undefined;
        };

        beforeEach(() => {
            shouldValidate && setup();
        });

        it('Should warn about monitoring usage', () => {
            safeAssert(() => expect(spiesWarn).toHaveBeenCalledTimes(1));
        });

        it('Returns undefined', () => {
            safeAssert(() => expect(result).toBeUndefined());
        });
    });
});
