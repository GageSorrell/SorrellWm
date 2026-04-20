/**
 * @file      Profiling.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

const ProfilingMap: TMap<string, number> = new Map();

export function BeginProfiling(TaskName: string): void
{
    ProfilingMap.set(TaskName, Date.now());
}

export function EndProfiling(TaskName: string): string
{
    const StartTime: number | undefined = ProfilingMap.get(TaskName);
    if (StartTime === undefined)
    {
        throw new Error("Profiling not started for task: " + TaskName);
    }

    const DurationMilliseconds: number = Date.now() - StartTime;
    const Minutes: number = Math.floor(DurationMilliseconds / 60000);
    const Seconds: number = Math.floor((DurationMilliseconds % 60000) / 1000);

    ProfilingMap.delete(TaskName);

    const FormattedMinutes: string = Minutes.toString().padStart(2, "0");
    const FormattedSeconds: string = Seconds.toString().padStart(2, "0");

    return `${FormattedMinutes}m${FormattedSeconds}s`;
}
