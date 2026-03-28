# `clean-repo`

This package "cleans" a local copy of the monorepo by (1) deleting all `node_modules` directories, and (2) deleting all `*.tsbuildinfo` files.

**Note.**&ensp;This package does *not* re-install or re-build anything, and it does *not* delete any build output (*e.g.*, `Distribution` directories).

## Usage

First, build the package,

```bash
yarn run build
```

then run the `start` script,

```bash
yarn run start
```
