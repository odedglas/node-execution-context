/**
 * The Execution context error that can be thrown while accessing the execution context.
 * @type {Object<String>}
 */
exports.ExecutionContextErrors = {
    CONTEXT_ALREADY_DECLARED: 'Execution context is already declared for the default domain, use the domain option to create a separate context.',
    CONTEXT_DOES_NOT_EXISTS: 'Execution context does not exists, please ensure to call create/run before.',
    MONITOR_MISS_CONFIGURATION: 'Monitoring option is off by default, please call `configure` with the proper options.'
};

/**
 * The default configuration to use.
 * @type {ExecutionContextConfig}
 */
exports.DEFAULT_CONFIG = {
    monitor: false
};

/**
 * The default domain to create execution context roots under.
 * @type {String}
 */
exports.ROOT_DOMAIN = 'ROOT';
