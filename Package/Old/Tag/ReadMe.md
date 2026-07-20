*Copyright &copy; 2026 Gage Sorrell.  Released under the [MIT license](./License.md).*

# `ts-tag`

**Purpose.**&ensp;Hierarchical tags with type-safety and a simple build step.

Highlights:

* Create tags directly in your modules, and in JSON/YAML files
* Define reusable query functors with a full boolean algebra
* LSP-friendly, with full type-safety

## *&ldquo;What are tags?&rdquo;*

This package is inspired by [the Unreal Engine's GameplayTags](https://dev.epicgames.com/documentation/unreal-engine/using-gameplay-tags-in-unreal-engine).
While their name suggests that their utility lies in video-game&ndash;specific work, they are actually a robust and powerful foundation to data-driven design.

## Getting Started

### Prerequisites

| Package | Version |
|--------:|:--------|
| NodeJS  | `>=24`  |

Install this package,

```bash
npm install --save ts-tag
```

While not strictly required, it is highly recommended to install the [CLI tool](../TagCli/ReadMe.md),

```bash
npm init ts-tag-cli
```

Then add the default `"prebuild"` script to your `package.json` via the following command,

```bash
npx ts-tag-cli
```



## Documentation

`@TODO` [Documentation is available here.](https://tag.sorrell.sh)
