import sys
from fontTools.ttLib import TTFont

def fix(font_path):
    print(f"Fixing {font_path}")
    try:
        font = TTFont(font_path)
        
        # Delete problematic tables
        for table in ['gasp', 'hdmx', 'LTSH', 'VDMX', 'kern']:
            if table in font:
                del font[table]
                print(f"Deleted {table}")
        
        # Try to fix cmap by recompiling
        if 'cmap' in font:
            cmap = font['cmap']
            
        font.save(font_path + ".fixed.ttf")
        print("Success")
    except Exception as e:
        print(f"Error: {e}")

fix('public/fonts/heritage/TAU-Kaveri-I.ttf')
