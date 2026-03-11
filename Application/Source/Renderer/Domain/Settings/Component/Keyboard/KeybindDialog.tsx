/* File:      KeybindDialog.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger } from "@fluentui/react-components";
import type { PKeybindContainer } from "./KeybindDialog.Types";
import type { ReactNode } from "react";

export const KeybindDialog = ({ onOpenChange, open, ..._Rest }: PKeybindContainer): ReactNode =>
{
    return (
        <Dialog
            onOpenChange={ onOpenChange }
            open={ open }>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>
                        Dialog title
                    </DialogTitle>
                    <DialogContent>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
                        exercitationem cumque repellendus eaque est dolor eius expedita
                        nulla ullam? Tenetur reprehenderit aut voluptatum impedit
                        voluptates in natus iure cumque eaque?
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="primary">
                            Do Something
                        </Button>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">
                                Close
                            </Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
