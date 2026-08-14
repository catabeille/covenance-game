<#
.SYNOPSIS
  Knock the flat background out of the portrait sprites.

.DESCRIPTION
  Flood-fills inward from the image border and makes every connected
  background-coloured pixel transparent.

  Flood fill rather than a global colour swap, deliberately: a sprite with
  white in its eyes, its highlights or the pale of a veil would be punched full
  of holes by "replace every white pixel". Only background actually connected
  to the edge is removed.

  Originals are copied to art-source/portraits-original/ before anything is
  touched, and that copy is never overwritten — so re-running is safe and the
  first version of each sprite is always recoverable.

  Files that already contain transparency are skipped, so this is idempotent
  and can be re-run as new sprites land.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\make-transparent.ps1
  powershell -ExecutionPolicy Bypass -File scripts\make-transparent.ps1 -Tolerance 12
#>
[CmdletBinding()]
param(
  [string] $Folder = "public\portraits",
  [string] $BackupFolder = "art-source\portraits-original",
  # How far from the sampled corner colour still counts as background. Pixel
  # art is usually flat, so this only needs to catch stray near-whites.
  [int] $Tolerance = 8
)

Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root $Folder
$backup = Join-Path $root $BackupFolder

if (-not (Test-Path $src)) { throw "No such folder: $src" }
if (-not (Test-Path $backup)) { New-Item -ItemType Directory -Force $backup | Out-Null }

$files = Get-ChildItem $src -Filter *.png -File
if ($files.Count -eq 0) { Write-Host "No pngs in $src"; return }

# Neighbour offsets held as two parallel arrays. A nested array would be
# flattened by PowerShell's @() operator into a single list of ints.
$dx = @(1, -1, 0, 0)
$dy = @(0, 0, 1, -1)

foreach ($file in $files) {
  $bmp = New-Object System.Drawing.Bitmap($file.FullName)
  $w = $bmp.Width
  $h = $bmp.Height
  $count = $w * $h

  # Pull the whole image into flat arrays once. Repeated GetPixel calls inside
  # a flood fill are slow, and indexing keeps the neighbour maths obvious.
  $r = New-Object 'int[]' $count
  $g = New-Object 'int[]' $count
  $b = New-Object 'int[]' $count
  $a = New-Object 'int[]' $count

  $hasAlpha = $false
  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      $px = $bmp.GetPixel($x, $y)
      $i = $y * $w + $x
      $r[$i] = $px.R; $g[$i] = $px.G; $b[$i] = $px.B; $a[$i] = $px.A
      if ($px.A -lt 255) { $hasAlpha = $true }
    }
  }
  $bmp.Dispose()

  if ($hasAlpha) {
    Write-Host ("{0,-26} already transparent - skipped" -f $file.Name)
    continue
  }

  # Back up once, and never clobber an existing backup.
  $backupPath = Join-Path $backup $file.Name
  if (-not (Test-Path $backupPath)) { Copy-Item $file.FullName $backupPath }

  $bgR = $r[0]; $bgG = $g[0]; $bgB = $b[0]

  $seen = New-Object 'bool[]' $count
  $queue = New-Object System.Collections.Generic.Queue[int]

  # Seed from every border pixel that matches the background.
  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      if ($x -ne 0 -and $y -ne 0 -and $x -ne ($w - 1) -and $y -ne ($h - 1)) { continue }
      $i = $y * $w + $x
      if ($seen[$i]) { continue }
      if ([math]::Abs($r[$i] - $bgR) -le $Tolerance -and
          [math]::Abs($g[$i] - $bgG) -le $Tolerance -and
          [math]::Abs($b[$i] - $bgB) -le $Tolerance) {
        $seen[$i] = $true
        $queue.Enqueue($i)
      }
    }
  }

  $cleared = 0
  while ($queue.Count -gt 0) {
    $i = $queue.Dequeue()
    $a[$i] = 0
    $cleared++

    $x = $i % $w
    $y = [math]::Floor($i / $w)

    for ($k = 0; $k -lt 4; $k++) {
      $nx = $x + $dx[$k]
      $ny = $y + $dy[$k]
      if ($nx -lt 0 -or $ny -lt 0 -or $nx -ge $w -or $ny -ge $h) { continue }
      $ni = $ny * $w + $nx
      if ($seen[$ni]) { continue }
      if ([math]::Abs($r[$ni] - $bgR) -le $Tolerance -and
          [math]::Abs($g[$ni] - $bgG) -le $Tolerance -and
          [math]::Abs($b[$ni] - $bgB) -le $Tolerance) {
        $seen[$ni] = $true
        $queue.Enqueue($ni)
      }
    }
  }

  $out = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      $i = $y * $w + $x
      $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a[$i], $r[$i], $g[$i], $b[$i]))
    }
  }

  $out.Save($file.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
  $out.Dispose()

  $pct = [math]::Round(100 * $cleared / $count, 1)
  Write-Host ("{0,-26} {1}x{2}  cleared {3} px ({4}%)" -f $file.Name, $w, $h, $cleared, $pct)
}

Write-Host ""
Write-Host "Originals kept in $backup"
