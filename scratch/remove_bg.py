from PIL import Image, ImageOps
import os

def smooth_remove_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # Create an alpha channel based on brightness
    grayscale = img.convert("L")
    # Thresholding and smoothing
    # Pixels below 20 brightness are fully transparent
    # Pixels above 50 brightness are fully opaque (in terms of background removal)
    # But wait, the petal itself is light, so we want the dark background to be transparent.
    
    # We can use the grayscale as the alpha mask directly if we adjust it.
    # The background is black (0), petal is white/pink (high value).
    # We can apply a contrast boost to the mask.
    mask = grayscale.point(lambda x: 0 if x < 15 else (255 if x > 60 else int((x-15)/(60-15)*255)))
    
    img.putalpha(mask)
    img.save(output_path, "PNG")
    print(f"Smooth processed {input_path} -> {output_path}")

if __name__ == "__main__":
    input_file = r"c:\Users\Administrator\Desktop\VIBEWEB\image\sakura_petal.png"
    output_file = r"c:\Users\Administrator\Desktop\VIBEWEB\image\sakura_petal_transparent.png"
    smooth_remove_bg(input_file, output_file)
