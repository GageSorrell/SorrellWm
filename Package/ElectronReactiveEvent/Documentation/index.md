---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "electron-reactive-event"
  tagline: "Type-safe Electron IPC functions, including modern React hooks."
  image:
    src: "./logo.png"
    alt: "electron-reactive-event Logo"
  actions:
    - theme: brand
      text: Read the Docs
      link: /articles/introduction
    - theme: alt
      text: "View the Source"
      link: "https://github.com/GageSorrell/SorrellWm/tree/Master/Package/ElectronReactiveEvent"

features:
  - title: "Type-safe Event Handling"
    icon: "🦺"
    details: "Everything is typed: callbacks, request arguments, response values, and errors.  Define your event types, and everything in <code>electron-reactive-event</code> will follow."
  - title: "Modern React Hooks"
    icon: "🪝"
    details: "Hooks use modern React features like <code>use</code> and transitions.  All functionality is wrapped with common hook idioms, including <code>Deferred</code> variants for most hooks."
  - title: "Familiar API"
    icon: "🧘"
    details: "The functions to send and receive functions are nearly identical to the IPC functions in <code>electron</code>, with added type-safety across the entire API surface."
  - title: "Optional, Simple CLI"
    icon: "⛏️"
    details: "Register your event declarations as a part of your build step.  Simpler projects can register their event declarations manually with ease.  Opt-in by installing the CLI and running the interactive setup wizard."
---
