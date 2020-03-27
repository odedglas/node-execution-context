const path = require('path');

const appRoot = path.resolve('.');

module.exports = {
    verbose: true,
    rootDir: appRoot,
    collectCoverageFrom: [
        '**/*.{mjs,js}'
    ],
    moduleFileExtensions: [
        'js', 'json', 'jsx', 'mjs'
    ],
    testURL: 'http://localhost/',
    transform: {
        '^.+\\.m?jsx?$': 'babel-jest'
    }
};
