---
next: false
---
[electron-reactive-event](../) / [CLI](./index.md) / JSON Schema

# JSON Schema

::: tip Purpose
This article shows the type that defines the JSON schema used for the CLI's configuration file, which you can create via the wizard provided by the [`setup` command](./setup.md).
:::

```TS [Schema.Types.ts]
type CliConfig =
{
    "$schema": string;

    /** The `name` of the interface that holds your `main` event declarations. */
    main:
    {
        /** The name of the interface type. */
        name: string;

        /** The path of the module that contains the interface type. */
        path: string;
    };

    /** The `name` of the interface that holds your `renderer` event declarations. */
    renderer:
    {
        /** The name of the interface type. */
        name: string;

        /** The path of the module that contains the interface type. */
        path: string;
    };

    /** Where the module containing the `declare module` blocks will be written. */
    outPath: string;
};
```
