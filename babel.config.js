module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    'babel-plugin-require-context-hook',
    ['@babel/transform-runtime', {
      regenerator: true,
    }],
    'istanbul'
  ],
};
