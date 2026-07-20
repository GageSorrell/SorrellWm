/**
 * @file      Query.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    CountTagQuery,
    CountTagQueryInput,
    HasTagQuery,
    IsSubsetOfTagQuery,
    TagContainerLike,
    TagMatchMode
} from "./Query.Types.js";
import { DoesTagMatch, IsTagInBranch } from "./Query.js";
import type { Tag } from "../Tag/Tag.Types.js";

export function EvaluateHasTagQuery<TagType extends Tag>(
    QueryInput: HasTagQuery<TagType>,
    Container: TagContainerLike<TagType>
): boolean
{
    if (QueryInput.Match === "Exact")
    {
        return Container.HasExact(QueryInput.Tag);
    }

    if (Container.Has !== undefined)
    {
        return Container.Has(QueryInput.Tag);
    }

    for (const ExistingTag of Container.GetExactTags())
    {
        if (IsTagInBranch(ExistingTag, QueryInput.Tag))
        {
            return true;
        }
    }

    return false;
}

export function EvaluateCountTagQuery<TagType extends Tag>(
    QueryInput: CountTagQuery<TagType>,
    Container: TagContainerLike<TagType>
): boolean
{
    let MatchingCount: number = 0;

    for (const Tag of QueryInput.Tags)
    {
        if (EvaluateHasTagQuery({
            Kind: "Has",
            Match: QueryInput.Match,
            Tag
        }, Container))
        {
            MatchingCount++;
        }
    }

    switch (QueryInput.Operator)
    {
        case "Exactly":
            return MatchingCount === QueryInput.Minimum;

        case "AtLeast":
            return MatchingCount >= QueryInput.Minimum!;

        case "AtMost":
            return MatchingCount <= QueryInput.Maximum!;

        case "Between":
            return MatchingCount >= QueryInput.Minimum! &&
                MatchingCount <= QueryInput.Maximum!;
    }

    throw new Error(
        "EvaluateCountTagQuery should have exhausted all possible choices, but failed to return a value."
    );
}

export function EvaluateIsSubsetOfTagQuery<TagType extends Tag>(
    QueryInput: IsSubsetOfTagQuery<TagType>,
    Container: TagContainerLike<TagType>
): boolean
{
    for (const ExistingTag of Container.GetExactTags())
    {
        if (!DoesTagMatchAny(ExistingTag, QueryInput.Tags, QueryInput.Match))
        {
            return false;
        }
    }

    return true;
}

export function DoesTagMatchAny(
    ExistingTag: Tag,
    RequestedTags: ReadonlyArray<Tag>,
    Match: TagMatchMode
): boolean
{
    return RequestedTags.some((RequestedTag: Tag) =>
        DoesTagMatch(ExistingTag, RequestedTag, Match)
    );
}

function AssertNonNegativeInteger(Value: number, Name: string): void
{
    if (!Number.isInteger(Value) || Value < 0)
    {
        throw new TypeError(`${ Name } must be a non-negative integer.`);
    }
}

export function CreateCountTagQuery<TagType extends Tag>(
    Input: CountTagQueryInput<TagType>
): CountTagQuery<TagType>
{
    const Match: TagMatchMode = Input.Match ?? "IncludingDescendants";

    switch (Input.Operator)
    {
        case "Exactly":
        case "AtLeast":
        {
            if (Input.Minimum === undefined)
            {
                throw new TypeError(`${Input.Operator} count queries require Minimum.`);
            }

            AssertNonNegativeInteger(Input.Minimum, "Minimum");

            return {
                Kind: "Count",
                Match,
                Minimum: Input.Minimum,
                Operator: Input.Operator,
                Tags: Input.Tags
            };
        }

        case "AtMost":
        {
            if (Input.Maximum === undefined)
            {
                throw new TypeError("AtMost count queries require Maximum.");
            }

            AssertNonNegativeInteger(Input.Maximum, "Maximum");

            return {
                Kind: "Count",
                Match,
                Maximum: Input.Maximum,
                Operator: Input.Operator,
                Tags: Input.Tags
            };
        }

        case "Between":
        {
            if (Input.Minimum === undefined || Input.Maximum === undefined)
            {
                throw new TypeError("Between count queries require Minimum and Maximum.");
            }

            AssertNonNegativeInteger(Input.Minimum, "Minimum");
            AssertNonNegativeInteger(Input.Maximum, "Maximum");

            if (Input.Minimum > Input.Maximum)
            {
                throw new RangeError("Minimum must be less than or equal to Maximum.");
            }

            return {
                Kind: "Count",
                Match,
                Maximum: Input.Maximum,
                Minimum: Input.Minimum,
                Operator: "Between",
                Tags: Input.Tags
            };
        }
    }
}
