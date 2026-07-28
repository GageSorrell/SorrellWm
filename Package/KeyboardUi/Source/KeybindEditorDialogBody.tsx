/**
 * The content of a keyboard-shortcut editor dialog. Place this directly inside a Fluent
 * `DialogSurface`, exactly where a `DialogBody` would otherwise go:
 *
 * ```tsx
 * <Dialog open={ Open } onOpenChange={ (_Event, Data) => SetOpen(Data.open) }>
 *     <DialogTrigger disableButtonEnhancement>
 *         <KeybindBadge Keys={ [ "Win", "Ctrl", "T" ] } />
 *     </DialogTrigger>
 *     <DialogSurface>
 *         <KeybindEditorDialogBody
 *             Title="Activation shortcut"
 *             Description="A shortcut should start with Windows key, Ctrl, Alt or Shift."
 *             Keys={ PendingKeys }
 *             OnSave={ Save }
 *             OnReset={ Reset }
 *             OnClear={ Clear } />
 *     </DialogSurface>
 * </Dialog>
 * ```
 *
 * @module @sorrell/keyboard-ui/KeybindEditorDialogBody
 *
 * @file      KeybindEditorDialogBody.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { ArrowCounterclockwiseRegular, DismissRegular } from "@fluentui/react-icons";
import {
    Body1,
    Button,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    MessageBar,
    MessageBarBody,
    makeStyles,
    tokens
} from "@fluentui/react-components";
import { KeyChip } from "./KeyChip.js";
import type { ReactNode } from "react";

const UseStyles = makeStyles({
    Content:
    {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalM
    },
    Description:
    {
        color: tokens.colorNeutralForeground2
    },
    KeyActions:
    {
        display: "flex",
        gap: tokens.spacingHorizontalM,
        justifyContent: "center"
    },
    KeyBox:
    {
        alignItems: "center",
        backgroundColor: tokens.colorNeutralBackground3,
        borderRadius: tokens.borderRadiusLarge,
        display: "flex",
        gap: tokens.spacingHorizontalS,
        justifyContent: "center",
        padding: tokens.spacingVerticalXXL
    }
});

/** Props for {@link KeybindEditorDialogBody}. */
export interface KeybindEditorDialogBodyProps
{
    readonly Description?: ReactNode;

    /** The pending shortcut's keys, in order, as shown in the large key box. */
    readonly Keys: ReadonlyArray<ReactNode>;

    /** Called when the dialog's Cancel button is pressed, in addition to it closing the dialog. */
    readonly OnCancel?: () => void;

    /** Omit to hide the "Clear" action. */
    readonly OnClear?: () => void;

    /** Omit to hide the "Reset" action. */
    readonly OnReset?: () => void;
    readonly OnSave: () => void;
    readonly SaveDisabled?: boolean;
    readonly Title: ReactNode;

    /** A warning banner shown below the key box, e.g. for a shortcut already in use. */
    readonly Warning?: ReactNode;
}

export/** The content of a keyboard-shortcut editor dialog, for use inside a `DialogSurface`. */
const KeybindEditorDialogBody = (
    {
        Description,
        Keys,
        OnCancel,
        OnClear,
        OnReset,
        OnSave,
        SaveDisabled,
        Title,
        Warning
    }: KeybindEditorDialogBodyProps
): React.JSX.Element =>
{
    const Styles = UseStyles();
    const HasKeyActions = OnReset !== undefined || OnClear !== undefined;

    return (
        <DialogBody>
            <DialogTitle>{ Title }</DialogTitle>

            <DialogContent className={ Styles.Content }>
                { Description !== undefined && (
                    <Body1 className={ Styles.Description }>{ Description }</Body1>
                ) }

                <div className={ Styles.KeyBox }>
                    { Keys.map((Key: ReactNode, Index: number) => (
                        <KeyChip Size="large"
                            key={ Index }>{ Key }</KeyChip>
                    )) }
                </div>

                { HasKeyActions && (
                    <div className={ Styles.KeyActions }>
                        { OnReset !== undefined && (
                            <Button
                                appearance="transparent"
                                icon={ <ArrowCounterclockwiseRegular /> }
                                onClick={ OnReset }>
                                Reset
                            </Button>
                        ) }

                        { OnClear !== undefined && (
                            <Button
                                appearance="transparent"
                                icon={ <DismissRegular /> }
                                onClick={ OnClear }>
                                Clear
                            </Button>
                        ) }
                    </div>
                ) }

                { Warning !== undefined && (
                    <MessageBar intent="warning">
                        <MessageBarBody>{ Warning }</MessageBarBody>
                    </MessageBar>
                ) }
            </DialogContent>

            <DialogActions>
                <Button
                    appearance="primary"
                    onClick={ OnSave }
                    { ...(SaveDisabled === undefined ? { } : { disabled: SaveDisabled }) }>
                    Save
                </Button>

                <DialogTrigger disableButtonEnhancement>
                    <Button appearance="secondary"
                        { ...(OnCancel === undefined ? { } : { onClick: OnCancel }) }>
                        Cancel
                    </Button>
                </DialogTrigger>
            </DialogActions>
        </DialogBody>
    );
};
