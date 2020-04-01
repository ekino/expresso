// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
    // default to the server configuration
    entry: './src/views/client.tsx',
    output: {
        filename: 'client.js',
        // path needs to be an ABSOLUTE file path
        path: path.resolve(process.cwd(), 'build/public')
    },
    mode: 'development',
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    }
}
