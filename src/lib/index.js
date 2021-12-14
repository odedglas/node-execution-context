const semver = require('semver');
const ExecutionContextResource = require('./ExecutionContextResource');

/**
 * The production environment
 * @type {String}
 */
const PRODUCTION = 'production';

const env = process.env.NODE_ENV || PRODUCTION;

/**
 * Calculates a duration between a given moment and now
 * @param {Number} now - The current time
 * @param {Number} created - The created time to calculate it's duration
 * @return {Number}
 */
const getDuration = (now, created) => now - created;

/**
 * Checks if current environment matches production.
 * @param {String} environment - The current environment.
 * @return {Boolean}
 */
const isProduction = (environment = env) => environment === PRODUCTION;

module.exports = {
    ExecutionContextResource,
    env,
    isProduction,

    /**
     * Checks if a given value is undefined.
     * @param {*} input - that input to check.
     * @return {Boolean}
     */
    isUndefined: (input) => [null, undefined].includes(input),

    /**
     * Handles execution context error, throws when none production.
     * @param {String} code - The error code to log.
     */
    handleError: (code) => {
        const error = new Error(code);

        if (!isProduction()) {
            throw error;
        }

        console.error(error); // eslint-disable-line no-console
    },

    /**
     * Checks if current node version supports async local storage.
     * @param {String} version The version to check.
     * @see https://nodejs.org/api/async_hooks.html#async_hooks_class_asynclocalstorage
     * @return {Boolean}
     */
    supportAsyncLocalStorage: (version = process.version) => semver.gte(version, '12.17.0'),

    /**
     * Returns true if a given thing is an object
     * @param value - The thing to check.
     */
    isObject: (value) => !!value &&
        !Array.isArray(value) &&
        typeof value === 'object',

    /**
     * Returns a monitoring report over the "executionContext" memory usage.
     * @param {ExecutionContextMap} executionContextMap The execution map to monitor.
     * @return {ExecutionMapUsage}
     */
    monitorMap: (executionContextMap) => {
        const now = Date.now();
        const mapEntries = [...executionContextMap.values()];
        const entries = mapEntries
            .filter(({ children }) => !!children)
            .map(({ asyncId, created, children, domain, context = {} }) => ({
                asyncId,
                created,
                domain,
                contextSize: JSON.stringify(context).length,
                duration: getDuration(now, created),
                children: children.map((childId) => {
                    const { type, created } =  executionContextMap.get(childId) || {};
                    if (!type) return;

                    return { asyncId: childId, type, created, duration: getDuration(now, created) };
                }).filter(Boolean)
            }));

        return {
            size: executionContextMap.size,
            entries
        };
    }
};
