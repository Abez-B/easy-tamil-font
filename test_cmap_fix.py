import sys
from fontTools.ttLib import TTFont

def fix(font_path):
    print(f"Fixing {font_path}")
    font = TTFont(font_path)
    
    if 'cmap' in font:
        # Force parsing of cmap subtables
        for table in font['cmap'].tables:
            pass
            
    font.save(font_path + ".fixed.ttf")
    print("Success")

fix('public/fonts/heritage/TAU-Kaveri-I.ttf')
