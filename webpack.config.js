const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const webpack = require('webpack');


module.exports = (webpackConfigEnv, argv) => {
  const isLocal = webpackConfigEnv && webpackConfigEnv.isLocal;
  const defaultConfig = singleSpaDefaults({
    orgName: "andy-inc",
    projectName: "settings-mf",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    plugins: [
      new webpack.DefinePlugin({
        API_URL: isLocal ? JSON.stringify('http://localhost') : JSON.stringify('http://94.250.250.29')
      })
    ]
  });
};
