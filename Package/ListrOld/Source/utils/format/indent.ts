/**
 * @file      indent.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export function indent(string: string, count: number): string
{
    return string.replace(/^(?!\s*$)/gm, " ".repeat(count));
}
