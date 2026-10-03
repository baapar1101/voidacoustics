$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$root = Split-Path -Parent $PSScriptRoot
$index = Join-Path $root 'index.html'

$html = [System.IO.File]::ReadAllText($index, [System.Text.Encoding]::UTF8)

$exts = @('css','js','jpg','jpeg','png','gif','webp','svg','ico','woff','woff2','ttf','eot','mp4','webm','json')

# full URLs (keep query), unique
$full = [regex]::Matches($html, 'https?://voidacoustics\.com(/[^\s"''\)\\]*)') |
    ForEach-Object { $_.Groups[1].Value } |
    Sort-Object -Unique

$skip = @('/wp-admin/admin-ajax.php','/xmlrpc.php')

$targets = New-Object System.Collections.Generic.List[object]
foreach ($u in $full) {
    $bare = ($u -split '\?')[0]
    $ext = [System.IO.Path]::GetExtension($bare).TrimStart('.').ToLowerInvariant()
    if ($exts -notcontains $ext) { continue }
    if ($bare -match '\{') { continue }
    if ($skip -contains $bare) { continue }
    # decoded relative path for writing to disk
    $rel = [System.Uri]::UnescapeDataString($bare).TrimStart('/') -replace '/', '\'
    $targets.Add([pscustomobject]@{ Url = "https://voidacoustics.com$u"; Rel = $rel })
}

$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
$ok = 0; $skipExist = 0; $fail = New-Object System.Collections.Generic.List[string]

foreach ($t in $targets) {
    $dest = Join-Path $root $t.Rel
    if (Test-Path -LiteralPath $dest) { $skipExist++; continue }
    $dir = Split-Path -Parent $dest
    if (-not (Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    try {
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        Invoke-WebRequest -Uri $t.Url -OutFile $dest -UserAgent $ua -TimeoutSec 45 -MaximumRedirection 5
        $sw.Stop()
        $sz = (Get-Item -LiteralPath $dest).Length
        if ($sz -eq 0) { throw 'empty response' }
        $ok++
        Write-Host ("OK   {0,9} bytes  {1,5}ms  {2}" -f $sz, $sw.ElapsedMilliseconds, $t.Rel)
    } catch {
        $fail.Add("$($t.Rel)  ::  $($_.Exception.Message)")
        Write-Host ("FAIL {0}  ::  {1}" -f $t.Rel, $_.Exception.Message)
    }
}

''
"=== downloaded: $ok | already present: $skipExist | failed: $($fail.Count) ==="
if ($fail.Count) { ''; 'FAILURES:'; $fail }