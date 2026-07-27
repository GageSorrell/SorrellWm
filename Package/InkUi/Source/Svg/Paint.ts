/**
 * Coordinate inline-image repainting with Ink's terminal frames.
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
    PaintAll: boolean;
    readonly Painters: Map<symbol, Painter>;
    readonly PendingPainters: Set<Painter>;
    readonly Stdout: NodeJS.WriteStream;
    Scheduled: boolean;
    SynchronizedChunks: Array<string> | undefined;
    SynchronizedImmediate: NodeJS.Immediate | undefined;
    WrappedWrite: NodeJS.WriteStream["write"];
}

const Surfaces = new WeakMap<NodeJS.WriteStream, Surface>();
const BeginSynchronizedOutput = "\u001B[?2026h";
const EndSynchronizedOutput = "\u001B[?2026l";

export/**
       * Register an image which must be restored after each Ink frame.
       *
       * @category Render
       * @since 1.0.0
       */
const RegisterPainter = (Stdout: NodeJS.WriteStream, PainterValue: Painter): () => void =>
{
    const SurfaceValue: Surface = GetSurface(Stdout);
    const Id: symbol = Symbol("SvgPainter");
    SurfaceValue.Painters.set(Id, PainterValue);
    Schedule(SurfaceValue, PainterValue);

    return () =>
    {
        SurfaceValue.Painters.delete(Id);
        SurfaceValue.PendingPainters.delete(PainterValue);
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
};

export/**
       * Request a repaint after image content or layout changes without a terminal write.
       *
       * @category Render
       * @since 1.0.0
       */
const RequestPaint = (Stdout: NodeJS.WriteStream, PainterValue?: Painter): void =>
{
    const SurfaceValue: Surface | undefined = Surfaces.get(Stdout);
    if (SurfaceValue !== undefined)
    {
        Schedule(SurfaceValue, PainterValue);
    }
};

const GetSurface = (Stdout: NodeJS.WriteStream): Surface =>
{
    const Existing: Surface | undefined = Surfaces.get(Stdout);
    if (Existing !== undefined) {return Existing;}

    const OriginalWrite: NodeJS.WriteStream["write"] = Stdout.write;
    const SurfaceValue: Surface = {
        Immediate: undefined,
        OriginalWrite,
        PaintAll: false,
        Painters: new Map(),
        PendingPainters: new Set(),
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

        if (Value !== undefined && Arguments.length === 1)
        {
            const PaintChunks: Array<string> = CollectPaint(SurfaceValue.Painters.values());
            const Combined: string = PaintChunks.length === 0
                ? Value
                : BeginSynchronizedOutput + Value + PaintChunks.join("") + EndSynchronizedOutput;
            const Result: boolean = Reflect.apply(OriginalWrite, this, [ Combined ]) as boolean;
            if (PaintChunks.length === 0)
            {
                // The Ink write can happen before newly mounted painters have measurable refs.
                Schedule(SurfaceValue);
            }
            return Result;
        }

        const Result: boolean = Reflect.apply(OriginalWrite, this, Arguments) as boolean;
        Flush(SurfaceValue, true);
        return Result;
    } as NodeJS.WriteStream["write"];

    SurfaceValue.WrappedWrite = WrappedWrite;
    Stdout.write = WrappedWrite;
    Surfaces.set(Stdout, SurfaceValue);
    return SurfaceValue;
};

const Schedule = (SurfaceValue: Surface, PainterValue?: Painter): void =>
{
    if (PainterValue === undefined)
    {
        SurfaceValue.PaintAll = true;
        SurfaceValue.PendingPainters.clear();
    }
    else if (!SurfaceValue.PaintAll)
    {
        SurfaceValue.PendingPainters.add(PainterValue);
    }
    if (SurfaceValue.Scheduled) {return;}
    SurfaceValue.Scheduled = true;
    SurfaceValue.Immediate = setImmediate(() => Flush(SurfaceValue));
};

const Flush = (SurfaceValue: Surface, ForceAll: boolean = false): void =>
{
    if (SurfaceValue.Immediate !== undefined)
    {
        clearImmediate(SurfaceValue.Immediate);
        SurfaceValue.Immediate = undefined;
    }

    const Painters: ReadonlyArray<Painter> = ForceAll || SurfaceValue.PaintAll
        ? [ ...SurfaceValue.Painters.values() ]
        : [ ...SurfaceValue.PendingPainters ]
            .filter((PainterValue: Painter) =>
                [ ...SurfaceValue.Painters.values() ].includes(PainterValue));
    SurfaceValue.PaintAll = false;
    SurfaceValue.PendingPainters.clear();
    SurfaceValue.Scheduled = false;
    if (Painters.length === 0)
    {
        return;
    }

    const Values: ReadonlyArray<string> = CollectPaint(Painters);
    if (Values.length === 0)
    {
        return;
    }
    if (SurfaceValue.SynchronizedChunks !== undefined)
    {
        SurfaceValue.SynchronizedChunks.push(...Values);
        return;
    }

    Reflect.apply(SurfaceValue.OriginalWrite, SurfaceValue.Stdout, [
        BeginSynchronizedOutput + Values.join("") + EndSynchronizedOutput
    ]);
};

const CollectPaint = (Painters: Iterable<Painter>): Array<string> =>
{
    const Values: Array<string> = [ ];

    const WriteValue: Write = (Value: string): void =>
    {
        Values.push(Value);
    };

    for (const PainterValue of Painters)
    {
        PainterValue(WriteValue);
    }

    return Values;
};

/** Emit a complete Ink frame and its inline-image layers as one stream chunk. */
const CommitSynchronizedFrame = (SurfaceValue: Surface): boolean =>
{
    const Chunks: Array<string> | undefined = SurfaceValue.SynchronizedChunks;
    if (Chunks === undefined) {return true;}
    if (SurfaceValue.SynchronizedImmediate !== undefined)
    {
        clearImmediate(SurfaceValue.SynchronizedImmediate);
        SurfaceValue.SynchronizedImmediate = undefined;
    }

    Flush(SurfaceValue, true);
    Chunks.push(EndSynchronizedOutput);
    SurfaceValue.SynchronizedChunks = undefined;
    return Reflect.apply(
        SurfaceValue.OriginalWrite,
        SurfaceValue.Stdout,
        [ Chunks.join("") ]
    ) as boolean;
};
