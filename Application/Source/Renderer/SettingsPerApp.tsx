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
    MessageBar,
    MessageBarActions,
    MessageBarBody,
    MessageBarTitle,
    Option,
    type OptionOnSelectData,
    type SelectionEvents,
    type SwitchOnChangeData,
    Text,
    Tooltip,
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
    type PerAppSettingsApplicationDto,
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
        height: "1.25rem",
        objectFit: "contain",
        width: "1.25rem"
    },
    ApplicationIdentity:
    {
        alignItems: "center",
        display: "inline-flex",
        gap: tokens.spacingHorizontalM,
        minWidth: 0
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
    RecentIdentity:
    {
        alignItems: "center",
        display: "flex",
        gap: tokens.spacingHorizontalM,
        minWidth: 0
    },
    RecentItem:
    {
        alignItems: "center",
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusLarge,
        display: "flex",
        gap: tokens.spacingHorizontalM,
        justifyContent: "space-between",
        padding: tokens.spacingVerticalM
    },
    RecentList:
    {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalXS,
        listStyle: "none",
        margin: 0,
        padding: 0
    },
    RecentSection:
    {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalS
    },
    Toolbar:
    {
        display: "flex",
        justifyContent: "flex-end",
        width: "100%"
    }
});

interface SettingsPerAppProps
{
    readonly TargetApplicationName?: string | undefined;
    readonly TargetExecutablePath?: string | undefined;
}

const SortEntries = (
    Entries: ReadonlyArray<PerAppSettingsEntryDto>
): ReadonlyArray<PerAppSettingsEntryDto> => Array.from(Entries).sort((
    Left: PerAppSettingsEntryDto,
    Right: PerAppSettingsEntryDto
) => Left.FriendlyName.localeCompare(Right.FriendlyName));

export/** Render executable selection and per-application behavior controls. */
const SettingsPerApp = ({
    TargetApplicationName,
    TargetExecutablePath
}: SettingsPerAppProps): React.JSX.Element =>
{
    const Styles = UseStyles();
    const [ Entries, SetEntries ] = useState<
        ReadonlyArray<PerAppSettingsEntryDto> | null
    >(null);
    const [ RecentApplications, SetRecentApplications ] = useState<
        ReadonlyArray<PerAppSettingsApplicationDto> | null
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
        window.sorrell.perAppSettings.getRecent()
            .then((Loaded: ReadonlyArray<PerAppSettingsApplicationDto>) =>
            {
                if (!IsCancelled)
                {
                    SetRecentApplications(Loaded.slice(0, 5));
                }
            })
            .catch(Logging.ReportRejection(
                "Settings",
                "Could not load recent applications."
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

    const AddApplication = (ExecutablePath?: string): void =>
    {
        SetIsAdding(true);
        window.sorrell.perAppSettings.add(ExecutablePath)
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
                SetRecentApplications((
                    Current: ReadonlyArray<PerAppSettingsApplicationDto> | null
                ) => Current?.filter((Application: PerAppSettingsApplicationDto) =>
                    Application.ExecutablePath !== Added.ExecutablePath) ?? null);
            })
            .catch(Logging.ReportRejection(
                "Settings",
                "Could not add per-application settings."
            ))
            .finally(() => SetIsAdding(false));
    };

    const ConfiguredPaths = new Set(
        (Entries ?? [ ]).map((Entry: PerAppSettingsEntryDto) =>
            Entry.ExecutablePath.toLowerCase())
    );
    const VisibleRecentApplications = (RecentApplications ?? [ ])
        .filter((Application: PerAppSettingsApplicationDto) =>
            !ConfiguredPaths.has(Application.ExecutablePath.toLowerCase()))
        .slice(0, 5);
    const ShowTargetMessage = Entries !== null
        && TargetExecutablePath !== undefined
        && !ConfiguredPaths.has(TargetExecutablePath.toLowerCase());

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
            { ShowTargetMessage && (
                <MessageBar intent="info">
                    <MessageBarBody>
                        <MessageBarTitle>
                            Per-app settings have not been created
                        </MessageBarTitle>
                        { TargetApplicationName === undefined
                            ? "The focused application is using the default window behavior."
                            : `${ TargetApplicationName } is using the default window behavior.` }
                    </MessageBarBody>
                    <MessageBarActions>
                        <Button
                            disabled={ IsAdding }
                            onClick={ () => AddApplication(TargetExecutablePath) }>
                            Add
                        </Button>
                    </MessageBarActions>
                </MessageBar>
            ) }

            <div className={ Styles.Toolbar }>
                <Button
                    disabled={ IsAdding }
                    icon={ <AddRegular /> }
                    onClick={ () => AddApplication() }>
                    Add Application
                </Button>
            </div>

            { VisibleRecentApplications.length > 0 && (
                <section
                    aria-labelledby="recent-applications-title"
                    className={ Styles.RecentSection }>
                    <Text
                        as="h3"
                        id="recent-applications-title"
                        size={ 400 }
                        weight="semibold">
                        Recently opened applications
                    </Text>
                    <ul className={ Styles.RecentList }>
                        { VisibleRecentApplications.map((
                            Application: PerAppSettingsApplicationDto
                        ) => (
                            <li
                                className={ Styles.RecentItem }
                                key={ Application.ExecutablePath }>
                                <span className={ Styles.RecentIdentity }>
                                    { Application.Icon === undefined
                                        ? <AppGenericRegular className={ Styles.ApplicationIcon } />
                                        : (
                                            <img
                                                alt=""
                                                className={ Styles.ApplicationIcon }
                                                src={ `data:image/png;base64,${ Application.Icon }` }
                                            />
                                        ) }
                                    <Text weight="semibold">
                                        { Application.FriendlyName }
                                    </Text>
                                </span>
                                <Button
                                    appearance="subtle"
                                    aria-label={ `Add ${ Application.FriendlyName }` }
                                    disabled={ IsAdding }
                                    icon={ <AddRegular /> }
                                    onClick={ () => AddApplication(
                                        Application.ExecutablePath
                                    ) }>
                                    Add
                                </Button>
                            </li>
                        )) }
                    </ul>
                </section>
            ) }

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
                                size="large">
                                <Tooltip
                                    content={ Entry.ExecutablePath }
                                    relationship="description">
                                    <span className={ Styles.ApplicationIdentity }>
                                        { Entry.Icon === undefined
                                            ? (
                                                <AppGenericRegular
                                                    className={
                                                        Styles.ApplicationIcon
                                                    } />
                                            )
                                            : (
                                                <img
                                                    alt=""
                                                    className={ Styles.ApplicationIcon }
                                                    src={
                                                        "data:image/png;base64,"
                                                        + Entry.Icon
                                                    } />
                                            ) }
                                        <span className={ Styles.HeaderText }>
                                            <Text weight="semibold">
                                                { Entry.FriendlyName }
                                            </Text>
                                        </span>
                                    </span>
                                </Tooltip>
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
                                    }
                                />
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
