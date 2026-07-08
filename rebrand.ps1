$projectRoot = "c:\Users\AOJunior\Documents\Kaline-V27\src"

function Replace-InFile {
    param([string]$FilePath)
    $content = Get-Content $FilePath -Raw
    $original = $content
    
    $content = $content -replace "Kaline", "Klio"
    $content = $content -replace "kaline", "klio"
    $content = $content -replace "KALINE", "KLIO"
    $content = $content -replace "K∧LINE", "KLIO"
    
    if ($content -cne $original) {
        Set-Content -Path $FilePath -Value $content -NoNewline
        Write-Host "Updated: $FilePath"
    }
}

$files = Get-ChildItem -Path $projectRoot -Recurse -File | Where-Object { 
    $_.Extension -in ".ts", ".tsx", ".css", ".json" 
}

foreach ($file in $files) {
    Replace-InFile -FilePath $file.FullName
}

# Rename directories
$kalineApiDir = Join-Path $projectRoot "lib\kaline-api"
$klioApiDir = Join-Path $projectRoot "lib\klio-api"

if (Test-Path $kalineApiDir) {
    Rename-Item -Path $kalineApiDir -NewName "klio-api"
    Write-Host "Renamed directory: kaline-api -> klio-api"
}

# Rename files
$filesToRename = Get-ChildItem -Path $projectRoot -Recurse -File | Where-Object { 
    $_.Name -match "Kaline|kaline"
}

foreach ($file in $filesToRename) {
    $newName = $file.Name -replace "Kaline", "Klio"
    $newName = $newName -replace "kaline", "klio"
    
    Rename-Item -Path $file.FullName -NewName $newName
    Write-Host "Renamed file: $($file.Name) -> $newName"
}

Write-Host "Done!"
