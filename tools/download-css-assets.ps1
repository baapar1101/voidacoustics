$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'

$root = Split-Path -Parent $PSScriptRoot
$site = 'https://voidacoustics.com'
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

$css = Get-ChildItem -Path $root -Recurse -Include *.css -File |
    Where-Object { $_.FullName -notmatch '\\tools\\' }

$ok = 0; $skip = 0; $fail = @()

foreach ($f in $css) {
    $dir = $f.DirectoryName
    $txt = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)

    $refs = [regex]::Matches($txt, 'url\(\s*[''"]?([^)''"]+)[''"]?\s*\)') |
        ForEach-Object { $_.Groups[1].Value.Trim() } | Sort-Object -Unique

    foreach ($u in $refs) {
        if ($u -match '^(https?:)?//' -or $u -match '^data:' -or $u -match '^#') { continue }
        $bare = ($u -split '\?')[0]
        if ([string]::IsNullOrWhiteSpace($bare)) { continue }

        $dest = Join-Path $dir ($bare -replace '/', '\')
        if (Test-Path -LiteralPath $dest) { $skip++; continue }

        # absolute site path = css file's dir relative to root, plus the ref
        $relToRoot = $dir.Substring($root.Length).TrimStart('\') -replace '\\', '/'
        $absPath = "/$relToRoot/$bare"

        try {
            $parent = Split-Path -Parent $dest
            if (-not (Test-Path -LiteralPath $parent)) {
                New-Item -ItemType Directory -Path $parent -Force | Out-Null
            }
            Invoke-WebRequest -Uri "$site$absPath" -OutFile $dest -UserAgent $ua -TimeoutSec 45
            $sz = (Get-Item -LiteralPath $dest).Length
            if ($sz -eq 0) { Remove-Item -LiteralPath $dest -Force; throw 'empty' }
            $ok++
            Write-Host ("OK   {0,8} bytes  {1}" -f $sz, $absPath)
        } catch {
            $code = $null
            try { $code = $_.Exception.Response.StatusCode.value__ } catch {}
            $fail += "$absPath  [HTTP $code]"
            Write-Host ("FAIL {0}  [HTTP {1}]" -f $absPath, $code)
        }
    }
}

''
"=== downloaded: $ok | already present: $skip | failed: $($fail.Count) ==="
$fail | ForEach-Object { $_ }