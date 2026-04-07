<#
.SYNOPSIS
Builds a ZIP archive of the current codebase excluding node_modules.
#>

$SourceFolder = $PSScriptRoot
$ZipFile = Join-Path -Path $PSScriptRoot -ChildPath "..\VocalFlow-Windows-Release.zip"

if (Test-Path $ZipFile) {
    Remove-Item $ZipFile -Force
}

# Recursively get files, excluding node_modules, .git, and existing zips
$FilesToZip = Get-ChildItem -Path $SourceFolder -Recurse | Where-Object {
    $_.FullName -notmatch '\\node_modules\\' -and
    $_.FullName -notmatch '\\\.git\\' -and
    $_.Name -ne "VocalFlow-Windows-Release.zip"
}

# We will copy these to a temporary directory since Compress-Archive expects a specific structure
$TempDir = Join-Path -Path $env:TEMP -ChildPath "VocalFlow-Windows"
if (Test-Path $TempDir) {
    Remove-Item $TempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $TempDir | Out-Null

Copy-Item -Path $SourceFolder\* -Destination $TempDir -Recurse -Exclude "node_modules", ".git", "*.zip"

Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipFile -Force

Remove-Item $TempDir -Recurse -Force

Write-Host "Project zipped successfully to $($ZipFile) (without node_modules)"
