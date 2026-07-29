/**
 * Namespaces `Setting`/`SettingGroup` `Id`s to the settings-window section they belong to,
 * so a search result's `Id` alone is enough to navigate to and then jump within that section.
 *
 * @module @sorrell/wm/Renderer/SettingControlId
 *
 * @file      SettingControlId.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { IsSettingsSectionId, SettingsSectionId } from "../Shared/SettingsPath.js";

const Separator = "/" as const;

/** A parsed {@link MakeSettingControlId} identifier. */
export interface ParsedSettingControlId
{
    readonly LocalId: string;
    readonly Section: SettingsSectionId;
}

export/** Build a `Setting`/`SettingGroup` `Id`, namespaced to the section it belongs to. */
const MakeSettingControlId = (Section: SettingsSectionId, LocalId: string): string =>
    `${ Section }${ Separator }${ LocalId }`;

export/** Recover the section and local id from an `Id` built by {@link MakeSettingControlId}. */
const ParseSettingControlId = (Id: string): ParsedSettingControlId | null =>
{
    const SeparatorIndex = Id.indexOf(Separator);

    if (SeparatorIndex === -1)
    {
        return null;
    }

    const Section = Id.slice(0, SeparatorIndex);
    const LocalId = Id.slice(SeparatorIndex + 1);

    return IsSettingsSectionId(Section) ? { LocalId, Section } : null;
};
