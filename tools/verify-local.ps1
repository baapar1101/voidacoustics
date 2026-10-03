$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

$files = Get-ChildItem -Path $root -Recurse -Include *.html,*.css,*.js -File |
    Where-Object { $_.FullName -notmatch '\\tools\\' }

$exts = @('css','js','jpg','jpeg','png','gif','webp','svg','ico','woff','woff2','ttf','eot','mp4','webm')

$missing = New-Object System.Collections.Generic.List[string]
$checked = 0

foreach ($f in $files) {
    $txt = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)

    $refs = [regex]::Matches($txt, '/wp-(?:content|includes|json)/[^\s"''\)\\;>]+') |
        ForEach-Object { $_.Value } | Sort-Object -Unique

    foreach ($r in $refs) {
        $bare = ($r -split '\?')[0]
        $ext = [System.IO.Path]::GetExtension($bare).TrimStart('.').ToLowerInvariant()
        if ($exts -notcontains $ext) { continue }
        if ($bare -match '\{') { continue }
        $checked++
        $rel = [System.Uri]::UnescapeDataString($bare).TrimStart('/') -replace '/', '\'
        if (-not (Test-Path -LiteralPath (Join-Path $root $rel))) {
            $missing.Add("$($f.Name)  ->  $bare")
        }
    }
}

"files scanned : $($files.Count)"
"local assets checked : $checked"
"BROKEN : $($missing.Count)"
$missing | Sort-Object -Unique | ForEach-Object { $_ }