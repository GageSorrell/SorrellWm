# SorrellWm Code Extension

This workspace extension applies SorrellWm source conventions while developers work in VS Code.

## React components

Run **SorrellWm: Create React Component** from the Command Palette or choose
**Create React Component** from an Explorer item's context menu. The extension
prompts for a PascalCase TypeScript identifier and creates a component directory
containing the component, state hook, style hook, render function, types, and
barrel modules.  When the Explorer command is used on a file, the component is
created beside that file; when it is used on a directory, the component is
created inside that directory.  Command Palette invocations first show a fuzzy
directory picker whose workspace-relative and absolute paths are searchable.

The same generator is available to VS Code agents as the
`#createReactComponent` language model tool.  The tool accepts a component name
and the absolute path of an existing workspace directory, asks for confirmation,
and returns the absolute path of the created component directory.

## Source module headers

When a supported TypeScript or C++ file is created anywhere in the open workspace, the extension inserts the project's JSDoc-compatible header at the beginning of the file and saves it. It skips files ignored by Git and does not replace a header that it previously generated.

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

## JSDoc comments

Typing a standalone JSDoc opening in a JavaScript, TypeScript, or supported C++
source file expands the editor's automatically closed one-line block into four
lines:

```ts
/**
 *
 * @since 1.0.0
 */
```

The extension reads the version from the nearest owning `package.json`,
preserves the line's indentation and the document's newline style, and leaves
the caret on the blank description line. It does not expand inline comments or
ordinary `/**/` block comments.

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
