import { createWebpackConfig } from '../tools/webpack/create-webpack-config.ts';

export default createWebpackConfig({
  name: 'chat-remote',
  appRoot: 'chat-remote',
  outputPath: 'dist/chat-remote',
  htmlTemplate: 'src/index.html',
  port: 3003,
  tsConfigPath: 'chat-remote/tsconfig.app.json',
  exposes: {
    './Chat': './src/Chat.tsx'
  }
});
