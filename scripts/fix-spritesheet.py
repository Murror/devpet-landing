"""
Fix AI-generated sprite sheets: detect frames, normalize to uniform grid.
Usage: python3 scripts/fix-spritesheet.py input.png output.png
"""

import sys
from PIL import Image

def find_frames(img, bg_threshold=30):
    """Find bounding boxes of sprite frames by scanning for content."""
    pixels = img.load()
    w, h = img.size

    def is_content(x, y):
        r, g, b, a = pixels[x, y]
        if a > 10:
            return max(r, g, b) > bg_threshold
        return False

    # Find rows with content
    row_has_content = []
    for y in range(h):
        has = any(is_content(x, y) for x in range(0, w, 2))  # sample every 2px for speed
        row_has_content.append(has)

    row_ranges = _find_ranges(row_has_content, min_gap=8)

    frames = []
    for row_start, row_end in row_ranges:
        # Find columns with content in this row
        col_has_content = []
        for x in range(w):
            has = any(is_content(x, y) for y in range(row_start, row_end, 2))
            col_has_content.append(has)

        col_ranges = _find_ranges(col_has_content, min_gap=3)
        for col_start, col_end in col_ranges:
            frames.append((col_start, row_start, col_end, row_end))

    return frames

def _find_ranges(content_list, min_gap=10):
    """Find contiguous True ranges."""
    ranges = []
    in_range = False
    start = 0
    gap_count = 0

    for i, val in enumerate(content_list):
        if val:
            if not in_range:
                start = i
                in_range = True
            gap_count = 0
        else:
            if in_range:
                gap_count += 1
                if gap_count >= min_gap:
                    ranges.append((start, i - gap_count + 1))
                    in_range = False
                    gap_count = 0

    if in_range:
        ranges.append((start, len(content_list) - gap_count))

    return ranges

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 fix-spritesheet.py input.png output.png")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    img = Image.open(input_path).convert('RGBA')
    print(f"Input: {img.width}x{img.height}")

    frames = find_frames(img)
    print(f"Detected {len(frames)} frames")

    if not frames:
        print("No frames detected!")
        sys.exit(1)

    # Filter out small frames (text labels, artifacts)
    # Use median area as reference — real sprite frames are much larger than text
    areas = [(x2-x1) * (y2-y1) for (x1,y1,x2,y2) in frames]
    areas_sorted = sorted(areas)
    median_area = areas_sorted[len(areas_sorted) // 2]
    min_area = median_area * 0.3  # frames must be at least 30% of median size

    # Crop each frame (skip tiny ones)
    cropped = []
    for i, (x1, y1, x2, y2) in enumerate(frames):
        area = (x2-x1) * (y2-y1)
        if area < min_area:
            print(f"  Skipped: {x2-x1}x{y2-y1} at ({x1},{y1}) — too small (text/artifact)")
            continue
        frame = img.crop((x1, y1, x2, y2))
        cropped.append(frame)
        print(f"  Frame {len(cropped)}: {x2-x1}x{y2-y1} at ({x1},{y1})")

    # Find max dimensions and make uniform cells
    max_w = max(f.width for f in cropped)
    max_h = max(f.height for f in cropped)
    cell_w = max_w + 4
    cell_h = max_h + 4

    print(f"Cell size: {cell_w}x{cell_h}")

    # Single row output
    n = len(cropped)
    output = Image.new('RGBA', (n * cell_w, cell_h), (0, 0, 0, 0))

    for i, frame in enumerate(cropped):
        x_offset = i * cell_w + (cell_w - frame.width) // 2
        y_offset = (cell_h - frame.height) // 2
        output.paste(frame, (x_offset, y_offset), frame)

    output.save(output_path)
    print(f"Output: {output.width}x{output.height} ({n} frames in 1 row)")
    print(f"Frame width: {cell_w}, Frame height: {cell_h}")
    print(f"Saved to {output_path}")

if __name__ == '__main__':
    main()
