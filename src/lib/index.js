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

module.exports = {
    ExecutionContextResource,
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
    isUndefined: (thing) => [null, undefined].includes(thing),

    /**
     * Returns a monitoring report over the "executionContext" memory usage.
     * @param {ExecutionContextMap} executionContextMap The execution map to monitor.
     * @return {ExecutionMapUsage}
     */
    monitorMap: (executionContextMap) => {
        const now = Date.now();
        const entries = [...executionContextMap.values()]
            .filter(({ children }) => !!children)
            .map(({ asyncId, created, children, context = {} }) => ({
                asyncId,
                created,
                contextSize: JSON.stringify(context).length,
                duration: getDuration(now, created),
                children: children.map((childId) => {
                    const { type, created } = executionContextMap.get(childId);

                    return { asyncId: childId, type, created, duration: getDuration(now, created) };
                })
            }));

        return {
            size: executionContextMap.size,
            entries
        };
    }
};
