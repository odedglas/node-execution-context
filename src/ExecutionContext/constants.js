/**
 * The Execution context error that can be thrown while accessing the execution context.
 * @type {Object<String>}
 */
exports.ExecutionContextErrors = {
    CONTEXT_DOES_NOT_EXIST: 'Execution context does not exists, please ensure to call create/run before.',
    UPDATE_BLOCKED: 'Calling "update" API is allowed only when provided context is a plain `object`.',
    MONITOR_MISS_CONFIGURATION: 'Monitoring option is off by default, please call `configure` with the proper options.'
};

/**
 * The default configuration to use.
 * @type {ExecutionContextConfig}
 */
exports.DEFAULT_CONFIG = {
    monitor: false
};
