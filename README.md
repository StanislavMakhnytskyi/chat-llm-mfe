# chat-llm-mfe

A polished Nx-based demo of a React 19 chat experience composed from multiple micro-frontends on the same page. The host shell renders independent remotes for the sidebar and chat UI, while a shared Zustand store keeps them perfectly in sync.

## Why this project?

- Multiple MFEs work together as one seamless product experience.
- The sidebar and chat panels are loaded as remote modules, yet they feel like a single app.
- Zustand provides a shared source of truth for chats, messages, selection, and sidebar visibility.
- It is a strong starter template for scaling modular frontends without giving up developer experience.

## Architecture at a glance

- Host app: the main shell that composes the experience on one page.
- Sidebar remote: renders conversation list and chat navigation.
- Chat remote: renders the active conversation thread and composer.
- Shared package: exposes the Zustand store and shared types for cross-remote communication.

## Project structure

```text
chat-llm-mfe/
  host/                # shell app that hosts the remotes
  sidebar-remote/     # remote for the conversations sidebar
  chat-remote/        # remote for the chat panel
  shared/             # shared package with Zustand store and types
  tools/              # webpack and rspack config helpers
  nx.json             # Nx workspace config
  package.json        # workspace scripts and dependencies
```

## Tech stack

- React 19
- Nx
- Module Federation 2.0+
- Zustand
- Tailwind CSS v4
- Webpack

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the full experience:
   ```bash
   npm run dev
   ```
3. Open the host app at:
   - http://localhost:3001

### Individual remotes

- Host shell: `npm run dev:host`
- Sidebar remote: `npm run dev:sidebar`
- Chat remote: `npm run dev:chat`

## How the state works

The shared Zustand store lives in the shared package and is consumed by both remotes. When a user selects a chat, creates a new conversation, or toggles the sidebar, the state updates once and immediately appears across the experience.

## Build

```bash
npm run build
```
