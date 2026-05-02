/**
 * @file      Query.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type {
    AlwaysTagQuery,
    CoreTagQuery,
    CountTagQuery,
    CountTagQueryInput,
    HasTagQuery,
    IsSubsetOfTagQuery,
    NeverTagQuery,
    TagContainer,
    TagContainerLike,
    TagMatchMode,
    TagQuery,
    TagQueryBuilderOptions,
    TagRegistryLike
} from "./Query.Types.js";
import {
    CreateCountTagQuery,
    DoesTagMatchAny,
    EvaluateCountTagQuery,
    EvaluateHasTagQuery,
    EvaluateIsSubsetOfTagQuery
} from "./Query.Internal.js";
import type { Tag } from "../Tag/Tag.Types.js";

export function CreateTagContainer<const TagsType extends ReadonlyArray<Tag>>(
    ...Tags: TagsType
): TagContainer<TagsType[number]>;
export function CreateTagContainer<TagType extends Tag>(
    Tags: Iterable<TagType>
): TagContainer<TagType>;
export function CreateTagContainer<TagType extends Tag>(
    ...Tags: Array<TagType>
): TagContainer<TagType>;
export function CreateTagContainer<TagType extends Tag>(
    Tags: Iterable<TagType>
): TagContainer<TagType>
{
    const TagSet: Set<TagType> = new Set<TagType>(Tags);

    return {
        HasExact(Tag: TagType): boolean
        {
            return TagSet.has(Tag);
        },

        Has(Tag: TagType): boolean
        {
            for (const ExistingTag of TagSet)
            {
                if (IsTagInBranch(ExistingTag, Tag))
                {
                    return true;
                }
            }

            return false;
        },

        GetExactTags(): Iterable<TagType>
        {
            return TagSet.values();
        },

        ToArray(): ReadonlyArray<TagType>
        {
            return [ ...TagSet ];
        }
    };
}

export function IsTagInBranch(Tag: Tag, Branch: string): boolean
{
    return Tag === Branch || Tag.startsWith(`${ Branch }.`);
}

export function DoesTagMatch(
    ExistingTag: Tag,
    RequestedTag: Tag,
    Match: TagMatchMode
): boolean
{
    if (Match === "Exact")
    {
        return ExistingTag === RequestedTag;
    }

    return IsTagInBranch(ExistingTag, RequestedTag);
}

export function EvaluateTagQuery<TagType extends Tag>(
    QueryInput: TagQuery<TagType>,
    Container: TagContainerLike<TagType>
): boolean
{
    switch (QueryInput.Kind)
    {
        case "Always":
            return true;

        case "Never":
            return false;

        case "Has":
            return EvaluateHasTagQuery(QueryInput, Container);

        case "Not":
            return !EvaluateTagQuery(QueryInput.Query, Container);

        case "And":
            return QueryInput.Queries.every((NestedQuery: TagQuery<TagType>) =>
                EvaluateTagQuery(NestedQuery, Container)
            );

        case "Or":
            return QueryInput.Queries.some((NestedQuery: TagQuery<TagType>) =>
                EvaluateTagQuery(NestedQuery, Container)
            );

        case "Count":
            return EvaluateCountTagQuery(QueryInput, Container);

        case "IsSubsetOf":
            return EvaluateIsSubsetOfTagQuery(QueryInput, Container);
    }

    throw new Error(
        "EvaluateTagQuery should have exhausted all possible choices, but failed to return a value."
    );
}

export function ToCoreTagQuery<TagType extends Tag>(
    QueryInput: TagQuery<TagType>,
    Registry: TagRegistryLike<TagType>
): CoreTagQuery<TagType>
{
    switch (QueryInput.Kind)
    {
        case "Not":
            return Not(
                ToCoreTagQuery(QueryInput.Query, Registry)
            ) as CoreTagQuery<TagType>;

        case "And":
            return And(
                ...QueryInput.Queries.map((NestedQuery: TagQuery<TagType>) =>
                    ToCoreTagQuery(NestedQuery, Registry)
                )
            ) as CoreTagQuery<TagType>;

        case "Or":
            return Or(
                ...QueryInput.Queries.map((NestedQuery: TagQuery<TagType>) =>
                    ToCoreTagQuery(NestedQuery, Registry)
                )
            ) as CoreTagQuery<TagType>;

        case "IsSubsetOf":
        {
            const ExcludedTags: Array<TagType> = [ ...Registry.GetAllTags() ]
                .filter((Tag: TagType) =>
                    !DoesTagMatchAny(Tag, QueryInput.Tags, QueryInput.Match)
                );

            return HasNoneExact(ExcludedTags) as CoreTagQuery<TagType>;
        }

        default:
            return QueryInput;
    }
}

export function Always(): AlwaysTagQuery
{
    return { Kind: "Always" };
}

export function Never(): NeverTagQuery
{
    return { Kind: "Never" };
}

export function Has<TagType extends Tag>(
    Tag: TagType,
    Options: TagQueryBuilderOptions = { }
): HasTagQuery<TagType>
{
    return {
        Kind: "Has",
        Match: Options.Match ?? "IncludingDescendants",
        Tag
    };
}

export function HasExact<TagType extends Tag>(Tag: TagType): HasTagQuery<TagType>
{
    return {
        Kind: "Has",
        Match: "Exact",
        Tag
    };
}

export function Not<TagType extends Tag>(QueryInput: TagQuery<TagType>): TagQuery<TagType>
{
    if (QueryInput.Kind === "Always")
    {
        return Never();
    }

    if (QueryInput.Kind === "Never")
    {
        return Always();
    }

    if (QueryInput.Kind === "Not")
    {
        return QueryInput.Query;
    }

    return {
        Kind: "Not",
        Query: QueryInput
    };
}

export function And<TagType extends Tag>(
    ...Queries: ReadonlyArray<TagQuery<TagType>>
): TagQuery<TagType>
{
    const FlattenedQueries: Array<TagQuery<TagType>> = [ ];

    for (const QueryInput of Queries)
    {
        if (QueryInput.Kind === "Never")
        {
            return Never();
        }

        if (QueryInput.Kind === "Always")
        {
            continue;
        }

        if (QueryInput.Kind === "And")
        {
            FlattenedQueries.push(...QueryInput.Queries);
            continue;
        }

        FlattenedQueries.push(QueryInput);
    }

    if (FlattenedQueries.length === 0)
    {
        return Always();
    }

    if (FlattenedQueries.length === 1)
    {
        return FlattenedQueries[0]!;
    }

    return {
        Kind: "And",
        Queries: FlattenedQueries
    };
}

export function Or<TagType extends Tag>(
    ...Queries: ReadonlyArray<TagQuery<TagType>>
): TagQuery<TagType>
{
    const FlattenedQueries: Array<TagQuery<TagType>> = [];

    for (const QueryInput of Queries)
    {
        if (QueryInput.Kind === "Always")
        {
            return Always();
        }

        if (QueryInput.Kind === "Never")
        {
            continue;
        }

        if (QueryInput.Kind === "Or")
        {
            FlattenedQueries.push(...QueryInput.Queries);
            continue;
        }

        FlattenedQueries.push(QueryInput);
    }

    if (FlattenedQueries.length === 0)
    {
        return Never();
    }

    if (FlattenedQueries.length === 1)
    {
        return FlattenedQueries[0]!;
    }

    return {
        Kind: "Or",
        Queries: FlattenedQueries
    };
}

export function Count<const TagsType extends ReadonlyArray<Tag>>(
    Input: CountTagQueryInput<TagsType[number]>
): CountTagQuery<TagsType[number]>
{
    return CreateCountTagQuery(Input);
}

export function HasAll<const TagsType extends ReadonlyArray<Tag>>(
    Tags: TagsType,
    Options: TagQueryBuilderOptions = { }
): TagQuery<TagsType[number]>
{
    return And(
        ...Tags.map((Tag: Tag) => Has(Tag, Options))
    );
}

export function HasAny<const TagsType extends ReadonlyArray<Tag>>(
    Tags: TagsType,
    Options: TagQueryBuilderOptions = { }
): TagQuery<TagsType[number]>
{
    return Or(
        ...Tags.map((Tag: Tag) => Has(Tag, Options))
    );
}

export function HasNone<const TagsType extends ReadonlyArray<Tag>>(
    Tags: TagsType,
    Options: TagQueryBuilderOptions = { }
): TagQuery<TagsType[number]>
{
    return Not(HasAny(Tags, Options));
}

export function HasAllExact<const TagsType extends ReadonlyArray<Tag>>(
    Tags: TagsType
): TagQuery<TagsType[number]>
{
    return HasAll(Tags, { Match: "Exact" });
}

export function HasAnyExact<const TagsType extends ReadonlyArray<Tag>>(
    Tags: TagsType
): TagQuery<TagsType[number]>
{
    return HasAny(Tags, { Match: "Exact" });
}

export function HasNoneExact<const TagsType extends ReadonlyArray<Tag>>(
    Tags: TagsType
): TagQuery<TagsType[number]>
{
    return HasNone(Tags, { Match: "Exact" });
}

export function AtLeast<const TagsType extends ReadonlyArray<Tag>>(
    MinimumCount: number,
    Tags: TagsType,
    Options: TagQueryBuilderOptions = { }
): CountTagQuery<TagsType[number]>
{
    if (Options.Match !== undefined)
    {
        return CreateCountTagQuery({
            Match: Options.Match,
            Minimum: MinimumCount,
            Operator: "AtLeast",
            Tags
        });
    }
    else
    {
        return CreateCountTagQuery({
            Minimum: MinimumCount,
            Operator: "AtLeast",
            Tags
        });
    }
}

export function AtMost<const TagsType extends ReadonlyArray<Tag>>(
    MaximumCount: number,
    Tags: TagsType,
    Options: TagQueryBuilderOptions = { }
): CountTagQuery<TagsType[number]>
{
    if (Options.Match !== undefined)
    {
        return CreateCountTagQuery({
            Match: Options.Match,
            Maximum: MaximumCount,
            Operator: "AtMost",
            Tags
        });
    }
    else
    {
        return CreateCountTagQuery({
            Maximum: MaximumCount,
            Operator: "AtMost",
            Tags
        });
    }
}

export function Exactly<const TagsType extends ReadonlyArray<Tag>>(
    RequiredCount: number,
    Tags: TagsType,
    Options: TagQueryBuilderOptions = { }
): CountTagQuery<TagsType[number]>
{
    if (Options.Match !== undefined)
    {
        return CreateCountTagQuery({
            Match: Options.Match,
            Minimum: RequiredCount,
            Operator: "Exactly",
            Tags
        });
    }
    else
    {
        return CreateCountTagQuery({
            Minimum: RequiredCount,
            Operator: "Exactly",
            Tags
        });
    }
}

export function Between<const TagsType extends ReadonlyArray<Tag>>(
    MinimumCount: number,
    MaximumCount: number,
    Tags: TagsType,
    Options: TagQueryBuilderOptions = { }
): CountTagQuery<TagsType[number]>
{
    if (Options.Match !== undefined)
    {
        return CreateCountTagQuery({
            Match: Options.Match,
            Maximum: MaximumCount,
            Minimum: MinimumCount,
            Operator: "Between",
            Tags
        });
    }
    else
    {
        return CreateCountTagQuery({
            Maximum: MaximumCount,
            Minimum: MinimumCount,
            Operator: "Between",
            Tags
        });
    }
}

export function ExactlyOne<const TagsType extends ReadonlyArray<Tag>>(
    Tags: TagsType,
    Options: TagQueryBuilderOptions = { }
): CountTagQuery<TagsType[number]>
{
    return Exactly(1, Tags, Options);
}

export function MutuallyExclusive<const TagsType extends ReadonlyArray<Tag>>(
    Tags: TagsType,
    Options: TagQueryBuilderOptions = { }
): CountTagQuery<TagsType[number]>
{
    return AtMost(1, Tags, Options);
}

export function Requires<
    ConditionTagType extends Tag,
    const RequiredTagsType extends ReadonlyArray<Tag>
>(
    ConditionTag: ConditionTagType,
    RequiredTags: RequiredTagsType,
    Options: TagQueryBuilderOptions = { }
): TagQuery<ConditionTagType | RequiredTagsType[number]>
{
    return Or(
        Not(Has(ConditionTag, Options)),
        HasAll(RequiredTags, Options) as TagQuery<ConditionTagType>
    );
}

export function Forbids<
    ConditionTagType extends Tag,
    const ForbiddenTagsType extends ReadonlyArray<Tag>
>(
    ConditionTag: ConditionTagType,
    ForbiddenTags: ForbiddenTagsType,
    Options: TagQueryBuilderOptions = { }
): TagQuery<ConditionTagType | ForbiddenTagsType[number]>
{
    return Or(
        Not(Has(ConditionTag, Options)),
        HasNone(ForbiddenTags, Options) as TagQuery<ConditionTagType>
    );
}

export function HasInBranch<BranchTagType extends Tag>(
    BranchTag: BranchTagType
): HasTagQuery<BranchTagType>
{
    return Has(BranchTag, { Match: "IncludingDescendants" });
}

export function IsSubsetOf<const TagsType extends ReadonlyArray<Tag>>(
    Tags: TagsType,
    Options: TagQueryBuilderOptions = { Match: "Exact" }
): IsSubsetOfTagQuery<TagsType[number]>
{
    return {
        Kind: "IsSubsetOf",
        Match: Options.Match ?? "Exact",
        Tags
    };
}

export function Intersects<const TagsType extends ReadonlyArray<Tag>>(
    Tags: TagsType,
    Options: TagQueryBuilderOptions = { Match: "Exact" }
): CountTagQuery<TagsType[number]>
{
    return AtLeast(1, Tags, {
        Match: Options.Match ?? "Exact"
    });
}
