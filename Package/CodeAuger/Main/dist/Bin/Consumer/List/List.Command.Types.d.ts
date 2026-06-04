/**
 * @file      List.Command.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
export type ConfigStatus = "Enable" | "Disabled" | "Missing";
export type ListRow = Readonly<{
    InUse: boolean;
    Provider: string;
    Status: ConfigStatus;
}>;
//# sourceMappingURL=List.Command.Types.d.ts.map