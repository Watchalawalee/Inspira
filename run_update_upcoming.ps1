Write-Output "Starting upcoming update..."

& python "run_all_upcoming.py"
& python "rename_json_to_hash.py"
& python "merge.py" --mode=upcoming
& python "upload_to_mongo.py"

Write-Output "Finished updating upcoming."
