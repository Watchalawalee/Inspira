# test_run_all.ps1
Write-Host "🕷️ รัน run_all_upcoming.py"
python run_all_upcoming.py
Start-Sleep -Seconds 5

Write-Host "🔁 รัน merge.py"
python merge.py upcoming
Start-Sleep -Seconds 5

Write-Host "⬆️ รัน upload_to_mongo.py"
python upload_to_mongo.py upcoming
Write-Host "✅ เสร็จสิ้น"
