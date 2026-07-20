# SorrellWm Code Extension

This workspace extension applies SorrellWm source conventions while developers work in VS Code.

## Source module headers

When a supported TypeScript or C++ file is created anywhere in the open workspace, the extension inserts the project's JSDoc-compatible header at the beginning of the file and saves it. It does not replace a header that it previously generated.

Supported extensions are `.ts`, `.tsx`, `.cc`, `.cpp`, `.cxx`, `.h`, `.hh`,
`.hpp`, `.hxx`, `.ixx`, `.cppm`, `.inl`, `.ipp`, and `.tpp`.

The module name consists of the nearest package's `package.json` `name`, followed by the file path beneath its `Source` or `src` directory. The final source extension is removed. For example:

```text
Package/Utilities/Source/Collection/Map.ts
    -> @sorrell/utilities/Collection/Map

Package/Windows/Source/Native/Windows.cc
    -> @sorrell/windows/Native/Windows
```

If any path component contains the case-sensitive word `Internal`, the header also receives `@internal` immediately after `@module`.

## Development

From the repository root:

```powershell
npm run build --workspace sorrell-wm-code-extension
npm test --workspace sorrell-wm-code-extension
npm run lint --workspace sorrell-wm-code-extension
```

Build an installable extension with:

```powershell
npm run package:vsix --workspace sorrell-wm-code-extension
code --install-extension Package/SorrellWmCodeExtension/SorrellWmCodeExtension.vsix
```

Reload the VS Code window after installing the VSIX. The repository workspace recommends the extension by its identifier, `GageSorrell.sorrell-wm-code-extension`.
