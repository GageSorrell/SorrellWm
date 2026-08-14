# Initial Draft of Plan for monorepo script `@sorrell/wm-init-package`

This script should exist as a new `npm` package under the monorepo root `Script` directory, that is, `./Script/InitPackage`.  This plan details the desired functionality, as well as some implementation details.

## General

Please write add a new script under the root `Script` directory.  This should be an npm package which allows for the creation of new npm packages.  It should use the effect v4 beta's CLI module, and `@effect/platform-node@^4.0.0.-beta`.  The script should work from any directory within the monorepo.

## Prompts

The script should begin with prompting the user for,

* a directory name (this is the name of the directory that will be created under the monorepo root `Package` directory)
* whether the `"private"` field of the `package.json` should be `true` or `false` (the default should be `false`)
* the package name (the `"name"` field of its `package.json`)
* description

as well as the following items, all of which should be optional,

* keywords
* subdomain
    * first, the user should be presented a boolean prompt that asks whether to use a subdomain of `https://sorrell.sh`, or the `ReadMe` on GitHub
    * then, if the user selected the subdomain option, the user should be prompted to enter a valid subdomain (don't worry about checking if the subdomain is already used, just that it is a valid subdomain name)
* author:
    * a command should be run to get the user's name and email address from the git config (local if it exists, otherwise fall back to git global config)
    * if the name is "Gage Sorrell", then don't show the prompt for the author.  If the user's git config name is *not* "Gage Sorrell", then prompt for their name, email address, and URL, such that the name and email address has default values taken from git config, if present.  The URL prompt should be optional.
* dependencies and devDependencies to install, from the following list,
    * `effect@^4.0.0-beta`
    * `@effect/platform-node@^4.0.0-beta`
    * `@sorrell/windows`
    * React Packages
        * `react@^19.2.7` and `@types/react@19.2.17` (devDependency)
        * `react-dom@19.2.7`
        * `@fluentui/react-components@9.74.4` and `@fluentui/react-icons@2.0.333`
        * `ink@7.1.0`
        * `@sorrell/react`
        * `@sorrell/settings-ui`
        * `@sorrell/windows-ui`
    * Utility Packages
        * `@sorrell/utility`
        * `@sorrell/log`
        * `@sorrell/math`
    * `typescript@6.0.2` (devDependency)
    * `tsx@4.23.1` (devDependency)
    * `@sorrell/tsconfig` (devDependency)
    * `@sorrell/eslint-config` (devDependency)
    * `cross-env@10.1.0` (devDependency)

such that the following packages are initially selected,

* `effect`
* `@sorrell/utility`
* `typescript`
* `@sorrell/tsconfig`
* `@sorrell/eslint-config`
* `cross-env`

and such that the packages in the lists that do not have versions attached to them are the latest respective versions of the packages.

## `package.json`

When writing the `package.json` file, the values from the above prompts should be used as described above.  The following snippet should also be used as a reference to populate the `package.json` file,

```json
{
    "version": "1.0.0-beta.1",
    "bugs": {
        "url": "https://github.com/GageSorrell/SorrellWm/issues"
    },
    "repository": {
        "directory": "Package/${DirectoryName}",
        "type": "git",
        "url": "git+https://github.com/GageSorrell/SorrellWm.git"
    },
    "scripts": {
        "build": "tsc -p ./tsconfig.json",
        "lint": "eslint --config ../../Configuration/eslint.config.js Source"
    },
    "type": "module",
    "exports": {
        ".": {
            "import": "./Distribution/index.js",
            "types": "./Distribution/index.d.ts"
        },
        "./package.json": "./package.json"
    }
}
```

such that the path to the monorepo-wide ES Lint config file in the `"lint"` script is adjusted if needed (although this is unlikely).

If it was determined earlier that the user is Gage Sorrell (via the git config), then the `"author"` field should be

```json
{
    "author": {
        "email": "gage@sorrell.sh",
        "name": "Gage Sorrell",
        "url": "https://sorrell.sh"
    }
}
```

otherwise use the values obtained from the prompt.

The `"os"` field should be `[ "win32" ]` if and only if `@sorrell/windows` was selected as a dependency.

## Other Files and Directories

### `Source` and `Source/index.ts`

There should be a directory `Source` in the package's directory containing a file `index.ts`, with the header generated via the monorepo-wide VS Code extension, and nothing else.  The description at the beginning of this header should be the value of the `package.json`'s `"description"` field.

### `License.md`

There should be a `License.md` in the package's directory, identical to the other `License.md` files already in the monorepo, but with the name replaced with the name obtained earlier in the prompts (otherwise keep as "Gage Sorrell").  The year stated in the file should also be the current year.

### `.gitignore`

There should be a `.gitignore` with the following contents,

```
Distribution
node_modules
*.tsbuildinfo
```

### `.npmignore`

If `"private"` is `false`, then there should be an `.npmignore` file with the following contents,

```
!Distribution
Source
```

### `tsconfig.json`

There should be a `tsconfig.json` with the following contents,

```json
{
    "extends": "@sorrell/tsconfig",
    "compilerOptions": {
        "noEmit": false,
        "outDir": "Distribution",
        "rootDir": "Source"
    },
    "include": [ "Source" ]
}
```

### `ReadMe.md`

There should be a `ReadMe.md` with the following contents,

```markdown
<span style="font-size: 12px;">&copy; ${CURRENT_YEAR} ${AUTHOR_NAME}$.  Provided under the [MIT License](./License.md).</span>

# `${PACKAGE_NAME}$`

**Purpose.**&ensp;${PACKAGE_DESCRIPTION}

```

where the "variables" in the snippet come from the `package.json` or NodeJS utilities (for example, to get the `${CURRENT_YEAR}`).

## Final Actions

Once the above files have been created, the monorepo root `package-lock.json` should be deleted, and `npm install` should be run.  When the postinstall script runs, and the prompt runs asking if the monorepo setup should be done, inject input to respond "no" (I don't recall exactly how the prompt works, but the code for it is in the monorepo and also uses effect v4 beta's CLI module).  Output from the `npm install` command (and the monorepo-specific `postinstall` prompt) should not be displayed unless there is an unrecoverable error and the script exits.  Instead, use a `listr2` task stating that `npm install` is running.

## Miscellaneous

All actions performed that take time (such as attempting to fetch the user's name via `git config`, and creating each file) should be conveyed to the user via terminal output.  Use `listr2` for this, but keep it simple (for example, do not do multiple subtasks with fallbacks for fetching the information via `git config`, just do a single task with a description like "Attempting to fetch user name and email from git.").

For the `git config` stuff, you may install a git client dependency rather than using `child_process` or effect's module for executing commands.

Terminal output (including prompts and `listr2` tasks) should be stylish, and polished, but not "too much."
