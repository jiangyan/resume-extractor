const CopyWebpackPlugin = require('copy-webpack-plugin');
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the i18n config if it's there, as we're handling it differently now
}
module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: 'pdf.worker.js',
              to: 'pdf.worker.js',
            },
          ],
        })
      );
    }
    return config;
  },
};