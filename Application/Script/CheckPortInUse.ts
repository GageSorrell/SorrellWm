/* File:      CheckPortInUse.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import chalk from "chalk";
import detectPort from "detect-port";

const Port: string = process.env.PORT || "1212";

detectPort(Port as unknown as number, (_Error: unknown, AvailablePort: number) =>
{
    if (Port !== String(AvailablePort))
    {
        throw new Error(
            chalk.whiteBright.bgRed.bold(
                /* eslint-disable-next-line @stylistic/max-len */
                `Port "${Port}" on "localhost" is already in use. Please use another port. ex: PORT=4343 npm start`,
            )
        );
    }
    else
    {
        process.exit(0);
    }
});
