# Manually runs WebAPI application on IIS Express
# coni2k - Created: 03 Jan. '16 - Modified: 18 Nov. '18

$scriptPath = $MyInvocation.MyCommand.Path
$backboneDirectory = (get-item $scriptPath).Directory.Parent.Parent.FullName
$applicationHostPath = Join-Path $backboneDirectory ".vs\config\applicationhost.config"

powershell.exe -windowStyle Hidden "& 'C:\Program Files\IIS Express\iisexpress.exe' /config:$applicationHostPath /site:WebApi /systray:true"
