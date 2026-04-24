/**
 * @file      data.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

interface ObserverLike<T>
{
    next: (value: T) => void;
    complete: () => void;
    error: (err: unknown) => void;
}

export interface ObservableLike<T = unknown>
{
    subscribe: (observer: ObserverLike<T>) => unknown;
}

export interface ReadableLike
{
    readable: boolean;
    read: (size?: number) => string | Buffer;
    on: (eventName: "data" | "error" | "end", listener: (data: Buffer | string) => void) => unknown;
}
