# SorrellWm Command Palette Extension

A [PowerToys Command Palette](https://learn.microsoft.com/windows/powertoys/command-palette/overview)
extension that will become an alternative frontend for SorrellWm. It does not
implement any window-management functionality yet; it currently registers a
single top-level "SorrellWm" command whose page lists one placeholder entry,
so its presence can be verified inside Command Palette.

Unlike the rest of this monorepo, this package is plain C#/.NET - it is not
an npm workspace and has no `package.json`.

## Icon

The extension's icon is the Fluent UI color icon `BoardColor`
(`@fluentui/react-icons`). `SorrellWmCommandPalette/Assets/BoardColor.svg`
is the source of truth; `Script/GenerateIcons.mjs` rasterizes it, via the
[Inkscape](https://inkscape.org/) CLI, into every PNG size
`Package.appxmanifest` and the command provider's icon reference need.
Regenerate them with:

```powershell
node Script/GenerateIcons.mjs
```

This expects Inkscape at `C:\Program Files\Inkscape\bin\inkscape.exe`.

## Prerequisites

* [.NET SDK](https://dotnet.microsoft.com/) matching the `TargetFramework` in
  `SorrellWmCommandPalette/SorrellWmCommandPalette.csproj`.
* PowerToys with Command Palette installed and running.
* [Developer Mode](https://learn.microsoft.com/windows/apps/get-started/enable-your-device-for-development)
  turned on (Settings > Privacy & security > For developers). Sideloading an
  unsigned package - which is what the dev loop below does - requires it.

## Build

```powershell
dotnet build Package/SorrellWmCommandPalette/SorrellWmCommandPalette/SorrellWmCommandPalette.csproj
```

## Rapid-iteration testing

Command Palette only picks up an extension from an installed package, so
there is no dedicated "run" step; `Deploy.ps1` is the fast loop that stands
in for Visual Studio's "Deploy" button:

```powershell
Package/SorrellWmCommandPalette/Deploy.ps1
```

It builds the project, then registers the resulting loose (unpackaged) app
layout with `Add-AppxPackage -Register` - the same mechanism Visual Studio
uses for MSIX apps under F5, and (with Developer Mode on) it needs no signing
certificate. The first time it runs, if Developer Mode is off, it fails with
a clear message pointing at the setting instead of the raw HRESULT.

After it succeeds:

1. In Command Palette, run **Reload** (the entry subtitled "Reload Command
   Palette Extension").
2. Scroll to the bottom of the command list (or press Up once from the top)
   and press <kbd>Enter</kbd> on **SorrellWm**.
3. You should see one placeholder entry, confirming the extension is loaded.

Re-run `Deploy.ps1` after making changes and repeat the **Reload** step -
Command Palette does not notice rebuilt packages on its own.

## Project layout

This follows the structure produced by Command Palette's own
["Create a new extension"](https://learn.microsoft.com/windows/powertoys/command-palette/creating-an-extension)
command:

```text
SorrellWmCommandPalette.sln
SorrellWmCommandPalette/
    Program.cs                              COM server entry point
    SorrellWmCommandPalette.cs               IExtension implementation
    SorrellWmCommandPaletteCommandsProvider.cs   Registers top-level commands
    Pages/SorrellWmCommandPalettePage.cs     The placeholder list page
    Package.appxmanifest                     Package identity, icons, COM registration
    Assets/                                  Tile and list icons (see above)
```
