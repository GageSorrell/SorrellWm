/* File:      Settings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FSettings } from "./Settings.Types";

export const DefaultSettings: FSettings =
{
    AnimationScalar: 1,
    Keybinds:
    {
        Direction:
        {
            /* eslint-disable sort-keys */
            Left: [ [ "D" ] ],
            Up: [ [ "H" ] ],
            Down: [ [ "T" ] ],
            Right: [ [ "T" ] ]
            /* eslint-enable sort-keys */
        },
        Miscellaneous:
        {
            FocusList: [ [ "`" ] ],
            FocusTextInput: [ [ "Tab" ] ],
            Peek: [ [ "Z" ] ],
            Settings: [ [ "+" ] ]
        },
        Primary:
        {
            0: [ [ "F" ] ],
            1: [ [ "G" ] ],
            2: [ [ "T" ] ],
            3: [ [ "R" ] ]
        },
        Secondary:
        {
            0: [ [ "Ctrl", "F" ] ],
            1: [ [ "Ctrl", "G" ] ],
            2: [ [ "Ctrl", "T" ] ],
            3: [ [ "Ctrl", "R" ] ]
        }
    },
    RunOnStartup: false
};
