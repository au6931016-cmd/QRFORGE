/**
 * Bakes the optional "frame" caption and label text into an exported QR
 * image. The live preview and print view render this text as DOM overlay
 * next to the QR — that never reaches the downloaded PNG/SVG file on its
 * own, so downloads need their own composed copy.
 */

interface FrameTextOptions {
  frameEnabled: boolean;
  frameLabel: string;
  label: string;
}

interface ComposedLayout {
  margin: number;
  frameTextHeight: number;
  captionHeight: number;
  cardWidth: number;
  cardHeight: number;
  totalWidth: number;
  totalHeight: number;
}

const BORDER_COLOR = "#e2e8f0";
const FRAME_TEXT_COLOR = "#0f172a";
const CAPTION_TEXT_COLOR = "#64748b";

function computeLayout(size: number, frame: FrameTextOptions): ComposedLayout {
  const margin = Math.round(size * 0.08);
  const frameTextHeight = frame.frameEnabled ? Math.round(size * 0.14) : 0;
  const captionHeight = frame.label ? Math.round(size * 0.12) : 0;
  const cardWidth = size + margin * 2;
  const cardHeight = size + margin * 2 + frameTextHeight;
  return {
    margin,
    frameTextHeight,
    captionHeight,
    cardWidth,
    cardHeight,
    totalWidth: cardWidth,
    totalHeight: cardHeight + captionHeight,
  };
}

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load generated QR image."));
    };
    img.src = url;
  });
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function composeFramedPng(
  qrBlob: Blob,
  size: number,
  frame: FrameTextOptions,
): Promise<Blob> {
  const img = await loadImage(qrBlob);
  const l = computeLayout(size, frame);

  const canvas = document.createElement("canvas");
  canvas.width = l.totalWidth;
  canvas.height = l.totalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot compose the QR image.");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, l.totalWidth, l.totalHeight);

  if (frame.frameEnabled) {
    const radius = Math.round(size * 0.04);
    const strokeWidth = Math.max(1, Math.round(size * 0.004));
    ctx.strokeStyle = BORDER_COLOR;
    ctx.lineWidth = strokeWidth;
    roundedRectPath(
      ctx,
      strokeWidth / 2,
      strokeWidth / 2,
      l.cardWidth - strokeWidth,
      l.cardHeight - strokeWidth,
      radius,
    );
    ctx.stroke();
  }

  ctx.drawImage(img, l.margin, l.margin, size, size);

  if (frame.frameEnabled) {
    ctx.fillStyle = FRAME_TEXT_COLOR;
    ctx.font = `bold ${Math.round(size * 0.045)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      frame.frameLabel || "SCAN ME",
      l.cardWidth / 2,
      l.margin + size + l.frameTextHeight / 2,
    );
  }

  if (frame.label) {
    ctx.fillStyle = CAPTION_TEXT_COLOR;
    ctx.font = `600 ${Math.round(size * 0.035)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(frame.label, l.totalWidth / 2, l.cardHeight + l.captionHeight / 2);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to export the composed PNG."));
    }, "image/png");
  });
}

export async function composeFramedSvg(
  qrBlob: Blob,
  size: number,
  frame: FrameTextOptions,
): Promise<Blob> {
  const svgText = await qrBlob.text();
  const parser = new DOMParser();
  const original = parser.parseFromString(svgText, "image/svg+xml").documentElement;
  const l = computeLayout(size, frame);
  const svgNS = "http://www.w3.org/2000/svg";

  const root = document.createElementNS(svgNS, "svg");
  root.setAttribute("xmlns", svgNS);
  root.setAttribute("width", String(l.totalWidth));
  root.setAttribute("height", String(l.totalHeight));
  root.setAttribute("viewBox", `0 0 ${l.totalWidth} ${l.totalHeight}`);

  const bg = document.createElementNS(svgNS, "rect");
  bg.setAttribute("width", String(l.totalWidth));
  bg.setAttribute("height", String(l.totalHeight));
  bg.setAttribute("fill", "#ffffff");
  root.appendChild(bg);

  if (frame.frameEnabled) {
    const radius = Math.round(size * 0.04);
    const strokeWidth = Math.max(1, Math.round(size * 0.004));
    const border = document.createElementNS(svgNS, "rect");
    border.setAttribute("x", String(strokeWidth / 2));
    border.setAttribute("y", String(strokeWidth / 2));
    border.setAttribute("width", String(l.cardWidth - strokeWidth));
    border.setAttribute("height", String(l.cardHeight - strokeWidth));
    border.setAttribute("rx", String(radius));
    border.setAttribute("fill", "none");
    border.setAttribute("stroke", BORDER_COLOR);
    border.setAttribute("stroke-width", String(strokeWidth));
    root.appendChild(border);
  }

  const originalViewBox = original.getAttribute("viewBox");
  const originalSize = original.getAttribute("width") || String(size);
  const inner = document.createElementNS(svgNS, "svg");
  inner.setAttribute("x", String(l.margin));
  inner.setAttribute("y", String(l.margin));
  inner.setAttribute("width", String(size));
  inner.setAttribute("height", String(size));
  inner.setAttribute("viewBox", originalViewBox || `0 0 ${originalSize} ${originalSize}`);
  while (original.firstChild) {
    inner.appendChild(original.firstChild);
  }
  root.appendChild(inner);

  if (frame.frameEnabled) {
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", String(l.cardWidth / 2));
    text.setAttribute("y", String(l.margin + size + l.frameTextHeight / 2));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("font-family", "sans-serif");
    text.setAttribute("font-weight", "bold");
    text.setAttribute("font-size", String(Math.round(size * 0.045)));
    text.setAttribute("fill", FRAME_TEXT_COLOR);
    text.textContent = frame.frameLabel || "SCAN ME";
    root.appendChild(text);
  }

  if (frame.label) {
    const caption = document.createElementNS(svgNS, "text");
    caption.setAttribute("x", String(l.totalWidth / 2));
    caption.setAttribute("y", String(l.cardHeight + l.captionHeight / 2));
    caption.setAttribute("text-anchor", "middle");
    caption.setAttribute("dominant-baseline", "middle");
    caption.setAttribute("font-family", "sans-serif");
    caption.setAttribute("font-weight", "600");
    caption.setAttribute("font-size", String(Math.round(size * 0.035)));
    caption.setAttribute("fill", CAPTION_TEXT_COLOR);
    caption.textContent = frame.label;
    root.appendChild(caption);
  }

  const svgString = new XMLSerializer().serializeToString(root);
  return new Blob([svgString], { type: "image/svg+xml" });
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
