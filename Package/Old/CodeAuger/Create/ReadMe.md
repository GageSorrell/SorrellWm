*Copyright &copy; 2026 Gage Sorrell.  Released under the [MIT license](./License.md).*

# `create-code-auger`

**Purpose.**&ensp;A lightweight CLI tool for adding auto-generated code to your dependents (likewise, from your dependencies).

## Usage

In a directory of your NodeJS package, run

```bash
npm init code-auger
```

then follow the interactive wizard to configure your package for use with `code-auger`.

### Bonus: The `ls` Command

*Before* adding `code-auger` to your package, if you wish to see which dependencies in your package support `code-auger`, use the `ls` command: in a directory of your NodeJS package, run

```bash
npm init code-auger -- ls
```

and the list of dependencies in your package that support `code-auger` will be listed.

This list is also provided when [setup completes](#usage).

## Further Reading

To learn more, please see [the documentation website for `code-auger`](https://code-auger.sorrell.sh).
