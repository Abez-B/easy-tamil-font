import os
import glob
from fontTools.ttLib import TTFont

def fix_fonts():
    font_files = glob.glob('public/fonts/**/*.ttf', recursive=True) + glob.glob('public/fonts/**/*.TTF', recursive=True)
    for font_path in font_files:
        try:
            print(f"Fixing {font_path}...")
            font = TTFont(font_path)
            
            # Delete problematic tables that often cause OTS errors
            for table in ['gasp', 'hdmx', 'LTSH', 'VDMX', 'kern']:
                if table in font:
                    del font[table]
                    
            # Try to fix cmap by forcing recompile, just touching it might help
            if 'cmap' in font:
                for table in font['cmap'].tables:
                    pass

            # Save it back to itself, fonttools will recompile and fix metadata
            font.save(font_path)
        except Exception as e:
            print(f"Error processing {font_path}: {e}")

if __name__ == '__main__':
    fix_fonts()
