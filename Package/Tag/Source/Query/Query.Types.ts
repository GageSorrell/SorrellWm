/**
 * @file      Query.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type TagMatchMode =
    | "Exact"
    | "IncludingDescendants";

export type CountOperator =
    | "Exactly"
    | "AtLeast"
    | "AtMost"
    | "Between";

export type AlwaysTagQuery =
    Readonly<{
        Kind: "Always";
    }>;

export type NeverTagQuery =
    Readonly<{
        Kind: "Never";
    }>;

export type HasTagQuery<TagType extends string> =
    Readonly<{
        Kind: "Has";
        Tag: TagType;
        Match: TagMatchMode;
    }>;

export type NotTagQuery<TagType extends string> =
    Readonly<{
        Kind: "Not";
        Query: TagQuery<TagType>;
    }>;

export type AndTagQuery<TagType extends string> =
    Readonly<{
        Kind: "And";
        Queries: ReadonlyArray<TagQuery<TagType>>;
    }>;

export type OrTagQuery<TagType extends string> =
    Readonly<{
        Kind: "Or";
        Queries: ReadonlyArray<TagQuery<TagType>>;
    }>;

export type CountTagQuery<TagType extends string> =
    Readonly<{
        Kind: "Count";
        Tags: ReadonlyArray<TagType>;
        Match: TagMatchMode;
        Operator: CountOperator;
        Minimum?: number;
        Maximum?: number;
    }>;

export type IsSubsetOfTagQuery<TagType extends string> =
    Readonly<{
        Kind: "IsSubsetOf";
        Tags: ReadonlyArray<TagType>;
        Match: TagMatchMode;
    }>;

export type CoreTagQuery<TagType extends string> =
    | AlwaysTagQuery
    | NeverTagQuery
    | HasTagQuery<TagType>
    | NotTagQuery<TagType>
    | AndTagQuery<TagType>
    | OrTagQuery<TagType>
    | CountTagQuery<TagType>;

export type TagQuery<TagType extends string> =
    | CoreTagQuery<TagType>
    | IsSubsetOfTagQuery<TagType>;

export type TagQueryBuilderOptions =
    Readonly<{
        Match?: TagMatchMode;
    }>;

export type CountTagQueryInput<TagType extends string> =
    Readonly<{
        Tags: ReadonlyArray<TagType>;
        Match?: TagMatchMode;
        Operator: CountOperator;
        Minimum?: number;
        Maximum?: number;
    }>;

export type TagContainerLike<TagType extends string> =
    Readonly<{
        HasExact: (Tag: TagType) => boolean;
        GetExactTags: () => Iterable<TagType>;

        /**
         * Optional optimization. If provided, this should mean:
         * "the container has this exact tag or some descendant of it."
         */
        Has?: (Tag: TagType) => boolean;
    }>;

export type TagContainer<TagType extends string> =
    TagContainerLike<TagType> &
    Readonly<{
        ToArray: () => ReadonlyArray<TagType>;
    }>;

export type TagRegistryLike<TagType extends string> =
    Readonly<{
        GetAllTags: () => Iterable<TagType>;
    }>;

