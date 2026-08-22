import os
from PIL import Image

image_path = "/Users/rohitpal/.gemini/antigravity-ide/brain/f6728564-7a69-49e8-a2c3-041a55b0423b/.user_uploaded/media_1787030591365.png"
out_dir = "/Users/rohitpal/Developer/Projects/Tap/TAPA/public/images"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(image_path)
width, height = img.size
print(f"Loaded image: {width}x{height}")

# Grayscale pixels for analysis
gray_img = img.convert("L")
pixels = gray_img.load()

# Fallback/approximate centers
approx_centers = [
    ("preparation", 160, 75),
    ("sankalp", 285, 75),
    ("abhishek", 410, 75),
    ("japa_dhyan", 535, 75),
    ("vrat_katha", 660, 75),
    ("evening_puja", 830, 75)
]

size = 72
search_size = 110 # search window size to find the center

for name, approx_cx, approx_cy in approx_centers:
    # Crop a larger search window
    left = max(0, approx_cx - search_size // 2)
    top = max(0, approx_cy - search_size // 2)
    right = min(width, approx_cx + search_size // 2)
    bottom = min(height, approx_cy + search_size // 2)
    
    # Analyze the search window to find the center of the circle
    # The circle has a dark border (pixel values < 200). We can average coordinates of dark pixels.
    sum_x = 0
    sum_y = 0
    count = 0
    
    # We restrict the search to a smaller region in center of search box to ignore neighbor steps
    inner_left = approx_cx - 38
    inner_right = approx_cx + 38
    inner_top = approx_cy - 38
    inner_bottom = approx_cy + 38
    
    for x in range(max(0, inner_left), min(width, inner_right)):
        for y in range(max(0, inner_top), min(height, inner_bottom)):
            val = pixels[x, y]
            if val < 210: # threshold for dark pixels (border + icon)
                sum_x += x
                sum_y += y
                count += 1
                
    if count > 0:
        refined_cx = sum_x // count
        refined_cy = sum_y // count
        print(f"Refined {name}: approx=({approx_cx}, {approx_cy}) -> refined=({refined_cx}, {refined_cy}) based on {count} dark pixels")
    else:
        refined_cx = approx_cx
        refined_cy = approx_cy
        print(f"Fallback {name}: using approx=({approx_cx}, {approx_cy})")
        
    # Now crop exactly size x size centered on refined coordinates
    final_left = max(0, refined_cx - size // 2)
    final_top = max(0, refined_cy - size // 2)
    final_right = min(width, refined_cx + size // 2)
    final_bottom = min(height, refined_cy + size // 2)
    
    cropped = img.crop((final_left, final_top, final_right, final_bottom))
    cropped = cropped.resize((size, size), Image.LANCZOS)
    
    out_path = os.path.join(out_dir, f"step_{name}.png")
    cropped.save(out_path)
    print(f"Saved refined: {out_path}")

print("Done refining and cropping step icons!")
