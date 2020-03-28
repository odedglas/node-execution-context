/**
 * The production environment
 * @type {String}
 */
const PRODUCTION = 'production';

module.exports = {
    PRODUCTION,
    isProduction: () => process.env.NODE_ENV || PRODUCTION,
    isUndefined: (thing) => [null, undefined].includes(thing)
};
