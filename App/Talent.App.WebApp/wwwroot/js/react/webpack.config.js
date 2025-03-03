const path = require('path');

module.exports = {
    context: __dirname,
    entry: {
        homePage: './ReactScripts/Home.js'
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    watch: true,
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.module\.css$/,  // For CSS Modules
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true, // Enable CSS Modules
                            importLoaders: 1
                        }
                    }
                ]
            },
            {
                test: /\.css$/,  // For global CSS (not modules)
                exclude: /\.module\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    }
};
