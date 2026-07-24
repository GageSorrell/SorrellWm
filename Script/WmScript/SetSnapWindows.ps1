[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("On", "Off")]
    [string] $State
)

$ErrorActionPreference = "Stop"

if ($env:OS -ne "Windows_NT")
{
    throw "The Snap windows setting is only available on Windows."
}

if ($null -eq ("Sorrell.Wm.Script.NativeMethods" -as [type]))
{
    Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

namespace Sorrell.Wm.Script
{
    public static class NativeMethods
    {
        [DllImport(
            "user32.dll",
            CharSet = CharSet.Unicode,
            EntryPoint = "SystemParametersInfoW",
            SetLastError = true
        )]
        [return: MarshalAs(UnmanagedType.Bool)]
        public static extern bool GetSystemParameter(
            uint action,
            uint parameter,
            [MarshalAs(UnmanagedType.Bool)] out bool value,
            uint updateFlags
        );

        [DllImport(
            "user32.dll",
            CharSet = CharSet.Unicode,
            EntryPoint = "SystemParametersInfoW",
            SetLastError = true
        )]
        [return: MarshalAs(UnmanagedType.Bool)]
        public static extern bool SetSystemParameter(
            uint action,
            uint parameter,
            IntPtr value,
            uint updateFlags
        );
    }
}
"@
}

$SpiGetWindowArranging = [uint32] 0x0082
$SpiSetWindowArranging = [uint32] 0x0083
$SpifUpdateIniFile = [uint32] 0x0001
$SpifSendChange = [uint32] 0x0002
$Enabled = $State -eq "On"
$Description = if ($Enabled)
{
    "Enable the current user's Windows Snap windows setting"
}
else
{
    "Disable the current user's Windows Snap windows setting"
}

if (-not $PSCmdlet.ShouldProcess("Windows user preferences", $Description))
{
    return
}

# Windows builds differ on whether this setting reads the Boolean from uiParam
# or pvParam, so supply the same value through both parameters.
$NativeParameter = if ($Enabled) { [uint32] 1 } else { [uint32] 0 }
$NativeValue = if ($Enabled) { [IntPtr]::new(1) } else { [IntPtr]::Zero }
$UpdateFlags = $SpifUpdateIniFile -bor $SpifSendChange
$WasSet = [Sorrell.Wm.Script.NativeMethods]::SetSystemParameter(
    $SpiSetWindowArranging,
    $NativeParameter,
    $NativeValue,
    $UpdateFlags
)

if (-not $WasSet)
{
    $ErrorCode = [Runtime.InteropServices.Marshal]::GetLastWin32Error()
    throw [ComponentModel.Win32Exception]::new(
        $ErrorCode,
        "Windows rejected the Snap windows setting change."
    )
}

$CurrentValue = $false
$WasRead = [Sorrell.Wm.Script.NativeMethods]::GetSystemParameter(
    $SpiGetWindowArranging,
    0,
    [ref] $CurrentValue,
    0
)

if (-not $WasRead)
{
    $ErrorCode = [Runtime.InteropServices.Marshal]::GetLastWin32Error()
    throw [ComponentModel.Win32Exception]::new(
        $ErrorCode,
        "Windows could not verify the Snap windows setting."
    )
}

if ($CurrentValue -ne $Enabled)
{
    throw "Windows did not retain the requested Snap windows setting."
}

$Result = if ($Enabled) { "enabled" } else { "disabled" }
Write-Output "Windows Snap windows is $Result."
