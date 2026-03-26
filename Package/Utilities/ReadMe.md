# `@sorrell/utilities`

**Purpose.**&ensp;This package hosts general-purpose utility functions, types, and `bin` scripts.

## Scripts

### `publish-bump-safe`

**Purpose.**&ensp;Runs `npm publish --access public` for the package of the `process.cwd()`.
If the version conflicts with what is already published, then it will run `npm version patch` first.

#### Usage

In any directory within a given `npm` package,
```bash
npx @sorrell/utilities publish-bump-safe
```


