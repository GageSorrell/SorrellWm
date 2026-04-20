/**
 * @file      Routes.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import { MemoryRouter, Route, Routes as RouterRoutes } from "react-router-dom";
import { Activation } from "@/Domain/Activation";
import { Direction } from "@/Domain/Insert/Screen/Direction";
import { Focus } from "@/Domain/Focus";
import { Insert } from "@/Domain/Insert";
import { IpcNavigator } from "./IpcNavigator";
import { Move } from "@/Domain/Move";
import { Resize } from "@/Domain/Resize";
import { Select } from "@/Domain/Insert/Screen/Select";
import { Settings } from "@/Domain/Settings";
import { TestWindow } from "@/Domain/Development/TestWindow";
import { Tile } from "@/Domain/Tile";

export const Routes = () =>
{
    return (
        <MemoryRouter>
            <IpcNavigator/>
            <RouterRoutes>
                <Route
                    element={ <Activation /> }
                    path="/"
                />
                <Route
                    element={ <Focus /> }
                    path="/Focus"
                />
                <Route
                    element={ <Insert /> }
                    path="/Insert"
                />
                <Route
                    element={ <Direction /> }
                    path="/Insert/Direction"
                />
                <Route
                    element={ <Select /> }
                    path="/Insert/Direction/Select"
                />
                <Route
                    element={ <Move /> }
                    path="/Move"
                />
                <Route
                    element={ <Resize /> }
                    path="/Resize"
                />
                <Route
                    element={ <TestWindow /> }
                    path="/TestWindow"
                />
                <Route
                    element={ <Tile /> }
                    path="/Tile"
                />
                <Route
                    element={ <Settings /> }
                    path="/Settings"
                />
            </RouterRoutes>
        </MemoryRouter>
    );
};
