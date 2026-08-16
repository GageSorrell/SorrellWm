<span style="font-size: 12px;">&copy; 2026 Gage Sorrell.  Provided under the [MIT License](./License.md).</span>

# `@sorrell/effect`

**Purpose.**&ensp;Effect-native utilities that extend effect's own core modules.

Each submodule re-exports the full contents of its corresponding module in
`effect` (for example, `@sorrell/effect/Data` re-exports everything from
`effect/Data`), then layers Sorrell-specific additions on top. Where a name
collides with an addition of the same name, the addition here wins, since
ordinary named exports always take precedence over a `export *` re-export.

`@sorrell/effect/Async` has no corresponding module in `effect` and is
Sorrell-specific throughout.

`@effect/platform-node` is an optional peer dependency; install it yourself
if a future addition to this package needs it.
