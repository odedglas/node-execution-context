/**
 * The deprecation messages to use when deprecated functions are being called.
 * @type {Object<String>}
 */
exports.DEPRECATION_MESSAGES = {
    CONFIGURE: 'Configure is relevant only for AsyncHooks context manager and should not be used on this current node version.',
    MONITOR: 'Monitoring is relevant only for AsyncHooks context manager since the contexts are self managed. This version implementation is based on nodejs `AsyncLocalStorage` feature and thus guaranteed to have no memory issues.'
};
