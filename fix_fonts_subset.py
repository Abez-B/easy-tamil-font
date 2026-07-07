import glob
import subprocess
import os

font_files = glob.glob('public/fonts/**/*.ttf', recursive=True) + glob.glob('public/fonts/**/*.TTF', recursive=True)
for font in font_files:
    print(f"Sanitizing {font}...")
    temp_font = font + ".tmp"
    # Run pyftsubset to rebuild the font with all glyphs but fully sanitized tables
    result = subprocess.run([
        '.venv/bin/pyftsubset',
        font,
        f'--output-file={temp_font}',
        '--unicodes=*',
        '--name-IDs=*',
        '--layout-features=*',
        '--notdef-outline',
        '--no-hinting',
        '--desubroutinize'
    ], capture_output=True)
    
    if result.returncode == 0 and os.path.exists(temp_font):
        os.rename(temp_font, font)
    else:
        print(f"Failed to sanitize {font}: {result.stderr.decode('utf-8', errors='ignore')}")
        if os.path.exists(temp_font):
            os.remove(temp_font)
