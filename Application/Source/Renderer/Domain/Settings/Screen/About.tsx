/**
 * @file      About.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import { Body1Strong, Table, TableBody, TableCell, TableRow } from "@fluentui/react-components";
import { type ReactElement, type ReactNode, useMemo } from "react";
import { SettingsScreen } from "./SettingsScreen";
import { UseMainStore } from "@/Store";

export const About = (): ReactElement =>
{

    type FItem =
    {
        Key: string;
        Value: string;
    };

    const [ Store ] = UseMainStore();

    const Items: Array<FItem> = useMemo((): Array<FItem> =>
    {
        return [
            {
                Key: "App Version",
                Value: Store?.AppVersion || ""
            }
        ];
    }, [ Store ]);

    const Row = ({ Key, Value }: FItem): ReactNode =>
    {
        return (
            <TableRow>
                <TableCell>
                    <Body1Strong>
                        { Key }
                    </Body1Strong>
                </TableCell>
                <TableCell>
                    { Value }
                </TableCell>
            </TableRow>
        );
    };

    return (
        <SettingsScreen Title="About">
            <Table style={ { width: "100%" } }>
                <TableBody>
                    {
                        Items.map((Item: FItem, Index: number): ReactNode =>
                        {
                            return (
                                <Row
                                    key={ `${ Item.Key }-${ Index }` }
                                    { ...Item }
                                />
                            );
                        })
                    }
                </TableBody>
            </Table>
        </SettingsScreen>
    );
};
