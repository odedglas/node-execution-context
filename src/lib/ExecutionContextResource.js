const { AsyncResource } = require('async_hooks');

const ASYNC_RESOURCE_TYPE = 'REQUEST_CONTEXT';

/**
 * Wraps node AsyncResource with predefined type.
 */
class ExecutionContextResource extends AsyncResource {
    constructor() {
        super(ASYNC_RESOURCE_TYPE);
    }
}

module.exports = ExecutionContextResource;