/**
 * The Execution context error that can be thrown while accessing the execution context.
 * @type {Object<String>}
 */
exports.ExecutionContextErrors = {
    CONTEXT_ALREADY_DECLARED: 'Execution context is already declared for the default domain, use the domain option to create a separate context.',
    CONTEXT_DOES_NOT_EXISTS: 'Execution context does not exists, please ensure to call create/run before.'
};
