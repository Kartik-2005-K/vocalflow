# PowerShell script to create a clean distribution zip without node_modules

param(
    [string]$outputZip = "distribution.zip"
)

# Navigate to the directory where the script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Create a temporary directory
$tempDir = Join-Path $scriptDir "temp"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Copy all files except node_modules to the temporary directory
Get-ChildItem -Recurse -Exclude "node_modules" | ForEach-Object {
    if (-not $_.PSIsContainer) {
        Copy-Item $_.FullName -Destination $tempDir -Force
    }
}

# Create a zip file from the temporary directory
Add-Type -AssemblyName "System.IO.Compression.FileSystem"
[IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $outputZip)

# Clean up the temporary directory
Remove-Item -Recurse -Force $tempDir

Write-Host "Distribution zip created: $outputZip"