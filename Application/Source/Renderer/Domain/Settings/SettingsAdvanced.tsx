/**
 * The Settings window's "Advanced" section: the local MCP (Model Context Protocol)
 * server, which lets AI agents drive window management over a loopback-only HTTP
 * connection.
 *
 * @module @sorrell/wm/Renderer/SettingsAdvanced
 *
 * @file      SettingsAdvanced.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Logging from "../../Logging.js";
import { type ChangeEvent, useEffect, useState } from "react";
import { LinkRegular, NumberSymbolSquareRegular, PlugConnectedRegular } from "@fluentui/react-icons";
import { Setting, SettingGroup, SettingToggle } from "@sorrell/settings-ui";
import {
    SpinButton,
    type SpinButtonChangeEvent,
    type SpinButtonOnChangeData,
    type SwitchOnChangeData,
    Text,
    makeStyles,
    tokens
} from "@fluentui/react-components";
import { MakeSettingControlId } from "./SettingControlId.js";
import type { McpServerSettingsDto } from "../../../Shared/AppSettings.js";
import { SettingsSectionId } from "../../../Shared/SettingsPath.js";

const UseStyles = makeStyles({
    ConnectionUrl:
    {
        fontFamily: "monospace",
        userSelect: "text"
    },
    Loading:
    {
        color: tokens.colorNeutralForeground3
    },
    SpinButton:
    {
        width: "8rem"
    }
});

export/** Render the "Advanced" settings section: the local MCP server. */
const SettingsAdvanced = (): React.JSX.Element =>
{
    const Styles = UseStyles();
    const [ Settings, SetSettings ] = useState<McpServerSettingsDto | null>(null);

    useEffect(() =>
    {
        let IsCancelled = false;

        window.sorrell.mcpServerSettings.get()
            .then((Loaded: McpServerSettingsDto) =>
            {
                if (!IsCancelled)
                {
                    SetSettings(Loaded);
                }
            })
            .catch(Logging.ReportRejection(
                "Settings",
                "Could not load MCP-server settings."
            ));

        return (): void =>
        {
            IsCancelled = true;
        };
    }, [ ]);

    const Commit = (Patch: Partial<McpServerSettingsDto>): void =>
    {
        SetSettings((Current: McpServerSettingsDto | null) =>
            (Current === null ? Current : { ...Current, ...Patch }));

        window.sorrell.mcpServerSettings.set(Patch)
            .then((Updated: McpServerSettingsDto) => SetSettings(Updated))
            .catch(Logging.ReportRejection(
                "Settings",
                "Could not update MCP-server settings."
            ));
    };

    if (Settings === null)
    {
        return <p className={ Styles.Loading }>Loading…</p>;
    }

    return (
        <SettingGroup
            Id={ MakeSettingControlId(SettingsSectionId.Advanced, "McpServer") }
            Subtitle={
                "Let AI agents drive window management over a local, loopback-only "
                + "HTTP connection. There is no additional authentication beyond this "
                + "toggle: anything that can reach the port below has the same control "
                + "as the overlay."
            }
            Title="MCP Server">
            <Setting
                Control={ <SettingToggle
                    AriaLabel="Enable MCP server"
                    Checked={ Settings.Enabled }
                    OnChange={ (
                        _Event: ChangeEvent<HTMLInputElement>,
                        Data: SwitchOnChangeData
                    ) => Commit({ Enabled: Data.checked }) } /> }
                Icon={ PlugConnectedRegular }
                Id={ MakeSettingControlId(SettingsSectionId.Advanced, "McpServerEnabled") }
                Subtitle="Starts or stops the MCP server's HTTP listener immediately."
                Title="Enable MCP Server" />

            <Setting
                Control={ <SpinButton
                    className={ Styles.SpinButton }
                    max={ 65_535 }
                    min={ 1 }
                    onChange={ (
                        _Event: SpinButtonChangeEvent,
                        Data: SpinButtonOnChangeData
                    ) =>
                    {
                        const DisplayValue = Data.displayValue?.trim();
                        const NextValue = Data.value ?? (
                            DisplayValue === undefined || DisplayValue.length === 0
                                ? undefined
                                : Number.parseInt(DisplayValue, 10)
                        );

                        if (
                            NextValue !== undefined
                            && Number.isInteger(NextValue)
                            && NextValue >= 1
                            && NextValue <= 65_535
                        )
                        {
                            Commit({ Port: NextValue });
                        }
                    } }
                    value={ Settings.Port } /> }
                Icon={ NumberSymbolSquareRegular }
                Id={ MakeSettingControlId(SettingsSectionId.Advanced, "McpServerPort") }
                Subtitle="The loopback port the MCP server listens on when enabled."
                Title="Port" />

            <Setting
                Control={
                    <Text className={ Styles.ConnectionUrl }>
                        { `http://127.0.0.1:${ Settings.Port }/mcp` }
                    </Text>
                }
                Icon={ LinkRegular }
                Subtitle="Give this URL to an MCP client's server configuration."
                Title="Connection URL" />
        </SettingGroup>
    );
};
