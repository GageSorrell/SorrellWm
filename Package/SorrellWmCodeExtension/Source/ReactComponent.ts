/**
 * Create the source templates for a React component directory.
 *
 * @module @sorrell/sorrell-wm-code-extension/ReactComponent
 * @internal
 *
 * @file      ReactComponent.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

const TypeScriptIdentifierPattern: RegExp =
    /^[$_\p{ID_Start}](?:[$_\p{ID_Continue}]|\u200C|\u200D)*$/u;
const PascalCasePattern: RegExp = /^\p{Lu}[\p{L}\p{N}]*$/u;

/** A file generated for a React component. */
interface ReactComponentFile
{
    readonly Content: string;
    readonly Name: string;
}

/**
 * Validate a prospective React component name.
 *
 * @param ComponentName - The prospective component name.
 * @returns {string | undefined} A validation message, or `undefined` when valid.
 *
 * @category validation
 * @since 0.1.0
 */
const ValidateReactComponentName = (
    ComponentName: string
): string | undefined =>
{
    if (ComponentName.length === 0)
    {
        return "Enter a component name.";
    }

    if (!TypeScriptIdentifierPattern.test(ComponentName))
    {
        return "The component name must be a valid TypeScript identifier.";
    }

    if (!PascalCasePattern.test(ComponentName))
    {
        return "The component name must be in PascalCase.";
    }

    return undefined;
};

/**
 * Create the six source files for a React component.
 *
 * @param ComponentName - The valid PascalCase component name.
 * @returns {ReadonlyArray<ReactComponentFile>} The names and contents of the source files.
 * @throws {Error} When the component name is invalid.
 *
 * @category constructors
 * @since 0.1.0
 */
const CreateReactComponentFiles = (
    ComponentName: string
): ReadonlyArray<ReactComponentFile> =>
{
    const ValidationMessage: string | undefined =
        ValidateReactComponentName(ComponentName);

    if (ValidationMessage !== undefined)
    {
        throw new Error(ValidationMessage);
    }

    return [
        {
            Content:
            [
                `import { Render${ ComponentName } } from "./Render${ ComponentName }.js";`,
                `import { Use${ ComponentName }State } from "./Use${ ComponentName }State.js";`,
                `import { Use${ ComponentName }Style } from "./Use${ ComponentName }Style.js";`,
                "import { flow } from \"effect/Function\";",
                "",
                `export const ${ ComponentName } = flow(`,
                `    Use${ ComponentName }State,`,
                `    Use${ ComponentName }Style,`,
                `    Render${ ComponentName }`,
                ");",
                ""
            ].join("\n"),
            Name: `${ ComponentName }.tsx`
        },
        {
            Content:
            [
                `import type { ${ ComponentName }Props, ${ ComponentName }State } from `
                    + `"./${ ComponentName }.Types.js";`,
                "",
                `export const Use${ ComponentName }State:`,
                `    (Props: ${ ComponentName }Props) => Omit<${ ComponentName }State, "Style"> =`,
                `    (_Props: ${ ComponentName }Props): Omit<${ ComponentName }State, "Style"> =>`,
                "{",
                "    // @TODO",
                "    return {} as any;",
                "};",
                ""
            ].join("\n"),
            Name: `Use${ ComponentName }State.ts`
        },
        {
            Content:
            [
                "import { makeStyles } from \"@fluentui/react-components\";",
                `import type { ${ ComponentName }State } from "./${ ComponentName }.Types.js";`,
                "",
                "const UseStyle = makeStyles({",
                "    Root:",
                "    {",
                "        /* @TODO */",
                "    }",
                "});",
                "",
                `export const Use${ ComponentName }Style:`,
                `    (State: Omit<${ ComponentName }State, "Style">) => ${ ComponentName }State =`,
                `    (State: Omit<${ ComponentName }State, "Style">): ${ ComponentName }State =>`,
                "{",
                "    const Style = UseStyle();",
                "",
                "    // @TODO",
                "    return { ...State, Style };",
                "};",
                ""
            ].join("\n"),
            Name: `Use${ ComponentName }Style.ts`
        },
        {
            Content:
            [
                `import type { ${ ComponentName }State } from "./${ ComponentName }.Types.js";`,
                "",
                `export const Render${ ComponentName }:`,
                `    (State: ${ ComponentName }State) => React.JSX.Element =`,
                `    (State: ${ ComponentName }State): React.JSX.Element =>`,
                "{",
                "    return <div className={ State.Style.Root } />;",
                "};",
                ""
            ].join("\n"),
            Name: `Render${ ComponentName }.tsx`
        },
        {
            Content:
            [
                "import type { ReadonlyRecord } from \"effect/Record\";",
                "",
                `export interface ${ ComponentName }Props`,
                "{",
                "}",
                "",
                `export interface ${ ComponentName }State`,
                "{",
                "    readonly Style: ReadonlyRecord<string, string>;",
                "}",
                ""
            ].join("\n"),
            Name: `${ ComponentName }.Types.ts`
        },
        {
            Content:
            [
                `export { ${ ComponentName } } from "./${ ComponentName }.js";`,
                `export type { ${ ComponentName }Props } from "./${ ComponentName }.Types.js";`,
                ""
            ].join("\n"),
            Name: "index.ts"
        }
    ];
};

export {
    CreateReactComponentFiles,
    type ReactComponentFile,
    ValidateReactComponentName
};
