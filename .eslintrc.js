// eslint config file

module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'rules': {
        'no-console': 0,
        'eqeqeq': 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [
            'error',
            'always'
        ],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ],
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'off',
            'windows'
        ],
        'quotes': [
            'off',
            'single'
        ],
        'semi': [
            'off',
            'never'
        ],
    }
}
