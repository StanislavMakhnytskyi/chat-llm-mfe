const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Step up one level from the 'tools' folder to the project root
const rootDir = path.join(__dirname, "..")

// 1. Run the Nx build command
console.log("🔨 Building all Nx projects...")
execSync("npx nx run-many -t build --all", { stdio: "inherit", cwd: rootDir })

const deployDir = path.join(rootDir, "dist", "deploy")

// 2. Create the unified deployment folder
console.log("📁 Creating unified deployment folder...")
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true })
}
fs.mkdirSync(deployDir, { recursive: true })

// 3. Copy Host
console.log("📦 Copying host application...")
fs.cpSync(path.join(rootDir, "dist", "host"), deployDir, { recursive: true })

// 4. Copy Sidebar Remote
console.log("📦 Copying sidebar remote...")
fs.cpSync(
  path.join(rootDir, "dist", "sidebar-remote"),
  path.join(deployDir, "sidebar-remote"),
  { recursive: true }
)

// 5. Copy Chat Remote
console.log("📦 Copying chat remote...")
fs.cpSync(
  path.join(rootDir, "dist", "chat-remote"),
  path.join(deployDir, "chat-remote"),
  { recursive: true }
)

console.log("✅ Vercel build complete!")
