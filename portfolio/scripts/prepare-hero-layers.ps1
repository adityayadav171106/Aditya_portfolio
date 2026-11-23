Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $repo 'dist\hero_new.png'
$outputDirectory = Join-Path $repo 'public\hero-layers'
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

$extractor = @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public static class HeroLayerExtractor {
    public static void Extract(string sourcePath, string outputPath, int x, int y, int width, int height, PointF[] outline, bool ellipse, bool neutralMatte) {
        using (var source = new Bitmap(sourcePath))
        using (var maskLarge = new Bitmap(width * 4, height * 4, PixelFormat.Format32bppArgb))
        using (var mask = new Bitmap(width, height, PixelFormat.Format32bppArgb))
        using (var output = new Bitmap(width, height, PixelFormat.Format32bppArgb)) {
            using (var maskGraphics = Graphics.FromImage(maskLarge)) {
                maskGraphics.Clear(Color.Transparent);
                maskGraphics.SmoothingMode = SmoothingMode.AntiAlias;
                maskGraphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                maskGraphics.ScaleTransform(4f, 4f);
                if (ellipse) maskGraphics.FillEllipse(Brushes.White, 8, 8, width - 16, height - 16);
                else maskGraphics.FillPolygon(Brushes.White, outline);
            }
            using (var graphics = Graphics.FromImage(mask)) {
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.DrawImage(maskLarge, new Rectangle(0, 0, width, height));
            }
            for (var py = 0; py < height; py++) {
                for (var px = 0; px < width; px++) {
                    var coverage = mask.GetPixel(px, py).A;
                    var original = source.GetPixel(x + px, y + py);
                    if (neutralMatte) {
                        var chroma = Math.Max(original.R, Math.Max(original.G, original.B)) - Math.Min(original.R, Math.Min(original.G, original.B));
                        var neutralCoverage = chroma <= 12 ? 255 : chroma >= 44 ? 0 : (44 - chroma) * 255 / 32;
                        coverage = (byte)(coverage * neutralCoverage / 255);
                    }
                    output.SetPixel(px, py, Color.FromArgb(coverage, original.R, original.G, original.B));
                }
            }
            output.Save(outputPath, ImageFormat.Png);
        }
    }
}
'@

$references = [AppDomain]::CurrentDomain.GetAssemblies() |
    Where-Object { $_.GetName().Name -like 'System.Drawing*' -or $_.GetName().Name -like 'System.Private.Windows.*' } |
    ForEach-Object { $_.Location } | Select-Object -Unique
Add-Type -TypeDefinition $extractor -ReferencedAssemblies $references
$source = [System.Drawing.Image]::FromFile($sourcePath)
try {
    if ($source.Width -ne 2752 -or $source.Height -ne 1536) {
        throw "Expected the current 2752x1536 hero source; found $($source.Width)x$($source.Height). Re-measure the crop coordinates before extracting."
    }
} finally {
    $source.Dispose()
}

$moonPath = Join-Path $outputDirectory 'moon.png'
[HeroLayerExtractor]::Extract($sourcePath, $moonPath, 1627, 428, 334, 334, @(), $true, $false)

$catOutline = @(
    [System.Drawing.PointF]::new(26,168), [System.Drawing.PointF]::new(45,175), [System.Drawing.PointF]::new(75,185),
    [System.Drawing.PointF]::new(100,186), [System.Drawing.PointF]::new(125,182), [System.Drawing.PointF]::new(150,170),
    [System.Drawing.PointF]::new(180,155), [System.Drawing.PointF]::new(210,145), [System.Drawing.PointF]::new(240,135),
    [System.Drawing.PointF]::new(270,125), [System.Drawing.PointF]::new(300,112), [System.Drawing.PointF]::new(330,100),
    [System.Drawing.PointF]::new(360,82), [System.Drawing.PointF]::new(390,65), [System.Drawing.PointF]::new(420,48),
    [System.Drawing.PointF]::new(445,35), [System.Drawing.PointF]::new(473,25),
    [System.Drawing.PointF]::new(478,45), [System.Drawing.PointF]::new(482,70), [System.Drawing.PointF]::new(485,95),
    [System.Drawing.PointF]::new(475,115),
    [System.Drawing.PointF]::new(472,140), [System.Drawing.PointF]::new(478,165), [System.Drawing.PointF]::new(476,200),
    [System.Drawing.PointF]::new(482,240), [System.Drawing.PointF]::new(485,275), [System.Drawing.PointF]::new(484,310),
    [System.Drawing.PointF]::new(482,350), [System.Drawing.PointF]::new(482,390), [System.Drawing.PointF]::new(482,430),
    [System.Drawing.PointF]::new(480,470), [System.Drawing.PointF]::new(478,510), [System.Drawing.PointF]::new(476,550),
    [System.Drawing.PointF]::new(473,590), [System.Drawing.PointF]::new(470,630), [System.Drawing.PointF]::new(466,670),
    [System.Drawing.PointF]::new(460,710), [System.Drawing.PointF]::new(458,745), [System.Drawing.PointF]::new(455,775),
    [System.Drawing.PointF]::new(420,775), [System.Drawing.PointF]::new(400,775), [System.Drawing.PointF]::new(350,775), [System.Drawing.PointF]::new(300,775), [System.Drawing.PointF]::new(250,775),
    [System.Drawing.PointF]::new(210,775), [System.Drawing.PointF]::new(170,775), [System.Drawing.PointF]::new(135,775),
    [System.Drawing.PointF]::new(100,775), [System.Drawing.PointF]::new(60,775), [System.Drawing.PointF]::new(70,760), [System.Drawing.PointF]::new(70,720),
    [System.Drawing.PointF]::new(80,680), [System.Drawing.PointF]::new(90,640), [System.Drawing.PointF]::new(100,600),
    [System.Drawing.PointF]::new(110,550), [System.Drawing.PointF]::new(120,510), [System.Drawing.PointF]::new(125,475),
    [System.Drawing.PointF]::new(120,440), [System.Drawing.PointF]::new(110,400), [System.Drawing.PointF]::new(95,360),
    [System.Drawing.PointF]::new(80,330), [System.Drawing.PointF]::new(65,300), [System.Drawing.PointF]::new(55,275),
    [System.Drawing.PointF]::new(45,245), [System.Drawing.PointF]::new(40,215), [System.Drawing.PointF]::new(32,190)
)
$catPath = Join-Path $outputDirectory 'cat.png'
[HeroLayerExtractor]::Extract($sourcePath, $catPath, 1330, 760, 510, 776, $catOutline, $false, $true)

Write-Output "Prepared $moonPath and $catPath from dist\hero_new.png"
