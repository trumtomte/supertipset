const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './app/index.js',
    output: {
        path: './supertipset/static/supertipset/js/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            include: __dirname
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
};
