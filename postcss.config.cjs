module.exports = {
    plugins: [
        // Adds vendor prefixes automatically based on browserslist
        require('autoprefixer'),

        // Uses modern CSS features with fallbacks
        require('postcss-preset-env')({
            stage: 2,
            features: {
                'nesting-rules': true,
                'custom-media-queries': true,
                'custom-properties': false, // Don't transform CSS variables
            },
        }),

        // Minify and optimize CSS (only in production)
        ...(process.env.NODE_ENV === 'production'
            ? [
                require('cssnano')({
                    preset: [
                        'default',
                        {
                            discardComments: {
                                removeAll: true,
                            },
                            calc: false,
                        },
                    ],
                }),
            ]
            : []),
    ],
};
