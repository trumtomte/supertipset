const path = require('path');

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
    }
};
