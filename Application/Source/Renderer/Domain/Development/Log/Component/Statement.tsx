/* File:      Statement.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Predicate } from "./Predicate";
import type { PStatement } from "./Statement.Types";
import type { CSSProperties, ReactElement } from "react";

export const Statement = ({
    CategoryName,
    LogLevel,
    Content,
    Timestamp,
    ModuleName
}: PStatement): ReactElement =>
{
    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        fontFamily: "Operator Mono SSm Lig, monospace",
        justifyContent: "flex-start"
    };

    const FormatTimestamp = (InTimestamp: number): string =>
    {
        const DateObject: Date = new Date(InTimestamp);

        let Hour: number = DateObject.getHours();
        const Minute: number = DateObject.getMinutes();
        const Second: number = DateObject.getSeconds();
        const Millisecond: number = DateObject.getMilliseconds();

        const Meridian: string = Hour < 12 ? "AM" : "PM";

        Hour = Hour % 12;
        Hour = Hour === 0 ? 12 : Hour;

        const FormattedHour: string = Hour.toString().padStart(2, "0");
        const FormattedMinute: string = Minute.toString().padStart(2, "0");
        const FormattedSecond: string = Second.toString().padStart(2, "0");
        const FormattedMillisecond: string = Millisecond.toString().padStart(3, "0");

        return `${FormattedHour}:${FormattedMinute}:${FormattedSecond}.${FormattedMillisecond} ${Meridian}`;
    };

    return (
        <div style={ RootStyle }>
            <Predicate
                Text={ FormatTimestamp(Timestamp) }
            />
        </div>
    );
};
