import process from "process"
import { createWebpackConfig } from "../tools/webpack/create-webpack-config.ts"

const isVercel = process.env.VERCEL === "1"

export default createWebpackConfig({
  name: "host",
  appRoot: "host",
  outputPath: "dist/host",
  htmlTemplate: "src/index.html",
  port: 3001,
  tsConfigPath: "host/tsconfig.app.json",
  remotes: {
    sidebar_remote: isVercel
      ? "sidebar_remote@/sidebar-remote/static/js/remoteEntry.js"
      : "sidebar_remote@http://localhost:3002/static/js/remoteEntry.js",

    chat_remote: isVercel
      ? "chat_remote@/chat-remote/static/js/remoteEntry.js"
      : "chat_remote@http://localhost:3003/static/js/remoteEntry.js",
  },
})
