const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build/static/js'),
        filename: "main.js",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false
                }
            },
        ],
    },
    optimization: {
        minimize: true,
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.mjs', '.js', '.jsx', '*']
    },
};
