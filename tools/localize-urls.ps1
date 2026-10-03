$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$index = Join-Path $root 'index.html'

$html = [System.IO.File]::ReadAllText($index, [System.Text.Encoding]::UTF8)

# Only rewrite ASSET urls (static extensions) to root-relative local paths.
# Page/nav links stay pointing at the live site.
$exts = @('css','js','jpg','jpeg','png','gif','webp','svg','ico','woff','woff2','ttf','eot','mp4','webm','json','json5')

$changed = 0
$pattern = 'https?://voidacoustics\.com(/[^\s"''\)\\]*)'

$out = [regex]::Replace($html, $pattern, {
    param($m)
    $full = $m.Groups[1].Value
    $bare = ($full -split '\?')[0]
    $ext = [System.IO.Path]::GetExtension($bare).TrimStart('.').ToLowerInvariant()
    if ($exts -notcontains $ext) { return $m.Value }
    if ($bare -match '\{') { return $m.Value }
    if ($bare -eq '/xmlrpc.php' -or $bare -eq '/wp-admin/admin-ajax.php') { return $m.Value }
    $script:changed++
    $full   # keep path + query string
})

[System.IO.File]::WriteAllText($index, $out, (New-Object System.Text.UTF8Encoding($false)))

"rewrote $changed asset urls to root-relative local paths"
"remaining absolute voidacoustics.com refs: " + ([regex]::Matches($out, 'https?://voidacoustics\.com')).Count