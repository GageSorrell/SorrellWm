/**
 * Category types and operations for structured logging.
 *
 * @module @sorrell/log/Category
 *
 * @file      Category.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** A validated hierarchical log category. */
export type Category = string & {
    readonly Category: unique symbol;
};

/** Input accepted anywhere a category is composed or selected. */
export type CategoryInput = Category | string;

const SegmentPattern = /^[^.]+$/u;

/** Construct a category, throwing when it contains an empty or dotted segment. */
export function Make(Input: CategoryInput): Category
{
    const Value = String(Input);
    const Segments = Value.split(".");

    if (Segments.length === 0
        || Segments.some((Segment: string) => Segment.length === 0 || !SegmentPattern.test(Segment)))
    {
        throw new TypeError(`Invalid log category: ${ Value }`);
    }

    return Value as Category;
}

/** Try to construct a category without throwing. */
export function TryMake(Input: unknown): Category | undefined
{
    if (typeof Input !== "string")
    {
        return undefined;
    }

    try
    {
        return Make(Input);
    }
    catch
    {
        return undefined;
    }
}

/** Append one or more category segments to a parent category. */
export function Child(Parent: CategoryInput, ChildCategory: CategoryInput): Category
{
    return Make(`${ Make(Parent) }.${ Make(ChildCategory) }`);
}

/** Return the serialized category name. */
export function ToString(Value: Category): string
{
    return Value;
}

/** Test whether a category is equal to or nested below a parent category. */
export function IsWithin(Value: CategoryInput, Parent: CategoryInput): boolean
{
    const CategoryValue = Make(Value);
    const ParentValue = Make(Parent);

    return CategoryValue === ParentValue || CategoryValue.startsWith(`${ ParentValue }.`);
}
