$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$index = Join-Path $root 'index.html'

$html = [System.IO.File]::ReadAllText($index, [System.Text.Encoding]::UTF8)

$exts = @('css','js','jpg','jpeg','png','gif','webp','svg','ico','woff','woff2','ttf','eot','mp4','webm','json','xml','php')

$paths = [regex]::Matches($html, 'https?://voidacoustics\.com(/[^\s"''\)\\]*)') |
    ForEach-Object { $_.Groups[1].Value } |
    ForEach-Object { ($_ -split '\?')[0] } |
    Sort-Object -Unique

$missing = New-Object System.Collections.Generic.List[string]

foreach ($p in $paths) {
    $ext = [System.IO.Path]::GetExtension($p).TrimStart('.').ToLowerInvariant()
    if ($exts -notcontains $ext) { continue }
    if ($p -match '\{') { continue }
    $rel = $p.TrimStart('/') -replace '/', '\'
    if (-not (Test-Path -LiteralPath (Join-Path $root $rel))) {
        $missing.Add($p)
    }
}

"referenced asset paths : $($paths.Count)"
"missing on disk        : $($missing.Count)"
"present on disk        : $($paths.Count - $missing.Count)"
''
$missing | ForEach-Object { $_ }