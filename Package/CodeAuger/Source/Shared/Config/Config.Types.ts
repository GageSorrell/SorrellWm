/**
 * @file      Config.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export type ConfigRecord = Record<string, unknown>;

export type WithCustomOptions<BaseType, OptionsType extends ConfigRecord> =
    [ OptionsType ] extends [ never ]
        ? BaseType
        : (
            BaseType &
            Readonly<{
                Options: OptionsType;
            }>
        );
