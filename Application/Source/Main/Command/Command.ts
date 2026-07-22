/**
 *
 *
 * @module @sorrell/wm/Main/Command/Command
 *
 * @file      Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type Data, Function, Predicate, type Record, Struct, type Types } from "effect";

const TypeIdKey = "~sorrell/wm/Main/Command/Command" as const;

export/** The TypeId for this module. */
const TypeId: unique symbol = Symbol.for(TypeIdKey);

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

export interface Command<out CategoryType extends string = string>
{
    readonly [ TypeId ]: TypeId;
    readonly Category: CategoryType;
    readonly _tag: string;
};

export interface Any extends Command<any> { }

const Proto =
    {
        [ TypeId ]: TypeId,

        Category: "",
        _tag: ""
    } as any;

export namespace Command
{
    export const Constructor = <EnumType extends Enum<any, any>>(
        Category: EnumType["Category"]
    ): () => Data.TaggedEnum.Constructor<EnumType> =>
        () =>
            new Proxy(
                {},
                {
                    /* eslint-disable-next-line @typescript-eslint/typedef */
                    get(_target, tag, _receiver)
                    {
                        if (tag === "$is")
                        {
                            return Predicate.isTagged;
                        }
                        else if (tag === "$match")
                        {
                            return taggedMatch;
                        }

                        return (props: any) =>
                        {
                            const Out = Object.create(Proto);
                            Out.Category = Category;
                            return Object.freeze(Struct.assign(Out, props));
                        };
                    }
                }
            ) as any;

    type TaggedCases<A extends { readonly _tag: string; }> =
        {
            readonly [ K in A["_tag"] ]: (Args: Extract<A, { readonly _tag: K }>) => any;
        };

    function taggedMatch<
        A extends { readonly _tag: string },
        Cases extends TaggedCases<A>
    >(self: A, cases: Cases): ReturnType<Cases[A["_tag"]]>;
    function taggedMatch<
        A extends { readonly _tag: string },
        Cases extends TaggedCases<A>
    >(cases: Cases): (value: A) => ReturnType<Cases[A["_tag"]]>;
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    function taggedMatch<
        A extends { readonly _tag: string },
        Cases extends TaggedCases<A>
    >(): any
    {
        /* eslint-disable prefer-rest-params */
        if (arguments.length === 1)
        {
            const cases = arguments[0] as Cases;
            return function(value: A): ReturnType<Cases[A["_tag"]]>
            {
                return cases[value._tag as A["_tag"]](value as any);
            };
        }

        const value = arguments[0] as A;
        const cases = arguments[1] as Cases;
        return cases[value._tag as A["_tag"]](value as any);
        /* eslint-enable prefer-rest-params */
    }

    /**
     * This is used to define commands; it is analogous to `Data.TaggedEnum`.
     *
     * @since 0.1.0
     */
    export type Enum<Category extends string, A extends Record<string, Record<string, any>>> =
        keyof A extends infer Tag ? Tag extends keyof A ? Types.Simplify<
            Command<Category> &
            { readonly _tag: Tag; } &
            { readonly [ K in keyof A[Tag] ]: A[Tag][K]; }
        >
            : never
            : never;
}

export/**
       * The type guard for {@link Command:type | Commands}.
       *
       * @category Guard
       */
const IsCommand: {
    (Value: unknown): Value is Command;
} = Predicate.hasProperty(TypeId) as any;

export const $is: {
    <const Category extends string>(Category: Category): (Self: Any) => Self is Command<Category>;

    <const Category extends string>(Self: Any, Category: Category): Self is Command<Category>;
} = Function.dual(2, <const CategoryType extends string>(
    Self: Any,
    Category: CategoryType): Self is Command<CategoryType> =>
{
    return Self.Category === Category;
});

export const $match: {
    <A, const Category extends string>(
        Cases: Record.ReadonlyRecord<Category, Function.LazyArg<A>>
    ): (Self: Command<Category>) => A;

    <A, const Category extends string>(
        Self: Command<Category>,
        Cases: Record.ReadonlyRecord<Category, Function.LazyArg<A>>
    ): A;
} = Function.dual(2, <A, const Category extends string>(
    Self: Command<Category>,
    Cases: Record.ReadonlyRecord<Category, Function.LazyArg<A>>): A =>
{
    return Cases[Self.Category]();
});
