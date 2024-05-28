// webpack.config.js
const { ESBuildPlugin } = require("esbuild-loader");

module.exports = {
  // other webpack config
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "esbuild-loader",
          options: {
            loader: "jsx", // Remove this if you're not using JSX
            target: "es2015",
          },
        },
      },
    ],
  },
  plugins: [new ESBuildPlugin()],
};
