/**
 * @file      Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * For a given command, get the name of that command, such that it will
 * work, even if the command will be run inside of a Windows shell terminal.
 *
 * @note The {@link process!platform} is used to determine whether `.cmd`
 * should be appended.
 *
 * @param {string} PlainName - The name of the command, without `.cmd` appended.
 * @returns {string} The command, with `.cmd` appended, if needed.
 *
 * @example
 * Suppose that the following code belongs to a script that is being run within
 * a Windows shell terminal,
 * ```typescript
 * const MyCommand: string = GetCommandName("MyCommand");
 * // `MyCommand` <- `"MyCommand.cmd"`
 * ```
 *
 * Now suppose that the following code belongs to a script that is *not* being run
 * within a Windows shell terminal,
 * ```typescript
 * const MyCommand: string = GetCommandName("MyCommand");
 * // `MyCommand` <- `"MyCommand"`
 * ```
 */
export function GetCommandName(PlainName: string): string
{
    return process.platform === "win32"
        ? `${ PlainName }.cmd`
        : PlainName;
}
