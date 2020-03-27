/**
 * The excluded async process from our context map.
 * Connections async processes tend not to be destroyed, which potentially will cause memory leak issues.
 * We can skip those types assuming the execution context won't be used for process types.
 * @type {Set<String>}
 */
exports.EXCLUDED_ASYNC_TYPES  = new Set(['DNSCHANNEL', 'TLSWRAP', 'TCPWRAP', 'HTTPPARSER']);
