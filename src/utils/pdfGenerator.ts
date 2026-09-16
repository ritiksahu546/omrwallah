import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

// Pure mathematical converter from OKLCH to sRGB as a fallback
function convertOklchStringToRgb(str: string): string {
  const m = str.match(/oklch\(\s*([^\s\/]+)\s+([^\s\/]+)\s+([^\s\/]+)(?:\s*\/\s*([^\s)]+))?\s*\)/i);
  if (!m) return 'rgb(0, 0, 0)';

  const [, lStr, cStr, hStr, aStr] = m;
  let l = lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr);
  let c = cStr.endsWith('%') ? (parseFloat(cStr) / 100) * 0.4 : parseFloat(cStr);
  let h = parseFloat(hStr);
  let a = aStr ? (aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr)) : 1;

  if (isNaN(l)) l = 0;
  if (isNaN(c)) c = 0;
  if (isNaN(h)) h = 0;
  if (isNaN(a)) a = 1;

  const hr = (h * Math.PI) / 180;
  const a_ = c * Math.cos(hr);
  const b_ = c * Math.sin(hr);

  const l_ = Math.pow(l + 0.3963377774 * a_ + 0.2158037573 * b_, 3);
  const m_ = Math.pow(l - 0.1055613458 * a_ - 0.0638541728 * b_, 3);
  const s_ = Math.pow(l - 0.0894841775 * a_ - 1.291485548 * b_, 3);

  const rLin = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const gLin = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const bLin = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;

  const toGamma = (x: number) => {
    const clamped = Math.max(0, Math.min(1, x));
    return clamped <= 0.0031308
      ? Math.round(clamped * 12.92 * 255)
      : Math.round((1.055 * Math.pow(clamped, 1 / 2.4) - 0.055) * 255);
  };

  const r = toGamma(rLin);
  const g = toGamma(gLin);
  const b = toGamma(bLin);

  return a < 1 ? `rgba(${r}, ${b === undefined ? 0 : g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
}

// Color conversion cache
const colorCache = new Map<string, string>();

function resolveOklch(str: string): string {
  if (!str.toLowerCase().includes('oklch')) return str;
  if (colorCache.has(str)) return colorCache.get(str)!;

  let resolved = str;
  // Try 2D Canvas parser if in browser
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillStyle = str;
      if (ctx.fillStyle && !ctx.fillStyle.includes('oklch')) {
        resolved = ctx.fillStyle;
      }
    }
  } catch {
    // Fall back to math converter
  }

  // If still oklch or not parsed, convert using math
  if (resolved.toLowerCase().includes('oklch')) {
    resolved = resolved.replace(/oklch\([^)]+\)/gi, (m) => convertOklchStringToRgb(m));
  }

  colorCache.set(str, resolved);
  return resolved;
}

/**
 * Sanitizes all styles in the cloned document so html2canvas doesn't encounter unsupported oklch functions
 */
function sanitizeClonedDocument(clonedDoc: Document, targetElementId: string) {
  // 1. Process all inline <style> tags in cloned document
  const styleTags = clonedDoc.querySelectorAll('style');
  styleTags.forEach((tag) => {
    if (tag.textContent && tag.textContent.toLowerCase().includes('oklch')) {
      tag.textContent = tag.textContent.replace(/oklch\([^)]+\)/gi, (match) => resolveOklch(match));
    }
  });

  // 2. Walk elements and convert any computed or inline oklch values to rgb
  const allElements = clonedDoc.querySelectorAll('*');
  const cssProperties = [
    'color',
    'background-color',
    'border-color',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'outline-color',
    'fill',
    'stroke',
  ];

  const win = clonedDoc.defaultView || window;

  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (!htmlEl.style) return;

    try {
      const computed = win.getComputedStyle(htmlEl);
      for (const prop of cssProperties) {
        const val = computed.getPropertyValue(prop);
        if (val && val.toLowerCase().includes('oklch')) {
          const converted = resolveOklch(val);
          htmlEl.style.setProperty(prop, converted, 'important');
        }
      }
    } catch {
      // Continue if computed style is unavailable for SVG or hidden nodes
    }
  });

  // 3. Normalize the target printable element
  const clonedTarget = clonedDoc.getElementById(targetElementId);
  if (clonedTarget) {
    clonedTarget.style.transform = 'none';
    clonedTarget.style.margin = '0 auto';
    clonedTarget.style.boxShadow = 'none';
    clonedTarget.style.borderRadius = '0';
    clonedTarget.style.width = '210mm';
    clonedTarget.style.minHeight = '297mm';
  }
}

export async function downloadOMRPdf(
  elementId: string,
  filename: string = 'OMRWallah-Sheet.pdf'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  try {
    // Generate high-resolution canvas with full OKLCH color normalization
    const canvas = await html2canvas(element, {
      scale: 2.2, // ~300 DPI for crisp A4 print without excessive memory
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      onclone: (clonedDoc) => {
        sanitizeClonedDocument(clonedDoc, elementId);
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Scale canvas image onto A4 page with exact dimensions
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF with html2canvas-pro:', error);

    // Fallback: Trigger browser native print / PDF dialog
    try {
      window.print();
      return true;
    } catch {
      return false;
    }
  }
}

export function printOMRSheet(): void {
  window.print();
}


