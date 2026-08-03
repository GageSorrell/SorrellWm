/**
 * JSDoc expansion operations for the SorrellWm code extension.
 *
 * @module @sorrell/sorrell-wm-code-extension/JsDoc
 * @internal
 *
 * @file      JsDoc.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

const AutoClosedJsDocPattern: RegExp = /^(?<Indentation>\s*)\/\*\*\s*\*\/\s*$/u;
const JsDocSourceExtensionPattern: RegExp =
    /\.(?:[cm]?[jt]sx?|cc|cpp|cxx|h|hh|hpp|hxx|ixx|cppm|inl|ipp|tpp)$/iu;

/** The edit used to replace an automatically closed one-line JSDoc block. */
export interface JsDocExpansion
{
    readonly CursorCharacter: number;
    readonly CursorLineOffset: number;
    readonly Text: string;
}

/**
 * Determine whether a path supports JSDoc-style comment expansion.
 *
 * @param FilePath - The source path to inspect.
 * @returns {boolean} Whether the extension should expand JSDoc blocks in the file.
 */
export function IsJsDocSourcePath(FilePath: string): boolean
{
    return JsDocSourceExtensionPattern.test(FilePath);
}

/**
 * Expand an automatically closed JSDoc block into the project convention.
 *
 * @param Line - The complete line containing the candidate block.
 * @param PackageVersion - The owning package's version.
 * @param NewLine - The document's newline sequence.
 * @returns {JsDocExpansion | undefined} The replacement and caret position when matched.
 */
export function CreateJsDocExpansion(
    Line: string,
    PackageVersion: string,
    NewLine: string = "\n"
): JsDocExpansion | undefined
{
    const Match: RegExpExecArray | null = AutoClosedJsDocPattern.exec(Line);

    if (Match === null || PackageVersion.length === 0)
    {
        return undefined;
    }

    const Indentation: string = Match.groups?.Indentation ?? "";

    return {
        CursorCharacter: Indentation.length + 3,
        CursorLineOffset: 1,
        Text:
        [
            `${Indentation}/**`,
            `${Indentation} * `,
            `${Indentation} * @since ${PackageVersion}`,
            `${Indentation} */`
        ].join(NewLine)
    };
}
