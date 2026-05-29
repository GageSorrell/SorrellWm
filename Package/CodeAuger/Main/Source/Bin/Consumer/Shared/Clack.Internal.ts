/**
 * @file      Clack.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export function UnknownToMessage(Value: unknown): string | undefined
{
    if (typeof Value === "string")
    {
        return IsNonEmpty(Value);
    }

    if (Value instanceof Error)
    {
        return IsNonEmpty(Value.message);
    }

    if (typeof Value === "object" && Value !== null && "message" in Value)
    {
        type TheValue = Readonly<Partial<{ message: unknown; }>>;
        const Message: unknown = (Value as TheValue).message;

        if (typeof Message === "string")
        {
            return IsNonEmpty(Message);
        }
    }

    return undefined;
}

export function IsNonEmpty(Value: string): string | undefined
{
    const Trimmed: string = Value.trim();

    return Trimmed.length > 0
        ? Trimmed
        : undefined;
}

export function NormalizeMax(Value: number | undefined): number
{
    if (Value === undefined || !Number.isFinite(Value) || Value <= 0)
    {
        return 100;
    }

    return Value;
}

export function NormalizeStep(Value: number): number
{
    if (!Number.isFinite(Value) || Value <= 0)
    {
        return 0;
    }

    return Value;
}

export function Clamp(Value: number, Minimum: number, Maximum: number): number
{
    if (!Number.isFinite(Value))
    {
        return Minimum;
    }

    return Math.min(Maximum, Math.max(Minimum, Value));
};