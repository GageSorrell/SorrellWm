/* File:      DummyWindows.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import * as Path from "path";
import { BringIntoPanel, GetForest, MakeSizesUniform, Publish } from "#/Tree/Tree";
import type { FDummyConfiguration, FDummyConfigurationSchema, FDummyPanel } from "./DevSettings.Types";
import { type FLogger, type FPanel } from "../../Shared";
import { GetWindowByName, type HWindow } from "@sorrellwm/windows";
import { CreateBrowserWindow } from "#/Window/BrowserWindow";
import { promises as Fs } from "fs";
import { GetDevSettings } from "./DevSettings";
import { GetLogger } from "./Log/Log";
import { RegisterInitializationFunction } from "#/Initialize/Initialize";

const Log: FLogger = GetLogger("DummyWindows");

async function CreateDummyWindows(): Promise<void>
{
    const { CreateDummyWindows } = GetDevSettings();

    if (!CreateDummyWindows.Enabled)
    {
        return;
    }

    const ImportPath: string = Path.resolve(
        "./Configuration/Development/",
        CreateDummyWindows.ConfigurationPath
    );

    const ConfigurationString: string = await Fs.readFile(
        ImportPath,
        { encoding: "utf-8" }
    );

    const { Configurations } = JSON.parse(ConfigurationString) as FDummyConfigurationSchema;

    type FDummyConfigurationNode =
        FDummyConfiguration &
        {
            Depth: number;
            Panel: FPanel;
            ParentPanel: FPanel | undefined;
            Parent:
                | FDummyConfiguration
                | FDummyConfigurationNode
                | undefined;
        };

    type FChildWindowData =
        Partial<Omit<FDummyConfigurationNode, "Depth" | "Index">> &
        Pick<FDummyConfigurationNode, "Depth" | "Index">;

    const GetChildWindowTitle = ({ Depth, Index }: FChildWindowData): string =>
    {
        return `DummyWindow-${ Depth }-${ Index }`;
    };

    const GetChildHandle = ({ Depth, Index }: FChildWindowData): HWindow | undefined =>
    {
        return GetWindowByName(GetChildWindowTitle({ Depth, Index }));
    };

    const AppendConfiguration = (Configuration: FDummyConfiguration): FDummyConfigurationNode =>
    {
        const Root: FDummyConfigurationNode =
        {
            ...Configuration,
            Depth: 0,
            Panel: undefined as unknown as FPanel,
            Parent: undefined,
            ParentPanel: undefined
        };

        const AppendChildren = (ChildConfiguration: FDummyConfiguration | FDummyConfigurationNode): void =>
        {
            if (ChildConfiguration.Panels !== undefined && ChildConfiguration.Panels.length > 0)
            {
                ChildConfiguration.Panels.forEach((ChildPanel: FDummyPanel): void =>
                {
                    if (ChildPanel === undefined)
                    {
                        Log("CHILD PANEL WAS UNDEFINED");
                    }
                    (ChildPanel as FDummyConfigurationNode).Depth =
                        (ChildConfiguration as FDummyConfigurationNode).Depth + 1;
                    (ChildPanel as FDummyConfigurationNode).Parent = ChildConfiguration;
                    (ChildPanel as FDummyConfigurationNode).ParentPanel = undefined;
                    AppendChildren(ChildPanel);
                });
            }
        };

        AppendChildren(Root);

        return Root;
    };

    const SortChildren = (Configuration: FDummyConfigurationNode | FDummyPanel): FDummyConfigurationNode =>
    {
        if (Configuration.Panels !== undefined)
        {
            Configuration.Panels.sort((A: FDummyPanel, B: FDummyConfiguration): number =>
            {
                return A.Index < B.Index
                    ? -1
                    : 1;
            });

            Configuration.Panels.forEach(SortChildren);
        }

        return Configuration as FDummyConfigurationNode;
    };

    const CreateWindow = async ({ Depth, Index }: FDummyConfigurationNode): Promise<void> =>
    {
        const { LoadFrontend } = await CreateBrowserWindow({ title: GetChildWindowTitle({ Depth, Index }) });
        return LoadFrontend();
    };

    const HandleConfiguration = (Configuration: FDummyConfigurationNode): FDummyConfigurationNode =>
    {
        const {
            Depth,
            Direction,
            FloatingWindows = [ ],
            Index,
            NumChildren
            // Parent
        }: FDummyConfigurationNode = Configuration;

        Log("HandleConfiguration Argument:", Configuration);

        const PanelIndices: Array<number> = (Configuration.Panels || [ ]).map((
            { Index }: FDummyPanel
        ): number =>
        {
            return Index;
        });

        if (Configuration.ParentPanel === undefined)
        {
            const OutParentPanel: FPanel | undefined = GetForest()[Index];
            Log("OutParentPanel: ", OutParentPanel);
            Log("Forest: ", GetForest());
            Log("TIME CALLING GET FOREST", new Date().getTime());
            Configuration.ParentPanel = GetForest()[Index];
        }

        if (Configuration.Panel === undefined && Configuration.ParentPanel !== undefined)
        {
            Log("SETTING CONFIGURATION PANEL");
            Configuration.Panel =
            {
                Children: [ ],
                Size: { Height: 100, Width: 100, X: 0, Y: 0 },
                Type: Direction,
                ZOrder: 1
            };

            Configuration.ParentPanel.Children.push(Configuration.Panel);
            // Log("HANDLE CONFIGURATION MAKE SIZES UNIFORM");
            MakeSizesUniform(Configuration.ParentPanel);
            Publish();
        }
        else
        {
            /* eslint-disable-next-line @stylistic/max-len */
            Log(`DID NOT SET CONFIGURATION PANEL,\n\t(Configuration.Panel === undefined) == ${ Configuration.Panel }\n\t(Configuration.ParentPanel !== undefined) == ${ Configuration.ParentPanel !== undefined }`);
        }

        for (let ChildIndex: number = 0; ChildIndex < NumChildren; ChildIndex++)
        {
            const IsChildPanel: boolean = PanelIndices.includes(ChildIndex);
            Log(`ChildIndex == ${ ChildIndex }\tIsChildPanel == ${ IsChildPanel }`);
            if (IsChildPanel)
            {
                const ChildPanel: FDummyConfigurationNode | undefined =
                    (Configuration.Panels as Array<FDummyConfigurationNode> || [ ])[ChildIndex];

                if (ChildPanel !== undefined)
                {
                    ChildPanel.ParentPanel = Configuration.Panel;
                    const OutPanel: FPanel =
                    {
                        Children: [ ],
                        Size: { Height: 100, Width: 100, X: 0, Y: 0 },
                        Type: ChildPanel.Direction,
                        ZOrder: 1
                    };

                    Configuration.Panel.Children[ChildIndex] = OutPanel;
                    Log("MAKE SIZES UNIFORM LINE 184");
                    MakeSizesUniform(Configuration.Panel);
                    Publish();
                }
            }
            else
            {
                const WindowData: FChildWindowData = { Depth: Depth + 1, Index: ChildIndex };
                const Handle: HWindow | undefined = GetChildHandle(WindowData);

                if (Configuration.Panel !== undefined && Handle !== undefined)
                {
                    Log("BRINGING INTO PANEL");
                    BringIntoPanel(Configuration.Panel, Handle);
                    // const Cell: FCell | undefined = BringIntoPanel(Configuration.Panel, Handle);
                    // if (Cell !== undefined)
                    // {
                    //     Configuration.Panel.Children[ChildIndex] = Cell;
                    // }
                }
            }
        }

        if (FloatingWindows.length > 0)
        {
            throw new Error("FloatingWindows.length > 0, but FloatingWindows have not been implemented yet.");
        }

        if (Configuration.Panels !== undefined && Configuration.Panels.length > 0)
        {
            Configuration.Panels =
                (Configuration.Panels as Array<FDummyConfigurationNode>).map(HandleConfiguration);
        }

        return Configuration;
    };

    const Intermediate: Array<FDummyConfigurationNode> =
        Configurations
            .map(AppendConfiguration)
            .map(SortChildren);

    const GetCreateWindowPromise = (Configuration: FDummyConfigurationNode): Promise<void> =>
    {
        return CreateWindow(Configuration);
    };

    await Promise.all(Intermediate.map(GetCreateWindowPromise));
    const Handled: Array<FDummyConfigurationNode> =
        Intermediate.map(HandleConfiguration) as Array<FDummyConfigurationNode>;

    Log(Handled);

    Log("VERY END");
    MakeSizesUniform(Handled[0]?.Panel as FPanel);
    await Publish();
}

RegisterInitializationFunction("DummyWindows", CreateDummyWindows, [ "Tree" ]);
