import { createWebpackConfig } from '../tools/webpack/create-webpack-config.ts';

export default createWebpackConfig({
  name: 'sidebar-remote',
  appRoot: 'sidebar-remote',
  outputPath: 'dist/sidebar-remote',
  htmlTemplate: 'src/index.html',
  port: 3002,
  tsConfigPath: 'sidebar-remote/tsconfig.app.json',
  exposes: {
    './Sidebar': './src/Sidebar.tsx'
  }
});
