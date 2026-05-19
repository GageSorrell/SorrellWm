# `@sorrellwm/clean-repo`

This package "cleans" a local copy of the monorepo by (1) deleting all `node_modules` directories, and (2) deleting all `*.tsbuildinfo` files.

**Note.**&ensp;This package does *not* delete any build output (*e.g.*, `Distribution` or `Intermediate` directories).

## Usage

> [!IMPORTANT]
> These commands should be run in the *root* of the monorepo.

To simply delete the contents described above, use

```bash
npm run clean
```

### Options

To automatically run `npm install` after the contents have been deleted, use

```bash
npm run clean:install
```

Similarly, to automatically run `npm install --ignore-scripts` after the contents have been deleted, use

```bash
npm run clean:i
```
