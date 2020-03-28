/**
 * The production environment
 * @type {String}
 */
const PRODUCTION = 'production';

const env = process.env.NODE_ENV || PRODUCTION;

module.exports = {
    env,
    isProduction: (environment = env) => environment === PRODUCTION,
    isUndefined: (thing) => [null, undefined].includes(thing)
};
