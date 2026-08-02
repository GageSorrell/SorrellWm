# Context Map

This repo is a multi-context npm workspaces monorepo. Each workspace owns its own `CONTEXT.md` (domain glossary) and `docs/adr/` (context-scoped decisions), created lazily by `/domain-modeling` as terms and decisions get resolved. System-wide decisions live in the root `docs/adr/`.

See `Documentation/Agent/Domain.md` for how to consume these.

| Context | CONTEXT.md |
| --- | --- |
| Application | [Application/CONTEXT.md](./Application/CONTEXT.md) |
| Package/AppSettings | [Package/AppSettings/CONTEXT.md](./Package/AppSettings/CONTEXT.md) |
| Package/DotEnv | [Package/DotEnv/CONTEXT.md](./Package/DotEnv/CONTEXT.md) |
| Package/EsBuildConfigSorrell | [Package/EsBuildConfigSorrell/CONTEXT.md](./Package/EsBuildConfigSorrell/CONTEXT.md) |
| Package/EsLintConfigSorrell | [Package/EsLintConfigSorrell/CONTEXT.md](./Package/EsLintConfigSorrell/CONTEXT.md) |
| Package/Log | [Package/Log/CONTEXT.md](./Package/Log/CONTEXT.md) |
| Package/LogClient | [Package/LogClient/CONTEXT.md](./Package/LogClient/CONTEXT.md) |
| Package/Color | [Package/Color/CONTEXT.md](./Package/Color/CONTEXT.md) |
| Package/DesktopAnimation | [Package/DesktopAnimation/CONTEXT.md](./Package/DesktopAnimation/CONTEXT.md) |
| Package/InkUi | [Package/InkUi/CONTEXT.md](./Package/InkUi/CONTEXT.md) |
| Package/KeyboardUi | [Package/KeyboardUi/CONTEXT.md](./Package/KeyboardUi/CONTEXT.md) |
| Package/Math | [Package/Math/CONTEXT.md](./Package/Math/CONTEXT.md) |
| Package/React | [Package/React/CONTEXT.md](./Package/React/CONTEXT.md) |
| Package/SettingsUi | [Package/SettingsUi/CONTEXT.md](./Package/SettingsUi/CONTEXT.md) |
| Package/TsConfigSorrell | [Package/TsConfigSorrell/CONTEXT.md](./Package/TsConfigSorrell/CONTEXT.md) |
| Package/Utility | [Package/Utility/CONTEXT.md](./Package/Utility/CONTEXT.md) |
| Package/Windows | [Package/Windows/CONTEXT.md](./Package/Windows/CONTEXT.md) |
| Package/WmApi | [Package/WmApi/CONTEXT.md](./Package/WmApi/CONTEXT.md) |
| Package/WindowsUi | [Package/WindowsUi/CONTEXT.md](./Package/WindowsUi/CONTEXT.md) |
| Package/SorrellWmCodeExtension | [Package/SorrellWmCodeExtension/CONTEXT.md](./Package/SorrellWmCodeExtension/CONTEXT.md) |
| Script/Setup | [Script/Setup/CONTEXT.md](./Script/Setup/CONTEXT.md) |
| Script/WmScript | [Script/WmScript/CONTEXT.md](./Script/WmScript/CONTEXT.md) |

None of these `CONTEXT.md` files exist yet — this map is the routing table `/domain-modeling` fills in over time. Don't create a `CONTEXT.md` speculatively; only `/domain-modeling` should add rows' targets, and only when a context's terminology or decisions actually get resolved. Keep this table in sync with the root `package.json`'s `workspaces` field when workspaces are added or removed.
