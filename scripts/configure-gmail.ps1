$ErrorActionPreference = 'Stop'
$taskManagementToken = [Environment]::GetEnvironmentVariable('SUPABASE_ACCESS_TOKEN', 'User')
if (-not $taskManagementToken) { $taskManagementToken = $env:SUPABASE_ACCESS_TOKEN }
if (-not $taskManagementToken) { throw 'Supabase access token is missing.' }
Write-Host 'Use a Google app password created for yummyfitsupport@gmail.com.'
Write-Host 'This prompt hides your input. Do not enter your normal Gmail password.'
$taskGmailPassword = (Read-Host 'Paste the 16-character Google app password' -MaskInput) -replace '\s', ''
if ($taskGmailPassword -notmatch '^[a-zA-Z0-9]{16}$') {
  $taskGmailPassword = $null
  throw 'Nothing was saved. Copy only the 16-character app password shown by Google.'
}
try {
  $taskSecretBody = ConvertTo-Json -InputObject @(@{ name = 'GMAIL_APP_PASSWORD'; value = $taskGmailPassword }) -Compress
  Invoke-RestMethod -Method Post -Uri 'https://api.supabase.com/v1/projects/nzhjnzovbxznzadtbzgm/secrets' -Headers @{ Authorization = ('Bearer ' + $taskManagementToken) } -ContentType 'application/json' -Body $taskSecretBody | Out-Null
  Write-Host 'GMAIL_APP_PASSWORD saved to the YummyFitWeb project. Reply ready for the delivery test.'
} catch {
  Write-Error 'Supabase did not save the secret. Check that the access token is valid and try again.'
} finally {
  $taskGmailPassword = $null
  $taskSecretBody = $null
  $taskManagementToken = $null
}
