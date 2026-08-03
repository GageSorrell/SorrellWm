/**
 * Ink UI component for validation notice.
 *
 * @module @sorrell/ink-ui/ValidationNotice
 *
 * @file      ValidationNotice.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTheme } from "./Theme.tsx";

/** {@inheritDoc ValidationNotice} */
export interface ValidationNoticeProps
{
    readonly Message?: string | null;
}

export/**
       * Displays a validation error when one is present.
       *
       * @category Feedback
       * @since 1.0.0
       */
const ValidationNotice = ({ Message }: ValidationNoticeProps): React.ReactNode | null =>
{
    const Theme = useTheme();

    return Message === undefined || Message === null || Message.length === 0
        ? null
        : <Ink.Text color={ Theme.Error }>⚠ { Message }</Ink.Text>;
};
