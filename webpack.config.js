module.exports = {
    entry: './src/index.js',
    devtool: 'inline-source-map',
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'konami-code.js',
        library: 'konamiCode',
        libraryTarget: 'window',
        libraryExport: 'default'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    devServer: {
        contentBase: './dist'
    }
};