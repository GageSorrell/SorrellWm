/**
 * @file      parser.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * A basic function to parse minutes and tasks passed given a duration.
 * Useful for renderers to show the task time.
 */
export function parseTimer(duration: number): string
{
    const seconds: number = Math.floor(duration / 1000);
    const minutes: number = Math.floor(seconds / 60);

    let parsedTime: string;

    if (seconds === 0 && minutes === 0)
    {
        parsedTime = `0.${Math.floor(duration / 100)}s`;
    }

    if (seconds > 0)
    {
        parsedTime = `${seconds % 60}s`;
    }

    if (minutes > 0)
    {
        parsedTime = `${minutes}m${parsedTime}`;
    }

    return parsedTime;
}
