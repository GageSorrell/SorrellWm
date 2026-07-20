$ErrorActionPreference = "Stop"

$executablePath = Resolve-Path "$PSScriptRoot\..\Distribution\win-unpacked\SorrellWm.exe"
$logPath = "$PSScriptRoot\..\smoke.log"
$standardErrorPath = "$PSScriptRoot\..\smoke.stderr.log"
$electronRunAsNode = $env:ELECTRON_RUN_AS_NODE
$smokeLog = $env:SORRELL_SMOKE_LOG

try
{
    Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
    Remove-Item $logPath -ErrorAction SilentlyContinue
    Remove-Item $standardErrorPath -ErrorAction SilentlyContinue
    $env:SORRELL_SMOKE_LOG = $logPath

    $applicationProcess = Start-Process `
        -ArgumentList "--smoke-test", "--enable-logging", "--log-file=$logPath" `
        -FilePath $executablePath `
        -PassThru `
        -RedirectStandardError $standardErrorPath `
        -WindowStyle Hidden

    if (-not $applicationProcess.WaitForExit(20000))
    {
        Stop-Process -Id $applicationProcess.Id -Force
        throw "The packaged application smoke test timed out."
    }

    $applicationProcess.WaitForExit()
    $applicationProcess.Refresh()

    $smokeSucceeded = (Test-Path $logPath) -and (Select-String `
        -Path $logPath `
        -Pattern "smoke test passed" `
        -Quiet `
        -SimpleMatch)

    if (-not $smokeSucceeded)
    {
        if (Test-Path $logPath)
        {
            Get-Content $logPath -ErrorAction SilentlyContinue
        }

        if (Test-Path $standardErrorPath)
        {
            Get-Content $standardErrorPath -ErrorAction SilentlyContinue
        }

        throw "The packaged application smoke test did not report success."
    }
}
finally
{
    if ($null -ne $electronRunAsNode)
    {
        $env:ELECTRON_RUN_AS_NODE = $electronRunAsNode
    }

    if ($null -ne $smokeLog)
    {
        $env:SORRELL_SMOKE_LOG = $smokeLog
    }
    else
    {
        Remove-Item Env:SORRELL_SMOKE_LOG -ErrorAction SilentlyContinue
    }
}
