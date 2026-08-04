A microfrontend demo built with React 19, Nx, and Module Federation.

**Live demo:** https://chat-llm-mfe.vercel.app/

This project demonstrates how multiple independent microfrontends can be composed into a single application while behaving like one cohesive product.

In this example:

- The **Sidebar** is one microfrontend.
- The **Chat** is another microfrontend.
- Both are rendered together on the same page by the Host application.
- They communicate without losing independence.

## The idea

One of the biggest questions when adopting microfrontends is:

> "How do independently deployed applications work together without feeling disconnected?"

This repository demonstrates two common communication patterns.

### 1. Shared state (implemented)

The Sidebar and Chat consume the same shared Zustand store.

Whenever the user:

- selects a conversation
- creates a new chat
- sends a message
- opens or closes the sidebar

both microfrontends update instantly because they're reading from the same source of truth.

### 2. Custom Events (easy to replace)

Some organizations prefer keeping microfrontends completely isolated without sharing runtime state.

This architecture can easily be adapted to use browser Custom Events instead of a shared store:

```
Sidebar MFE
      │
dispatchEvent(...)
      │
      ▼
Host / Browser
      │
      ▼
Chat MFE
```

The UI composition remains exactly the same—the communication mechanism changes.

This makes the project a good starting point for experimenting with different microfrontend integration strategies.

## Architecture

```
                   Host Application
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
 Sidebar Remote                      Chat Remote
        │                                   │
        └──────────────┬────────────────────┘
                       │
              Shared Zustand Store
```

The host application is responsible only for composing the page.

Each remote owns its own UI, components, and business logic.

## Project structure

```text
chat-llm-mfe/
  host/               # Shell application
  sidebar-remote/     # Sidebar microfrontend
  chat-remote/        # Chat microfrontend
  shared/             # Shared Zustand store and common types
  tools/              # Webpack/Rspack helpers
```

## Tech stack

- React 19
- Nx
- Module Federation 2+
- Zustand
- Tailwind CSS v4
- Webpack

## Running locally

Install dependencies:

```bash
npm install
```

Start everything:

```bash
npm run dev
```

Open:

```
http://localhost:3001
```

Run applications independently:

```bash
npm run dev:host
npm run dev:sidebar
npm run dev:chat
```

## Why Zustand?

The shared store demonstrates one of the simplest ways to make multiple microfrontends feel like a single application.

Because every remote consumes the same state:

- there is no duplicated application state
- UI stays synchronized
- remotes remain independently developed
- communication code stays minimal

If your architecture requires stronger isolation, the shared store can be replaced with browser Custom Events without changing the UI composition.

## Build

```bash
npm run build
```
