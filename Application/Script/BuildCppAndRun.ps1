# File:      CheckNodeEnvironment.js
# Author:    Gage Sorrell <gage@sorrell.sh>
# Copyright: (c) 2025 Gage Sorrell
# License:   MIT

Push-Location "$PSScriptRoot\..\Windows"
npm run build -- -- --disable-linting
Pop-Location

Push-Location "$PSScriptRoot\.."
npm run start
Pop-Location
