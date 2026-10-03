$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$base = if ($args.Count) { $args[0] } else { 'http://127.0.0.1:5173' }
$root = Split-Path -Parent $PSScriptRoot
$index = Join-Path $root 'index.html'

$html = [System.IO.File]::ReadAllText($index, [System.Text.Encoding]::UTF8)

$exts = @('css','js','jpg','jpeg','png','gif','webp','svg','ico','woff','woff2','ttf','eot','mp4','webm')

# root-relative asset refs from the homepage
$refs = [regex]::Matches($html, '/wp-(?:content|includes|json)/[^\s"''\)\\;>]+') |
    ForEach-Object { ($_.Value -split '\?')[0] } |
    Sort-Object -Unique |
    Where-Object {
        $e = [System.IO.Path]::GetExtension($_).TrimStart('.').ToLowerInvariant()
        $exts -contains $e -and $_ -notmatch '\{'
    }

$ok = 0; $bad = @()

foreach ($r in $refs) {
    $enc = ($r -split '/').ForEach({ [System.Uri]::EscapeDataString($_) }) -join '/'
    try {
        $resp = Invoke-WebRequest -Uri "$base$enc" -UseBasicParsing -TimeoutSec 15 -Method Head
        if ($resp.StatusCode -eq 200) { $ok++ }
        else { $bad += "$($resp.StatusCode)  $r" }
    } catch {
        $code = $null
        try { $code = $_.Exception.Response.StatusCode.value__ } catch { $code = 'ERR' }
        $bad += "$code  $r"
    }
}

"tested against : $base"
"asset refs     : $($refs.Count)"
"HTTP 200       : $ok"
"problems       : $($bad.Count)"
''
$bad | ForEach-Object { $_ }