"""
Split sprite sheet by uniform grid (no auto-detection).
Usage: python3 scripts/grid-split.py input.png output.png --cols 6 --rows 3
"""

import sys
from PIL import Image

def main():
    args = list(sys.argv[1:])

    if len(args) < 2 or '--cols' not in args:
        print("Usage: python3 grid-split.py input.png output.png --cols N --rows N")
        sys.exit(1)

    input_path = args[0]
    output_path = args[1]

    cols = int(args[args.index('--cols') + 1])
    rows = int(args[args.index('--rows') + 1]) if '--rows' in args else 1

    img = Image.open(input_path).convert('RGBA')
    print(f"Input: {img.width}x{img.height}")

    cell_w = img.width // cols
    cell_h = img.height // rows
    print(f"Grid: {cols}x{rows}, cell: {cell_w}x{cell_h}")

    # Extract frames left-to-right, top-to-bottom
    frames = []
    for r in range(rows):
        for c in range(cols):
            x = c * cell_w
            y = r * cell_h
            frame = img.crop((x, y, x + cell_w, y + cell_h))
            frames.append(frame)

    # Trim empty frames (all transparent or all black)
    def is_empty(frame):
        pixels = frame.load()
        w, h = frame.size
        for sy in range(0, h, 8):
            for sx in range(0, w, 8):
                r, g, b, a = pixels[sx, sy]
                if a > 10 and max(r, g, b) > 30:
                    return False
        return True

    trimmed = [f for f in frames if not is_empty(f)]
    print(f"Frames: {len(frames)} total, {len(trimmed)} non-empty")

    # Output single row
    n = len(trimmed)
    sheet = Image.new('RGBA', (n * cell_w, cell_h), (0, 0, 0, 0))
    for i, frame in enumerate(trimmed):
        sheet.paste(frame, (i * cell_w, 0), frame)

    sheet.save(output_path)
    print(f"Output: {sheet.width}x{sheet.height} ({n} frames)")
    print(f"Saved to {output_path}")

if __name__ == '__main__':
    main()
