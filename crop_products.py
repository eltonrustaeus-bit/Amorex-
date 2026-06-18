#!/usr/bin/env python3
"""
Crop 15 product images + hero from Shopify mockup reference image.
Uses background-color sampling to detect light-colored garments.
Outputs portrait canvases (600x800) matching the 3:4 CSS aspect-ratio.
"""

import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
import os

SRC = "/root/.claude/uploads/128d9962-b381-57fb-a866-f1fcdeb19c59/4884210b-IMG_1842.jpeg"
OUT_DIR = "/home/user/Amorex-/images/"
os.makedirs(OUT_DIR, exist_ok=True)

CANVAS_W = 600
CANVAS_H = 800
CANVAS_BG = (242, 241, 239)
PADDING = 20
BG_DIFF_THRESH = 8
CORNER_PATCH = 8

# Search windows — start must be in pure background so corner-sampling works
SEARCH_Y = {
    "hoodie": (520, 810),   # hero ends at ~y=515; bg gap at 520-565; hoodies start ~570
    "tshirt": (845, 1100),
    "cap":    (1115, 1340),
}

# x slots with 20px buffer each side already applied
X_SLOTS = {
    "navy":        (228, 454),
    "black":       (414, 640),
    "white":       (600, 826),
    "baby-blue":   (786, 1010),
    "light-beige": (960, 1170),
}

PRODUCTS = [
    ("hoodie", "navy"),
    ("hoodie", "black"),
    ("hoodie", "white"),
    ("hoodie", "baby-blue"),
    ("hoodie", "light-beige"),
    ("tshirt", "navy"),
    ("tshirt", "black"),
    ("tshirt", "white"),
    ("tshirt", "baby-blue"),
    ("tshirt", "light-beige"),
    ("cap", "navy"),
    ("cap", "black"),
    ("cap", "white"),
    ("cap", "baby-blue"),
    ("cap", "light-beige"),
]


def sample_background(arr, x0, y0, x1, y1, patch=CORNER_PATCH):
    """Sample background from 4 corners of the region, return median color."""
    corners = [
        arr[y0:y0+patch, x0:x0+patch],
        arr[y0:y0+patch, x1-patch:x1],
        arr[y1-patch:y1, x0:x0+patch],
        arr[y1-patch:y1, x1-patch:x1],
    ]
    pixels = np.concatenate([c.reshape(-1, 3) for c in corners], axis=0)
    return np.median(pixels, axis=0)


def find_product_bbox(arr, x0, y0, x1, y1, bg_color, thresh=BG_DIFF_THRESH):
    """Find tight bounding box of pixels differing from background."""
    region = arr[y0:y1, x0:x1].astype(np.int32)
    bg = bg_color.astype(np.int32)
    diff = np.max(np.abs(region - bg), axis=2)
    mask = diff > thresh
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    if not rows.any() or not cols.any():
        return None, mask
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    return (x0 + cmin, y0 + rmin, x0 + cmax + 1, y0 + rmax + 1), mask


def enhance_image(img):
    """Apply UnsharpMask + Contrast enhancement."""
    img = img.filter(ImageFilter.UnsharpMask(radius=1.4, percent=180, threshold=2))
    img = ImageEnhance.Contrast(img).enhance(1.12)
    return img


def place_on_portrait_canvas(img, cw=CANVAS_W, ch=CANVAS_H, bg=CANVAS_BG, padding=PADDING):
    """Place image on portrait canvas (cw x ch) keeping aspect ratio."""
    avail_w = cw - 2 * padding
    avail_h = ch - 2 * padding
    w, h = img.size
    scale = min(avail_w / w, avail_h / h)
    new_w = int(w * scale)
    new_h = int(h * scale)
    img_resized = img.resize((new_w, new_h), Image.LANCZOS)
    canvas = Image.new("RGB", (cw, ch), bg)
    x_off = (cw - new_w) // 2
    y_off = (ch - new_h) // 2
    canvas.paste(img_resized, (x_off, y_off))
    return canvas


def main():
    src_img = Image.open(SRC).convert("RGB")
    img_w, img_h = src_img.size
    arr = np.array(src_img)
    print(f"Source image: {img_w}x{img_h}px")
    print(f"Output canvas: {CANVAS_W}x{CANVAS_H}px (portrait 3:4)")
    print("=" * 60)

    for cat, color in PRODUCTS:
        name = f"{cat}-{color}"
        ys, ye = SEARCH_Y[cat]
        xs, xe = X_SLOTS[color]

        # Clamp to image bounds
        xs = max(0, xs)
        ye = min(img_h, ye)
        xe = min(img_w, xe)

        bg_color = sample_background(arr, xs, ys, xe, ye)
        bbox, mask = find_product_bbox(arr, xs, ys, xe, ye, bg_color)

        if bbox is None:
            print(f"[{name}] WARNING: No product pixels found! Using full window.")
            bbox = (xs, ys, xe, ye)

        bx0, by0, bx1, by1 = bbox
        native_w = bx1 - bx0
        native_h = by1 - by0
        print(f"[{name}] native bbox: ({bx0},{by0})-({bx1},{by1}) = {native_w}x{native_h}px | bg={bg_color.astype(int).tolist()}")

        # Edge warnings
        hits_top = (by0 <= ys + 2)
        hits_bot = (by1 >= ye - 2)
        hits_left = (bx0 <= xs + 2)
        hits_right = (bx1 >= xe - 2)
        edge_msgs = []
        if hits_top: edge_msgs.append("TOP")
        if hits_bot: edge_msgs.append("BOTTOM")
        if hits_left: edge_msgs.append("LEFT")
        if hits_right: edge_msgs.append("RIGHT")
        if edge_msgs:
            print(f"  WARNING: product touches edge(s): {', '.join(edge_msgs)}")

        # Add padding, clamp to image
        px0 = max(0, bx0 - PADDING)
        py0 = max(0, by0 - PADDING)
        px1 = min(img_w, bx1 + PADDING)
        py1 = min(img_h, by1 + PADDING)

        crop = src_img.crop((px0, py0, px1, py1))
        crop = enhance_image(crop)
        result = place_on_portrait_canvas(crop)
        out_path = os.path.join(OUT_DIR, f"{name}.png")
        result.save(out_path, "PNG")
        print(f"  -> saved {out_path} ({px1-px0}x{py1-py0}px crop -> {CANVAS_W}x{CANVAS_H})")

    print()
    print("=" * 60)
    print("Hero image:")
    hx0, hy0, hx1, hy1 = 385, 18, 1170, 392
    hero_crop = src_img.crop((hx0, hy0, hx1, hy1))
    hero_native_w = hx1 - hx0
    hero_native_h = hy1 - hy0
    print(f"  native: {hero_native_w}x{hero_native_h}px")
    hero_crop = enhance_image(hero_crop)
    target_w = 800
    target_h = int(hero_native_h * target_w / hero_native_w)
    hero_resized = hero_crop.resize((target_w, target_h), Image.LANCZOS)
    hero_path = os.path.join(OUT_DIR, "hero-products.png")
    hero_resized.save(hero_path, "PNG")
    print(f"  -> saved {hero_path} ({target_w}x{target_h}px)")
    print()
    print("Done. All images saved to", OUT_DIR)


if __name__ == "__main__":
    main()
