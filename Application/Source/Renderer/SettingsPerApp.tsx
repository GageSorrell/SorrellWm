/**
 * The Settings window's per-application behavior section.
 *
 * @module @sorrell/wm/Renderer/SettingsPerApp
 *
 * @file      SettingsPerApp.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Logging from "./Logging.js";
import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
    Button,
    Caption1,
    Dropdown,
    Option,
    type OptionOnSelectData,
    type SelectionEvents,
    type SwitchOnChangeData,
    Text,
    makeStyles,
    tokens
} from "@fluentui/react-components";
import {
    AddRegular,
    AppGenericRegular
} from "@fluentui/react-icons";
import { type ChangeEvent, useEffect, useState } from "react";
import {
    IsNewWindowBehavior,
    type NewWindowBehavior,
    NewWindowBehaviors,
    type PerAppSettingPatch,
    type PerAppSettingsEntryDto
} from "../Shared/AppSettings.js";
import { SettingOption, SettingToggle } from "@sorrell/settings-ui";

const BehaviorLabel = Object.freeze({
    FloatCenter: "Float in Screen Center",
    FloatCurrent: "Float at Current Window",
    InsertAfterCurrent: "Insert After Current",
    InsertBeforeCurrent: "Insert Before Current",
    RPC: "RPC"
} as const);

const UseStyles = makeStyles({
    Accordion:
    {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalS
    },
    ApplicationIcon:
    {
        flexShrink: 0,
        height: "2rem",
        objectFit: "contain",
        width: "2rem"
    },
    Empty:
    {
        color: tokens.colorNeutralForeground3,
        margin: 0
    },
    HeaderText:
    {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalXXS,
        minWidth: 0
    },
    Item:
    {
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusLarge,
        overflow: "hidden"
    },
    Loading:
    {
        color: tokens.colorNeutralForeground3
    },
    OptionText:
    {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalXXS
    },
    Path:
    {
        color: tokens.colorNeutralForeground3,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    Toolbar:
    {
        display: "flex",
        justifyContent: "flex-end",
        width: "100%"
    }
});

const SortEntries = (
    Entries: ReadonlyArray<PerAppSettingsEntryDto>
): ReadonlyArray<PerAppSettingsEntryDto> => Array.from(Entries).sort((
    Left: PerAppSettingsEntryDto,
    Right: PerAppSettingsEntryDto
) => Left.FriendlyName.localeCompare(Right.FriendlyName));

export/** Render executable selection and per-application behavior controls. */
const SettingsPerApp = (): React.JSX.Element =>
{
    const Styles = UseStyles();
    const [ Entries, SetEntries ] = useState<
        ReadonlyArray<PerAppSettingsEntryDto> | null
    >(null);
    const [ IsAdding, SetIsAdding ] = useState<boolean>(false);

    useEffect(() =>
    {
        let IsCancelled = false;

        window.sorrell.perAppSettings.get()
            .then((Loaded: ReadonlyArray<PerAppSettingsEntryDto>) =>
            {
                if (!IsCancelled)
                {
                    SetEntries(SortEntries(Loaded));
                }
            })
            .catch(Logging.ReportRejection(
                "Settings",
                "Could not load per-application settings."
            ));

        return (): void =>
        {
            IsCancelled = true;
        };
    }, [ ]);

    const ReplaceEntry = (Updated: PerAppSettingsEntryDto): void =>
    {
        SetEntries((Current: ReadonlyArray<PerAppSettingsEntryDto> | null) =>
            Current === null
                ? Current
                : SortEntries(Current.map((Entry: PerAppSettingsEntryDto) =>
                    Entry.ExecutablePath === Updated.ExecutablePath ? Updated : Entry)));
    };

    const AddApplication = (): void =>
    {
        SetIsAdding(true);
        window.sorrell.perAppSettings.add()
            .then((Added: PerAppSettingsEntryDto | null) =>
            {
                if (Added === null)
                {
                    return;
                }

                SetEntries((Current: ReadonlyArray<PerAppSettingsEntryDto> | null) =>
                {
                    if (Current === null)
                    {
                        return [ Added ];
                    }

                    const WithoutDuplicate = Current.filter((
                        Entry: PerAppSettingsEntryDto
                    ) => Entry.ExecutablePath !== Added.ExecutablePath);
                    return SortEntries([ ...WithoutDuplicate, Added ]);
                });
            })
            .catch(Logging.ReportRejection(
                "Settings",
                "Could not add per-application settings."
            ))
            .finally(() => SetIsAdding(false));
    };

    const Commit = (
        Entry: PerAppSettingsEntryDto,
        Patch: PerAppSettingPatch
    ): void =>
    {
        ReplaceEntry({ ...Entry, ...Patch });
        window.sorrell.perAppSettings.set(Entry.ExecutablePath, Patch)
            .then(ReplaceEntry)
            .catch((Cause: unknown) =>
            {
                Logging.Error(
                    "Settings",
                    "Could not update per-application settings.",
                    Cause
                );
                ReplaceEntry(Entry);
            });
    };

    return (
        <>
            <div className={ Styles.Toolbar }>
                <Button
                    disabled={ IsAdding }
                    icon={ <AddRegular /> }
                    onClick={ AddApplication }>
                    Add Application
                </Button>
            </div>

            { Entries === null && (
                <p className={ Styles.Loading }>Loading…</p>
            ) }

            { Entries?.length === 0 && (
                <p className={ Styles.Empty }>
                    Add an application to configure how its windows are managed.
                </p>
            ) }

            { Entries !== null && Entries.length > 0 && (
                <Accordion
                    className={ Styles.Accordion }
                    collapsible
                    multiple>
                    { Entries.map((Entry: PerAppSettingsEntryDto) => (
                        <AccordionItem
                            className={ Styles.Item }
                            key={ Entry.ExecutablePath }
                            value={ Entry.ExecutablePath }>
                            <AccordionHeader
                                expandIconPosition="end"
                                icon={ Entry.Icon === undefined
                                    ? <AppGenericRegular className={ Styles.ApplicationIcon } />
                                    : (
                                        <img
                                            alt=""
                                            className={ Styles.ApplicationIcon }
                                            src={ `data:image/png;base64,${ Entry.Icon }` } />
                                    ) }
                                size="large">
                                <span className={ Styles.HeaderText }>
                                    <Text weight="semibold">{ Entry.FriendlyName }</Text>
                                    <Caption1 className={ Styles.Path }>
                                        { Entry.ExecutablePath }
                                    </Caption1>
                                </span>
                            </AccordionHeader>

                            <AccordionPanel>
                                <SettingOption
                                    Content={
                                        <span className={ Styles.OptionText }>
                                            <Text weight="semibold">New Window Behavior</Text>
                                            <Caption1>
                                                Choose how new windows from this application appear.
                                            </Caption1>
                                        </span>
                                    }
                                    Control={
                                        <Dropdown
                                            aria-label={
                                                `New window behavior for ${ Entry.FriendlyName }`
                                            }
                                            onOptionSelect={ (
                                                _Event: SelectionEvents,
                                                Data: OptionOnSelectData
                                            ) =>
                                            {
                                                if (IsNewWindowBehavior(Data.optionValue))
                                                {
                                                    Commit(Entry, {
                                                        NewWindowBehavior: Data.optionValue
                                                    });
                                                }
                                            } }
                                            selectedOptions={ [ Entry.NewWindowBehavior ] }
                                            value={ BehaviorLabel[Entry.NewWindowBehavior] }>
                                            { NewWindowBehaviors.map((
                                                Behavior: NewWindowBehavior
                                            ) => (
                                                <Option
                                                    key={ Behavior }
                                                    value={ Behavior }>
                                                    { BehaviorLabel[Behavior] }
                                                </Option>
                                            )) }
                                        </Dropdown>
                                    } />

                                <SettingOption
                                    Content={
                                        <span className={ Styles.OptionText }>
                                            <Text weight="semibold">Ignore Modal Windows</Text>
                                            <Caption1>
                                                Do not manage modal windows created by this application.
                                            </Caption1>
                                        </span>
                                    }
                                    Control={
                                        <SettingToggle
                                            AriaLabel={
                                                `Ignore modal windows for ${ Entry.FriendlyName }`
                                            }
                                            Checked={ Entry.IgnoreModal }
                                            OnChange={ (
                                                _Event: ChangeEvent<HTMLInputElement>,
                                                Data: SwitchOnChangeData
                                            ) => Commit(Entry, { IgnoreModal: Data.checked }) } />
                                    } />
                            </AccordionPanel>
                        </AccordionItem>
                    )) }
                </Accordion>
            ) }
        </>
    );
};
