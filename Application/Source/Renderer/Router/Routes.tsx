/* File:      Routes.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { MemoryRouter, Route, Routes as RouterRoutes } from "react-router-dom";
import { Activation } from "$/Activation";
import { Focus } from "$/Focus";
import { IpcNavigator } from "./IpcNavigator";
import { Move } from "$/Move";
import { New } from "$/New";
import { Resize } from "$/Resize";
import { Settings } from "$/Settings";
import { TestWindow } from "$/Development/TestWindow";
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
                    element={ <New /> }
                    path="/New"
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
