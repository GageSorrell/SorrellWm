/**
 * Fuzzy-searches the registered `Setting`/`SettingGroup` entries for the settings window's
 * search box.
 *
 * @module @sorrell/wm/Renderer/SettingsSearch
 *
 * @file      SettingsSearch.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { SettingControlEntry } from "@sorrell/settings-ui";

/** The maximum number of results {@link SearchSettingControls} returns. */
export const MaxSettingSearchResults = 8 as const;

/** One {@link SearchSettingControls} result. */
export interface SettingSearchResult
{
    readonly Entry: SettingControlEntry;
    readonly Id: string;
}

const WordBoundary = /[^a-z0-9]/iu;

/**
 * Score how well `Query` fuzzy-matches `Target` as a case-insensitive subsequence, or return
 * `null` if `Query` isn't a subsequence of `Target` at all. Contiguous runs and matches that
 * start a "word" (the first character, or one following a non-alphanumeric character) score
 * higher, so tighter and more prominent matches rank above scattered ones.
 */
const FuzzyScore = (Query: string, Target: string): number | null =>
{
    if (Query.length === 0)
    {
        return 0;
    }

    const NormalizedQuery = Query.toLowerCase();
    const NormalizedTarget = Target.toLowerCase();
    let QueryIndex = 0;
    let Score = 0;
    let PreviousMatchIndex = -1;

    for (
        let TargetIndex = 0;
        TargetIndex < NormalizedTarget.length && QueryIndex < NormalizedQuery.length;
        TargetIndex += 1
    )
    {
        if (NormalizedTarget[TargetIndex] !== NormalizedQuery[QueryIndex])
        {
            continue;
        }

        const IsContiguous = TargetIndex === PreviousMatchIndex + 1;
        const IsWordStart = TargetIndex === 0 || WordBoundary.test(Target[TargetIndex - 1] ?? "");

        Score += 1 + (IsContiguous ? 2 : 0) + (IsWordStart ? 1 : 0);
        PreviousMatchIndex = TargetIndex;
        QueryIndex += 1;
    }

    return QueryIndex === NormalizedQuery.length ? Score : null;
};

/** Title and subtitle are only searched when they're plain strings, as opposed to other `ReactNode`s. */
const AsSearchableString = (Value: unknown): string | undefined =>
    typeof Value === "string" ? Value : undefined;

/**
 * Fuzzy-search `Controls` (as returned by `UseSettingControls`) by `Id`, title, and subtitle,
 * ranking title matches highest, then subtitle, then `Id`. Returns at most
 * {@link MaxSettingSearchResults} results, best match first. Returns every entry, in
 * registration order, when `Query` is blank.
 */
export const SearchSettingControls = (
    Query: string,
    Controls: Readonly<Record<string, SettingControlEntry>>
): ReadonlyArray<SettingSearchResult> =>
{
    const TrimmedQuery = Query.trim();

    if (TrimmedQuery.length === 0)
    {
        return Object.entries(Controls)
            .slice(0, MaxSettingSearchResults)
            .map(([ Id, Entry ]) => ({ Entry, Id }));
    }

    const Scored: Array<SettingSearchResult & { readonly Score: number }> = [ ];

    for (const [ Id, Entry ] of Object.entries(Controls))
    {
        const TitleScore = FuzzyScore(TrimmedQuery, AsSearchableString(Entry.Title) ?? "");
        const SubtitleScore = FuzzyScore(TrimmedQuery, AsSearchableString(Entry.Subtitle) ?? "");
        const IdScore = FuzzyScore(TrimmedQuery, Id);

        if (TitleScore === null && SubtitleScore === null && IdScore === null)
        {
            continue;
        }

        Scored.push({
            Entry,
            Id,
            Score: (TitleScore ?? 0) * 4 + (SubtitleScore ?? 0) * 2 + (IdScore ?? 0)
        });
    }

    return Scored
        .sort((Left, Right) => Right.Score - Left.Score)
        .slice(0, MaxSettingSearchResults)
        .map(({ Entry, Id }) => ({ Entry, Id }));
};
