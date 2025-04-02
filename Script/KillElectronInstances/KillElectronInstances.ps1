# File:      KillElectronInstances.ps1
# Author:    Gage Sorrell <gage@sorrell.sh>
# Copyright: (c) 2025 Gage Sorrell
# License:   MIT
# Comment:   In the event of orphaned processes
#            during development, kill all processes
#            named `Electron`.

Get-Process -Name "Electron" -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.Id -Force
}
