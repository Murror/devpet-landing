"""
Merge individual frame images into a single-row sprite sheet.
Usage: python3 scripts/merge-frames.py <input_folder> <output.png> [--size WxH]

Frames are sorted by filename. All frames are resized/padded to uniform size.
Example: python3 scripts/merge-frames.py ~/Downloads/byte-frames public/sprites/byte/happy-smooth.png
"""

import sys
import os
from PIL import Image

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 merge-frames.py <input_folder_or_files...> <output.png> [--size WxH]")
        print("  python3 merge-frames.py ~/frames/ output.png")
        print("  python3 merge-frames.py frame1.png frame2.png frame3.png output.png")
        sys.exit(1)

    # Parse --size flag
    target_size = None
    args = list(sys.argv[1:])
    if '--size' in args:
        idx = args.index('--size')
        w, h = args[idx + 1].split('x')
        target_size = (int(w), int(h))
        args.pop(idx + 1)
        args.pop(idx)

    output_path = args[-1]
    input_args = args[:-1]

    # Collect input files
    files = []
    if len(input_args) == 1 and os.path.isdir(input_args[0]):
        # Folder mode
        folder = input_args[0]
        for f in sorted(os.listdir(folder)):
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                files.append(os.path.join(folder, f))
    else:
        # Individual files mode
        files = input_args

    if not files:
        print("No image files found!")
        sys.exit(1)

    print(f"Found {len(files)} frames:")

    # Load all frames
    frames = []
    for f in files:
        img = Image.open(f).convert('RGBA')
        frames.append(img)
        print(f"  {os.path.basename(f)}: {img.width}x{img.height}")

    # Determine cell size
    if target_size:
        cell_w, cell_h = target_size
    else:
        cell_w = max(f.width for f in frames)
        cell_h = max(f.height for f in frames)

    print(f"Cell size: {cell_w}x{cell_h}")

    # Create sprite sheet (single row)
    n = len(frames)
    sheet = Image.new('RGBA', (n * cell_w, cell_h), (0, 0, 0, 0))

    for i, frame in enumerate(frames):
        # Resize if larger than cell, keeping aspect ratio
        if frame.width > cell_w or frame.height > cell_h:
            frame.thumbnail((cell_w, cell_h), Image.NEAREST)

        # Center in cell
        x = i * cell_w + (cell_w - frame.width) // 2
        y = (cell_h - frame.height) // 2
        sheet.paste(frame, (x, y), frame)

    sheet.save(output_path)
    print(f"Output: {sheet.width}x{sheet.height} ({n} frames)")
    print(f"Saved to {output_path}")

if __name__ == '__main__':
    main()
