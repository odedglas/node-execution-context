const ExecutionContext = require('./ExecutionContext');

// Ensures only 1 instance exists per runtime.
global.ExecutionContext = global.ExecutionContext || new ExecutionContext();

module.exports = global.ExecutionContext;
