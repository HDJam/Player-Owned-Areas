$WorkingDir = "C:\Program Files (x86)\Steam\steamapps\common\Wayward\moddev";
$DestinationDir = "C:\Program Files (x86)\Steam\steamapps\common\Wayward\mods";
$ModFolder = "TestMod5-2023";

Remove-Item "$DestinationDir\$ModFolder" -Recurse;

New-Item -ItemType Directory -Force -Path $DestinationDir;
New-Item -ItemType Directory -Force -Path $DestinationDir\$ModFolder;
New-Item -ItemType Directory -Force -Path $DestinationDir\$ModFolder\out;

Copy-Item "$WorkingDir/$ModFolder/out" -Destination "$DestinationDir\$ModFolder" -Recurse -Force
Copy-Item "$WorkingDir/$ModFolder/mod.json" -Destination "$DestinationDir\$ModFolder" -Force
#Copy-Item "$WorkingDir/$ModFolder/mod.png" -Destination "$DestinationDir\$ModFolder" -Force
Copy-Item "$WorkingDir/$ModFolder/README.md" -Destination "$DestinationDir\$ModFolder" -Force
Copy-Item "$WorkingDir/$ModFolder/lang" -Destination "$DestinationDir\$ModFolder" -Recurse -Force