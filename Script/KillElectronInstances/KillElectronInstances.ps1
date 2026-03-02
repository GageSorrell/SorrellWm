# File:      KillElectronInstances.ps1
# Author:    Gage Sorrell <gage@sorrell.sh>
# Copyright: (c) 2025 Gage Sorrell
# License:   MIT
# Comment:   In the event of orphaned processes
#            during development, kill all processes
#            named `Electron`.

$TargetExecutablePath = "E:\\SorrellWm\\Application\\node_modules\\electron\\dist\\electron.exe"

$ResolvedTargetExecutablePath = [System.IO.Path]::GetFullPath($TargetExecutablePath)

$Processes =
    Get-CimInstance Win32_Process |
    Where-Object {
        $_.ExecutablePath -and
        [string]::Equals(
            [System.IO.Path]::GetFullPath($_.ExecutablePath),
            $ResolvedTargetExecutablePath,
            [System.StringComparison]::OrdinalIgnoreCase
        )
    }

if (-not $Processes)
{
    Write-Host "✔️  No Electron instances were found."
    exit 0
}

foreach ($Process in $Processes)
{
    try
    {
        Stop-Process -Id $Process.ProcessId -Force -ErrorAction Stop
        Write-Host "✔️  Killed Electron instance with PID $($Process.ProcessId)."
    }
    catch
    {
        Write-Warning "❌  Failed to kill Electron instance with PID $($Process.ProcessId)."
    }
}
