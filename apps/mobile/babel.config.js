module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { reanimated: false }]],
    plugins: [
      ...(process.env.NODE_ENV === 'production'
        ? [['transform-remove-console', { exclude: ['error', 'warn'] }]]
        : []),
      'react-native-worklets/plugin',
    ],
  };
};
