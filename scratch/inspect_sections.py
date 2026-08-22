import os

extracted_dir = "/Users/rohitpal/Developer/Projects/Tap/TAPA/scratch/extracted"
files = sorted([f for f in os.listdir(extracted_dir) if f.endswith('.txt')])

for f in files:
    file_path = os.path.join(extracted_dir, f)
    with open(file_path, "r", encoding="utf-8") as file:
        lines = file.readlines()
    
    print(f"\n===== HEADINGS IN {f} =====")
    for idx, line in enumerate(lines):
        clean = line.strip()
        if "PART" in clean or "Section:" in clean or "FIELD" in clean or "A1." in clean or "A2." in clean or "A3." in clean:
            print(f"  Line {idx+1}: {clean}")
