const path = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
      },
      fallback: {
        assert: require.resolve('assert/'),
        stream: require.resolve('stream-browserify'),
      },
    },
  },
};
