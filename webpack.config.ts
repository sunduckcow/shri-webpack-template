import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StatoscopePlugin from '@statoscope/webpack-plugin';
import nodeExternals from 'webpack-node-externals'

import UnusedFiles from './plugins/unused-files';

const config: webpack.Configuration = {
    mode: 'production',
    target: 'node',
    externals: [nodeExternals()], 
    entry: {
        root: './src/pages/root.tsx',
        root2: './src/pages/root2.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new UnusedFiles({
            input: path.resolve(__dirname, './src'),
            output: path.resolve(__dirname, './unused.json'),
            whiteList: [path.resolve(__dirname, './src/index.html')],
        }),
        new StatoscopePlugin({
            saveStatsTo: 'stats.json',
            saveOnlyStats: false,
            open: false,
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            "buffer": require.resolve("buffer"),
            "stream": false,
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
        ],
    },
};

export default config;