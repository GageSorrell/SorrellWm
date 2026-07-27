/**
 * Commands are user-facilitated actions that result in modifying the state of the application,
 * and in most cases, the state of the Windows window manager.
 *
 * @module @sorrell/wm/Main/Command/Command
 *
 * @file      Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type Data, Function, Predicate, type Record, Struct, type Types } from "effect";
import type { Unify } from "effect/Unify";

const TypeIdKey = "~sorrell/wm/Main/Command/Command" as const;

export/**
       * The type identifier for this module.
       *
       * @category Command
       * @since 0.1.0
       */
const TypeId: unique symbol = Symbol.for(TypeIdKey);

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

/**
 *
 * @category Command
 * @since 0.1.0
 */
export interface Command<out CategoryType extends string = string>
{
    readonly [ TypeId ]: TypeId;
    readonly Category: CategoryType;
    readonly _tag: string;
};

/**
 * Any command.
 *
 * @category Command
 * @since 0.1.0
 */
export interface Any extends Command<any> { }

const Proto =
    {
        [ TypeId ]: TypeId,

        Category: "",
        _tag: ""
    } as const;

/**
 * This namespace mirrors the functionality provided by {@link Data!TaggedEnum},
 * scoped to creating commands.
 *
 * @category Command
 * @since 0.1.0
 */
export namespace Command
{
    /**
     * The constructor for a set of commands.
     *
     * @category Constructor
     * @since 0.1.0
     */
    export type Constructor<A extends Any> = Types.Simplify<
    {
        readonly [ Tag in A["_tag"] ]: Data.TaggedEnum.ConstructorFrom<
            Extract<A, { readonly _tag: Tag }>,
            "_tag" | "Category" | TypeId
        >
    } & {
        readonly $is: <Tag extends A["_tag"]>(
            tag: Tag
        ) => (u: unknown) => u is Extract<A, { readonly _tag: Tag }>
        readonly $match: {
            <
                Cases extends {
                    readonly [Tag in A["_tag"]]: (
                        args: Extract<A, { readonly _tag: Tag }>
                    ) => any
                }
            >(
                cases: Cases
            ): (value: A) => Unify<ReturnType<Cases[A["_tag"]]>>
            <
                Cases extends {
                    readonly [Tag in A["_tag"]]: (
                        args: Extract<A, { readonly _tag: Tag }>
                    ) => any
                }
            >(
                value: A,
                cases: Cases
            ): Unify<ReturnType<Cases[A["_tag"]]>>
        }
    }>;

    export/** {@inheritDoc Constructor:type} */
    const Constructor = <EnumType extends Enum<any, any>>(
        Category: EnumType["Category"]
    ): () => Constructor<EnumType> =>
        () => new Proxy(
            { },
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
                        Out._tag = tag;
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

export/**
       * Guard for commands of any category.
       *
       * @category Guard
       * @since 0.1.0
       */
const $is: {
    <const Category extends string>(Category: Category): (Self: Any) => Self is Command<Category>;

    <const Category extends string>(Self: Any, Category: Category): Self is Command<Category>;
} = Function.dual(2, <const CategoryType extends string>(
    Self: Any,
    Category: CategoryType): Self is Command<CategoryType> => Self.Category === Category
);

export/**
       * Match a command's category.
       *
       * @category Command
       * @since 0.1.0
       */
const $match: {
    <A, const Categories extends string>(
        Cases: {
            readonly [ Key in Categories ]: (Self: Command<Key>) => A;
        }
    ): (Self: Command<keyof typeof Cases>) => A;

    <A, const Categories extends string>(
        Self: Command<keyof typeof Cases>,
        Cases: {
            readonly [ Key in Categories ]: (Self: Command<Key>) => A;
        }
    ): A;
} = Function.dual(2, <A, const Categories extends string>(
    Self: Command<keyof typeof Cases>,
    Cases: {
        readonly [ Key in Categories ]: (Self: Command<Key>) => A;
    }): A =>
{
    return Cases[Self.Category](Self);
});
