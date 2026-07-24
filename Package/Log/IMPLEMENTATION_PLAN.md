# `@sorrell/log` implementation plan

The package is organized around one stable `LogRecord` boundary. Every source
(Effect, direct JavaScript, React, forwarded processes, and native addons)
converges on the scoped runtime; every destination receives the same normalized
record.

## Milestone 1 — Core model

- Validated branded hierarchical categories.
- JSON-safe values, conservative normalization limits, circular-reference
  tracking, getter safety, explicit redaction, and the `Loggable` symbol
  protocol.
- Longest-prefix level filtering based on Effect's public `LogLevel` ordering.
- Pure formatter and sink contracts plus an in-memory testing sink.

## Milestone 2 — Runtime and Effect

- Scoped service ownership, monotonic sequences, bounded queue strategies,
  dropped-record summaries, isolated ordered sink delivery, rate-limited
  fallback reporting, flush, and shutdown.
- Effect beta.101 `Logger.make`/`Logger.layer` integration.
- Public `References.CurrentLogAnnotations` and `CurrentLogSpans` capture.
- Public context-reference category composition and effective minimum-level
  installation.

## Milestone 3 — Formatting and Node

- Chalk-only pretty formatting with automatic, forced, or disabled color.
- ANSI-free NDJSON formatting.
- Node console metadata and sinks.
- Asynchronous file creation, flush, shutdown, whole-record size rotation,
  retention, and restart-safe rotated-file discovery.

## Milestone 4 — Direct JavaScript and React

- Best-effort direct logger with child categories and inherited annotations.
- Browser-safe React provider, stable hook, category hook, explicit lifecycle
  hook, and de-duplicating error boundary.

## Milestone 5 — Forwarding

- Callback transport with bounded batches, timer/size/Fatal/shutdown flush.
- Version-one wire messages.
- Defensive record validation and authoritative receiver metadata replacement.

## Milestone 6 — Native

- C++20 record model and move-only RAII bridge.
- Bounded `Napi::TypedThreadSafeFunction` using `NonBlockingCall` only.
- Atomic producer/release coordination, queue-drop accounting, and JavaScript
  callback conversion on the JavaScript thread.
- Real native fixture tests covering main-thread, multiple worker-thread,
  overflow, and release behavior.

## Milestone 7 — Hardening

- Strict source and test type checks.
- Unit, Effect, React, Node file, forwarding, native, type-level, and package
  export tests.
- Entrypoint documentation, examples, and browser-boundary checks.
