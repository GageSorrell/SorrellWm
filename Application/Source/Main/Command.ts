/**
 *
 *
 * @module @sorrell/wm/Main/Command
 *
 * @file      Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
    export type Ui = Data.TaggedEnum<{
    }>;

    export/** {@inheritDoc Ui:type} */
    const Ui = Data.taggedEnum<Ui>();

    /**
     * A unit of work that is performed by the window manager.
     */
    export type WM = Data.TaggedEnum<{
        readonly FocusWm: CommandDecl;
        readonly MoveFocus: CommandDecl<{
            readonly Direction: Direction.Cardinal;
        }>;
    }>;

export type Command =
    | Category.Ui
    | Category.WM;

export/** {@inheritDoc Command:type} */
const Command = Data.taggedEnum<Command>();
