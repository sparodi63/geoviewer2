# Read the contents of each file and remove empty lines
$jList = Get-Content "j:\geoapps\viewer\pages\apps\list.txt" | Where-Object { $_ -match '\S' }
$lList = Get-Content "l:\geoapps\viewer\pages\apps\list.txt" | Where-Object { $_ -match '\S' }
$hList = Get-Content "h:\webapps\geoservices\apps\viewer\pages\apps\list.txt" | Where-Object { $_ -match '\S' }

# Compare L vs J
$LnotInJ = $lList | Where-Object { $_ -notin $jList }
Write-Host "`nDirectories in L that are not in J:" -ForegroundColor Yellow
if ($LnotInJ) {
    $LnotInJ | ForEach-Object { Write-Host "- $_" -ForegroundColor Green }
} else {
    Write-Host "None found" -ForegroundColor Gray
}

# Compare H vs J
$HnotInJ = $hList | Where-Object { $_ -notin $jList }
Write-Host "`nDirectories in H that are not in J:" -ForegroundColor Yellow
if ($HnotInJ) {
    $HnotInJ | ForEach-Object { Write-Host "- $_" -ForegroundColor Green }
} else {
    Write-Host "None found" -ForegroundColor Gray
}

# Compare J vs L
$JnotInL = $jList | Where-Object { $_ -notin $lList }
Write-Host "`nDirectories in J that are not in L:" -ForegroundColor Yellow
if ($JnotInL) {
    $JnotInL | ForEach-Object { Write-Host "- $_" -ForegroundColor Green }
} else {
    Write-Host "None found" -ForegroundColor Gray
}

# Show counts for verification
Write-Host "`nCounts:" -ForegroundColor Cyan
Write-Host "J list: $($jList.Count) directories" -ForegroundColor White
Write-Host "L list: $($lList.Count) directories" -ForegroundColor White
Write-Host "H list: $($hList.Count) directories" -ForegroundColor White