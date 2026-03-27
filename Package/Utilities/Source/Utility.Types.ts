/* File:      Utility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type TDeepWriteable<Type> = { -readonly [ Key in keyof Type ]: TDeepWriteable<Type[Key]> };
