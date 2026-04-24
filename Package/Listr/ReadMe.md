*&copy; 2026 Gage Sorrell.  Released under the [MIT license](./License.md).*

# `@sorrell/listr`

**Purpose.**&ensp;Run sets of tasks, and display these tasks and their progress neatly to the user via the terminal.
This package aims to be a modern successor of [`listr2`](https://github.com/listr2/listr2/tree/master/packages/listr2).

A simple API is exposed, as well as `@sorrell/listr/effect`, for using [`Effect`s](https://effect.website/) to create your tasks.
No use or understanding of `effect` is required, but `@sorrell/listr` *does* use `effect` under the hood.

## A Basic Example

`@TODO`

<details>
<summary>**The same example, but with `effect` and `@sorrell/listr/effect`.**</summary>
`@TODO`
</details>

## Getting Started

```bash
npm install --save @sorrell/listr
```

*Optionally,* if you wish to use `effect` to create your tasks,

```bash
npm install --save effect
```

## Documentation

`@TODO`

Documentation will be available at `https://listr.sorrell.sh`, a subdomain of the author's personal website.

## Development

> [!TIP]
> `@TODO`.  This is an abridged form of [the *Development* article in the Documentation.](https://sorrell.sh/latest/article/development)

This package is hosted in the [`SorrellWm` monorepo](https://github.com/GageSorrell/SorrellWm) (in fact, `@sorrell/listr` was motivated by the development of `SorrellWm`).

The monorepo is **not** required for development&mdash;that is, there are no dependencies that are hosted *in* the monorepo^[1].
It is recommended to clone, then extract just this directory, and create a `git` repo in the directory.

For example,

```bash
npx degit GageSorrell/SorrellWm
mv "./SorrellWm/Package/Listr" .
cd Listr
git init .
npm install
```

*Optionally,* move config files hosted centrally in the monorepo to the `Listr` directory,

```bash
# From the `Listr` package root directory
mv ../SorrellWm/Configuration/* .
```

Then, delete the monorepo,

```bash
rm -rf ./SorrellWm
```

### Prerequisites

| Package | Version    |
|--------:|:-----------|
| NodeJS  | `>=24 <25` |

The setup given in [the Devtools article in the `effect` documentation](https://effect.website/docs/getting-started/devtools/) is *recommended*, but not required.

[^1]: Technically, this is not true: a more correct form of this statement is *"there are no dependencies that require their respective *sources* to be local, alongside the source of `@sorrell/listr.`"*
