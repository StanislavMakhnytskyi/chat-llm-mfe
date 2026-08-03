import { createWebpackConfig } from '../tools/webpack/create-webpack-config.ts';

export default createWebpackConfig({
  name: 'host',
  appRoot: 'host',
  outputPath: 'dist/host',
  htmlTemplate: 'src/index.html',
  port: 3001,
  tsConfigPath: 'host/tsconfig.app.json',
  remotes: {
    sidebar_remote: 'sidebar_remote@http://localhost:3002/static/js/remoteEntry.js',
    chat_remote: 'chat_remote@http://localhost:3003/static/js/remoteEntry.js'
  }
});
