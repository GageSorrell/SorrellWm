/**
 * @file      Confirm.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type ConfirmProps =
    Readonly<{
        onSubmit: (value: boolean) => void;
        onChange: (newValue: boolean) => void;
        value: boolean;
    }>;
