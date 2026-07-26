/**
 * Coordinate Sixel repainting with Ink's terminal frames.
 *
 * @module @sorrell/ink-ui/Svg/Paint
 *
 * @file      Paint.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

type Write = (Value: string) => void;
type Painter = (WriteValue: Write) => void;

interface Surface
{
    Immediate: NodeJS.Immediate | undefined;
    readonly OriginalWrite: NodeJS.WriteStream["write"];
    readonly Painters: Map<symbol, Painter>;
    readonly Stdout: NodeJS.WriteStream;
    Scheduled: boolean;
    SynchronizedChunks: Array<string> | undefined;
    SynchronizedImmediate: NodeJS.Immediate | undefined;
    WrappedWrite: NodeJS.WriteStream["write"];
}

const Surfaces = new WeakMap<NodeJS.WriteStream, Surface>();
const BeginSynchronizedOutput = "\u001B[?2026h";
const EndSynchronizedOutput = "\u001B[?2026l";

/** Register an image which must be restored after each Ink frame. */
export function RegisterPainter(Stdout: NodeJS.WriteStream, PainterValue: Painter): () => void
{
    const SurfaceValue: Surface = GetSurface(Stdout);
    const Id: symbol = Symbol("SixelPainter");
    SurfaceValue.Painters.set(Id, PainterValue);
    Schedule(SurfaceValue);

    return () =>
    {
        SurfaceValue.Painters.delete(Id);
        if (SurfaceValue.Painters.size !== 0) {return;}

        if (SurfaceValue.SynchronizedChunks !== undefined)
        {
            CommitSynchronizedFrame(SurfaceValue);
        }

        if (Stdout.write === SurfaceValue.WrappedWrite)
        {
            Stdout.write = SurfaceValue.OriginalWrite;
        }
        Surfaces.delete(Stdout);
    };
}

/** Request a repaint after image content or layout changes without a terminal write. */
export function RequestPaint(Stdout: NodeJS.WriteStream): void
{
    const SurfaceValue: Surface | undefined = Surfaces.get(Stdout);
    if (SurfaceValue !== undefined) {Schedule(SurfaceValue);}
}

function GetSurface(Stdout: NodeJS.WriteStream): Surface
{
    const Existing: Surface | undefined = Surfaces.get(Stdout);
    if (Existing !== undefined) {return Existing;}

    const OriginalWrite: NodeJS.WriteStream["write"] = Stdout.write;
    const SurfaceValue: Surface = {
        Immediate: undefined,
        OriginalWrite,
        Painters: new Map(),
        Scheduled: false,
        Stdout,
        SynchronizedChunks: undefined,
        SynchronizedImmediate: undefined,
        WrappedWrite: OriginalWrite
    };
    const WrappedWrite = function(this: NodeJS.WriteStream, ...Arguments: Array<unknown>): boolean
    {
        const Chunk: unknown = Arguments[0];
        const Value: string | undefined = typeof Chunk === "string"
            ? Chunk
            : (Buffer.isBuffer(Chunk) ? Chunk.toString() : undefined);
        if (Value === BeginSynchronizedOutput && Arguments.length === 1)
        {
            if (SurfaceValue.SynchronizedChunks !== undefined)
            {
                CommitSynchronizedFrame(SurfaceValue);
            }
            SurfaceValue.SynchronizedChunks = [ BeginSynchronizedOutput ];
            SurfaceValue.SynchronizedImmediate = setImmediate(() =>
                CommitSynchronizedFrame(SurfaceValue));
            return true;
        }

        if (SurfaceValue.SynchronizedChunks !== undefined)
        {
            if (Value === EndSynchronizedOutput && Arguments.length === 1)
            {
                return CommitSynchronizedFrame(SurfaceValue);
            }
            if (Value !== undefined && Arguments.length === 1)
            {
                SurfaceValue.SynchronizedChunks.push(Value);
                return true;
            }
            CommitSynchronizedFrame(SurfaceValue);
        }

        const Result: boolean = Reflect.apply(OriginalWrite, this, Arguments) as boolean;
        Schedule(SurfaceValue);
        return Result;
    } as NodeJS.WriteStream["write"];

    SurfaceValue.WrappedWrite = WrappedWrite;
    Stdout.write = WrappedWrite;
    Surfaces.set(Stdout, SurfaceValue);
    return SurfaceValue;
}

function Schedule(SurfaceValue: Surface): void
{
    if (SurfaceValue.Scheduled) {return;}
    SurfaceValue.Scheduled = true;
    SurfaceValue.Immediate = setImmediate(() => Flush(SurfaceValue));
}

function Flush(SurfaceValue: Surface): void
{
    if (SurfaceValue.Immediate !== undefined)
    {
        clearImmediate(SurfaceValue.Immediate);
        SurfaceValue.Immediate = undefined;
    }

    SurfaceValue.Scheduled = false;
    if (SurfaceValue.Painters.size === 0)
    {
        return;
    }

    const WriteValue: Write = (Value: string): void =>
    {
        if (SurfaceValue.SynchronizedChunks !== undefined)
        {
            SurfaceValue.SynchronizedChunks.push(Value);
        }
        else
        {
            Reflect.apply(SurfaceValue.OriginalWrite, SurfaceValue.Stdout, [ Value ]);
        }
    };
    for (const PainterValue of SurfaceValue.Painters.values())
    {
        PainterValue(WriteValue);
    }
}

/** Emit a complete Ink frame and its Sixel layers as one stream chunk. */
function CommitSynchronizedFrame(SurfaceValue: Surface): boolean
{
    const Chunks: Array<string> | undefined = SurfaceValue.SynchronizedChunks;
    if (Chunks === undefined) {return true;}
    if (SurfaceValue.SynchronizedImmediate !== undefined)
    {
        clearImmediate(SurfaceValue.SynchronizedImmediate);
        SurfaceValue.SynchronizedImmediate = undefined;
    }

    Flush(SurfaceValue);
    Chunks.push(EndSynchronizedOutput);
    SurfaceValue.SynchronizedChunks = undefined;
    return Reflect.apply(
        SurfaceValue.OriginalWrite,
        SurfaceValue.Stdout,
        [ Chunks.join("") ]
    ) as boolean;
}
