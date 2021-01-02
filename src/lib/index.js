/**
 * The production environment
 * @type {String}
 */
const PRODUCTION = 'production';

const env = process.env.NODE_ENV || PRODUCTION;

module.exports = {
    env,

    /**
     * Checks if current environment matches production.
     * @param {String} environment - The current environment.
     * @return {Boolean}
     */
    isProduction: (environment = env) => environment === PRODUCTION,

    /**
     * Checks if a given value is undefined.
     * @param {String} thing that thing to check.
     * @return {Boolean}
     */
    isUndefined: (thing) => [null, undefined].includes(thing)
};
