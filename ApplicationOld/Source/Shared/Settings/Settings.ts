/**
 * @file      Settings.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import type { FSettings } from "./Settings.Types";

export/**
       * Some settings regard state that is outside of SorrellWm,
       * for example, for the `RunOnStartup` setting to be honored,
       * a task must be registered via the Task Scheduler.  If this
       * fails, then this external state (*i.e.*, the Task Scheduler)
       * is inconsistent with the value of the setting `RunOnStartup`
       * in SorrellWm.
       */
const ExternalSettings: readonly [ "RunOnStartup" ] = [ "RunOnStartup" ] as const;

export/**
       * The default settings of `SorrellWm`.
       */
const DefaultSettings: FSettings =
    {
        AnimationScalar: 1,
        Gap: 4,
        Keybinds:
        {
            Activate: [ "F20" ],
            Cancel: [ "Backspace" ],
            Direction:
            {
                /* eslint-disable sort-keys */
                Left: [ "D" ],
                Up: [ "H" ],
                Down: [ "T" ],
                Right: [ "N" ]
                /* eslint-enable sort-keys */
            },
            Miscellaneous:
            {
                FocusList: [ "`" ],
                FocusTextInput: [ "Tab" ],
                Peek: [ "Z" ],
                Settings: [ "+" ]
            },
            Primary:
            {
                0: [ "F" ],
                1: [ "G" ],
                2: [ "T" ],
                3: [ "R" ]
            },
            Secondary:
            {
                0: [ "Ctrl", "F" ],
                1: [ "Ctrl", "G" ],
                2: [ "Ctrl", "T" ],
                3: [ "Ctrl", "R" ]
            }
        },
        RunOnStartup: false,
        ShowUpdateNotifications: true
    };
