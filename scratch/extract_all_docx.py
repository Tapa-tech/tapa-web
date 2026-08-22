import zipfile
import xml.etree.ElementTree as ET
import os
import json

base_dir = "/Users/rohitpal/Developer/Projects/Tap/Assets/drive-download-20260807T045427Z-1-001/Editorial/Aug 2026/Ritual Guides"
out_dir = "/Users/rohitpal/Developer/Projects/Tap/TAPA/scratch/extracted"
os.makedirs(out_dir, exist_ok=True)

def extract_docx_text(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # Namespace mapping
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            paragraphs = []
            for para in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                texts = [node.text for node in para.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
                else:
                    paragraphs.append('')
            return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error: {e}"

subdirs = sorted([d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))])

for subdir in subdirs:
    dir_path = os.path.join(base_dir, subdir)
    docx_files = [f for f in os.listdir(dir_path) if f.endswith('.docx')]
    if docx_files:
        docx_file = os.path.join(dir_path, docx_files[0])
        print(f"Extracting {subdir}...")
        text = extract_docx_text(docx_file)
        
        # Save to plain text file
        txt_path = os.path.join(out_dir, f"{subdir}.txt")
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Saved: {txt_path} ({len(text)} chars)")
