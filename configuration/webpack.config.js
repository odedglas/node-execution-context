const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const PRODUCTION = 'production';

const root = path.resolve(__dirname, '..');
const environment = process.env.NODE_ENV || PRODUCTION;
const isProduction = environment === PRODUCTION;

module.exports = {
    mode: environment,
    devtool: 'source-map',
    entry: path.join(root, 'index.js'),
    output: {
        filename: 'index.js',
        path: path.join(root, 'dist'),
        libraryTarget: 'umd',
        globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: root,
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        minimize: isProduction,
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    compress: {},
                    mangle: true
                }
            })
        ]
    },
    performance: {
        hints: isProduction ? 'warning' : false
    },
    resolve: {
        extensions: ['.js', '.json']
    }
};
