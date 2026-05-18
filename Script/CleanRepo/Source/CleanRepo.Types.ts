/**
 * @file      CleanRepo.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FDeleteWithProgressOptions } from "@sorrell/cli-utilities/fs";

export type FNodeGeneratedArtifactKind =
    | "NodeModules"
    | "PackageLock"
    | "TsBuildInfo";

export type FNodeGeneratedArtifactTarget =
    {
        Kind: FNodeGeneratedArtifactKind;
        TargetPath: string;
    };

export type FDeleteNodeGeneratedArtifactsOptions =
    FDeleteWithProgressOptions &
    {
        OnTargetDiscovered?: (Target: FNodeGeneratedArtifactTarget) => void;
        OnTargetsDiscovered?: (Targets: ReadonlyArray<FNodeGeneratedArtifactTarget>) => void;
    };
