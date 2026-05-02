/**
 * @file      Query.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type TagMatchMode = "Exact" | "IncludingDescendants";

export type CountOperator = "Exactly" | "AtLeast" | "AtMost" | "Between";

export type AlwaysTagQuery = {
    readonly Kind: "Always";
};

export type NeverTagQuery = {
    readonly Kind: "Never";
};

export type HasTagQuery<TagType extends string> = {
    readonly Kind: "Has";
    readonly Tag: TagType;
    readonly Match: TagMatchMode;
};

export type NotTagQuery<TagType extends string> = {
    readonly Kind: "Not";
    readonly Query: TagQuery<TagType>;
};

export type AndTagQuery<TagType extends string> = {
    readonly Kind: "And";
    readonly Queries: readonly TagQuery<TagType>[];
};

export type OrTagQuery<TagType extends string> = {
    readonly Kind: "Or";
    readonly Queries: readonly TagQuery<TagType>[];
};

export type CountTagQuery<TagType extends string> = {
    readonly Kind: "Count";
    readonly Tags: readonly TagType[];
    readonly Match: TagMatchMode;
    readonly Operator: CountOperator;
    readonly Minimum?: number;
    readonly Maximum?: number;
};

export type IsSubsetOfTagQuery<TagType extends string> = {
    readonly Kind: "IsSubsetOf";
    readonly Tags: readonly TagType[];
    readonly Match: TagMatchMode;
};

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

export type TagQueryBuilderOptions = {
    readonly Match?: TagMatchMode;
};

export type CountTagQueryInput<TagType extends string> = {
    readonly Tags: readonly TagType[];
    readonly Match?: TagMatchMode;
    readonly Operator: CountOperator;
    readonly Minimum?: number;
    readonly Maximum?: number;
};

export type TagContainerLike<TagType extends string> = {
    readonly HasExact: (Tag: TagType) => boolean;
    readonly GetExactTags: () => Iterable<TagType>;

    /**
     * Optional optimization. If provided, this should mean:
     * "the container has this exact tag or some descendant of it."
     */
    readonly Has?: (Tag: TagType) => boolean;
};

export type TagContainer<TagType extends string> = TagContainerLike<TagType> & {
    readonly ToArray: () => readonly TagType[];
};

export type TagRegistryLike<TagType extends string> = {
    readonly GetAllTags: () => Iterable<TagType>;
};

