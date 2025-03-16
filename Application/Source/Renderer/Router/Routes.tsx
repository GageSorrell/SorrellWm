/* File:      Routes.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { MemoryRouter, Route, Routes as RouterRoutes } from "react-router-dom";
import { Activation } from "$/Activation";
import { Focus } from "$/Focus";
import { IpcNavigator } from "./IpcNavigator";
import { Move } from "$/Move";
import { New } from "$/New";
import { Resize } from "@/Domain/Resize/Screen/Resize";
import { TestWindow } from "$/Development/TestWindow";

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
            </RouterRoutes>
        </MemoryRouter>
    );
};
