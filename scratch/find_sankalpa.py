import os
import re

extracted_dir = "/Users/rohitpal/Developer/Projects/Tap/TAPA/scratch/extracted"
files = sorted([f for f in os.listdir(extracted_dir) if f.endswith('.txt')])

# Match Devanagari Unicode range
devanagari_pattern = re.compile(r'[\u0900-\u097F]+')

for f in files:
    file_path = os.path.join(extracted_dir, f)
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()
    
    matches = devanagari_pattern.findall(content)
    if matches:
        print(f"\nDevanagari in {f}:")
        # Print lines containing devanagari
        with open(file_path, "r", encoding="utf-8") as file:
            for idx, line in enumerate(file):
                if devanagari_pattern.search(line):
                    print(f"  Line {idx+1}: {line.strip()}")
