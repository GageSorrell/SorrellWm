/**
 * Ordered Sixel paint queue for Box pixel effects.
 *
 * @module @sorrell/ink-ui/Box/Paint
 *
 * @file      Paint.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

interface PaintRequest
{
    readonly Content: string;
    readonly Id: object;
    readonly Order: number;
    readonly ZOrder: number;
}

interface PaintQueue
{
    FlushScheduled: boolean;
    NextOrder: number;
    readonly Requests: Map<object, PaintRequest>;
}

const Queues = new WeakMap<NodeJS.WriteStream, PaintQueue>();

/**
 * Retain the latest pixel paint for one Box and replay the complete stack from
 * low to high z-order whenever any member changes.
 */
export function QueueBoxPaint(
    Stream: NodeJS.WriteStream,
    Id: object,
    ZOrder: number,
    Content: string
): void
{
    const Queue: PaintQueue = GetQueue(Stream);
    const Existing: PaintRequest | undefined = Queue.Requests.get(Id);
    Queue.Requests.set(Id, {
        Content,
        Id,
        Order: Existing?.Order ?? Queue.NextOrder++,
        ZOrder: NormalizeZOrder(ZOrder)
    });

    if (Queue.FlushScheduled)
    {
        return;
    }
    Queue.FlushScheduled = true;
    setImmediate(() => Flush(Stream, Queue));
}

/** Remove a pending paint when its Box unmounts. */
export const CancelBoxPaint = (Stream: NodeJS.WriteStream, Id: object): void =>
{
    Queues.get(Stream)?.Requests.delete(Id);
};

function GetQueue(Stream: NodeJS.WriteStream): PaintQueue
{
    const Existing: PaintQueue | undefined = Queues.get(Stream);
    if (Existing !== undefined)
    {
        return Existing;
    }

    const Queue: PaintQueue =
        {
            FlushScheduled: false,
            NextOrder: 0,
            Requests: new Map()
        };

    Queues.set(Stream, Queue);
    return Queue;
}

function Flush(Stream: NodeJS.WriteStream, Queue: PaintQueue): void
{
    Queue.FlushScheduled = false;
    const Requests: ReadonlyArray<PaintRequest> = [ ...Queue.Requests.values() ]
        .sort((Left: PaintRequest, Right: PaintRequest) =>
            Left.ZOrder - Right.ZOrder || Left.Order - Right.Order);
    for (const Request of Requests)
    {
        Stream.write(Request.Content);
    }
}

function NormalizeZOrder(Value: number): number
{
    return Number.isFinite(Value) ? Math.trunc(Value) : 0;
}
