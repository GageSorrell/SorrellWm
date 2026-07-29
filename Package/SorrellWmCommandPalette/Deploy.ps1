<#
.SYNOPSIS
Builds SorrellWmCommandPalette and sideloads it for the running Command Palette instance.

.DESCRIPTION
This is the rapid-prototyping loop for the extension: no Visual Studio "Deploy" is required.
It runs a plain build (which, thanks to EnableMsixTooling, also drops a loose AppxManifest.xml
next to the exe) and then registers that loose layout with Add-AppxPackage -Register. This is
the same mechanism Visual Studio's "Deploy" command uses for MSIX apps, and unlike producing a
distributable .msix it needs no signing certificate - only Developer Mode.

Prerequisite (one-time): Developer Mode must be on - Settings > Privacy & security >
For developers > Developer Mode. Without it, registration fails with HRESULT 0x80073CFF.

After this script succeeds, run the "Reload" command (the entry with the subtitle
"Reload Command Palette Extension") inside Command Palette, then find "SorrellWm" at the
bottom of the command list to see the extension's dummy entry.

.PARAMETER Configuration
Build configuration, Debug or Release. Defaults to Debug.

.PARAMETER Platform
Target platform, x64 or ARM64. Defaults to x64.
#>
param(
    [ValidateSet("Debug", "Release")]
    [string]$Configuration = "Debug",

    [ValidateSet("x64", "ARM64")]
    [string]$Platform = "x64"
)

$ErrorActionPreference = "Stop"
$PackageRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectPath = Join-Path $PackageRoot "SorrellWmCommandPalette\SorrellWmCommandPalette.csproj"

Write-Host "Building $Configuration|$Platform..." -ForegroundColor Cyan
dotnet build $ProjectPath -p:Configuration=$Configuration -p:Platform=$Platform

if ($LASTEXITCODE -ne 0)
{
    throw "Build failed."
}

$TargetFramework = (Select-String -Path $ProjectPath -Pattern "<TargetFramework>(.+)</TargetFramework>").Matches[0].Groups[1].Value
$RuntimeIdentifier = "win-$($Platform.ToLowerInvariant())"
$OutputDirectory = Join-Path $PackageRoot "SorrellWmCommandPalette\bin\$Platform\$Configuration\$TargetFramework\$RuntimeIdentifier"
$ManifestPath = Join-Path $OutputDirectory "AppxManifest.xml"

if (!(Test-Path $ManifestPath))
{
    throw "Could not find $ManifestPath. Did the build layout change?"
}

Write-Host "Registering $ManifestPath..." -ForegroundColor Cyan

try
{
    Add-AppxPackage -Register $ManifestPath -ErrorAction Stop
}
catch
{
    if ($_.Exception.Message -like "*0x80073CFF*")
    {
        Write-Host ""
        Write-Host "Sideloading is not enabled on this PC." -ForegroundColor Red
        Write-Host "Turn on Developer Mode: Settings > Privacy & security > For developers > Developer Mode, then re-run this script." -ForegroundColor Red
    }
    throw
}

Write-Host ""
Write-Host "Registered. In Command Palette, run 'Reload' (the entry subtitled 'Reload Command Palette Extension'), then look for 'SorrellWm' at the bottom of the command list." -ForegroundColor Green
