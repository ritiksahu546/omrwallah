import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

// Pure mathematical converter from OKLCH to sRGB
function convertOklchToRgb(str: string): string {
  const regex = /oklch\(\s*([^\s\/]+)\s+([^\s\/]+)\s+([^\s\/]+)(?:\s*\/\s*([^\s)]+))?\s*\)/gi;
  return str.replace(regex, (match, lStr, cStr, hStr, aStr) => {
    let l = lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr);
    let c = cStr === 'none' ? 0 : (cStr.endsWith('%') ? (parseFloat(cStr) / 100) * 0.4 : parseFloat(cStr));
    let h = (hStr === 'none' || isNaN(parseFloat(hStr))) ? 0 : parseFloat(hStr);
    let a = aStr ? (aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr)) : 1;

    if (isNaN(l)) l = 0;
    if (isNaN(c)) c = 0;
    if (isNaN(a)) a = 1;

    // Fast-path for achromatic (c == 0 or white/black/grays)
    if (c === 0 || Math.abs(c) < 0.0001) {
      const v = Math.round(Math.max(0, Math.min(1, l)) * 255);
      return a < 1 ? `rgba(${v}, ${v}, ${v}, ${a})` : `rgb(${v}, ${v}, ${v})`;
    }

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

    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
  });
}

// Color conversion cache to keep cloning fast
const colorCache = new Map<string, string>();

function resolveColor(str: string): string {
  if (!str) return str;
  if (!str.toLowerCase().includes('oklch')) return str;
  if (colorCache.has(str)) return colorCache.get(str)!;

  let resolved = str;

  // Safe canvas parser with sentinel verification
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Sentinel color to verify if canvas 2D actually updated fillStyle
      ctx.fillStyle = '#fe1234';
      ctx.fillStyle = str;
      if (ctx.fillStyle && ctx.fillStyle !== '#fe1234' && !ctx.fillStyle.includes('oklch')) {
        resolved = ctx.fillStyle;
      }
    }
  } catch {
    // Fall back to math converter
  }

  // If still oklch (because mobile canvas didn't support oklch string in fillStyle), convert using exact formula
  if (resolved.toLowerCase().includes('oklch')) {
    resolved = convertOklchToRgb(resolved);
  }

  colorCache.set(str, resolved);
  return resolved;
}

/**
 * Sanitizes all styles and parent transforms in the cloned document so html2canvas renders cleanly on mobile
 */
function sanitizeClonedDocument(clonedDoc: Document, targetElementId: string) {
  // 1. Process all inline <style> tags in cloned document
  const styleTags = clonedDoc.querySelectorAll('style');
  styleTags.forEach((tag) => {
    if (tag.textContent && tag.textContent.toLowerCase().includes('oklch')) {
      tag.textContent = convertOklchToRgb(tag.textContent);
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
          const converted = resolveColor(val);
          htmlEl.style.setProperty(prop, converted, 'important');
        }
      }
    } catch {
      // Continue if computed style is unavailable for SVG or hidden nodes
    }
  });

  // 3. Normalize the target printable element and its parent hierarchy
  const clonedTarget = clonedDoc.getElementById(targetElementId);
  if (clonedTarget) {
    let parent: HTMLElement | null = clonedTarget.parentElement;
    while (parent && parent !== clonedDoc.body) {
      parent.style.transform = 'none';
      parent.style.position = 'static';
      parent.style.overflow = 'visible';
      parent.style.width = '794px';
      parent.style.minWidth = '794px';
      parent.style.maxWidth = 'none';
      parent.style.height = 'auto';
      parent.style.maxHeight = 'none';
      parent.style.margin = '0';
      parent.style.padding = '0';
      parent.style.display = 'block';
      parent.style.visibility = 'visible';
      parent = parent.parentElement;
    }

    clonedTarget.style.position = 'relative';
    clonedTarget.style.top = '0';
    clonedTarget.style.left = '0';
    clonedTarget.style.transform = 'none';
    clonedTarget.style.margin = '0 auto';
    clonedTarget.style.boxShadow = 'none';
    clonedTarget.style.borderRadius = '0';
    clonedTarget.style.width = '794px';
    clonedTarget.style.minWidth = '794px';
    clonedTarget.style.maxWidth = '794px';
    clonedTarget.style.height = '1123px';
    clonedTarget.style.minHeight = '1123px';
    clonedTarget.style.backgroundColor = '#ffffff';
    clonedTarget.style.color = '#000000';
    clonedTarget.style.display = 'block';
    clonedTarget.style.visibility = 'visible';
  }
}

/**
 * Pre-converts all OKLCH colors across a DOM tree into standard rgb/rgba
 */
function convertTreeOklchStyles(root: HTMLElement) {
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

  const elements = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[];
  elements.forEach((el) => {
    if (!el.style) return;
    try {
      const computed = window.getComputedStyle(el);
      for (const prop of cssProperties) {
        const val = computed.getPropertyValue(prop);
        if (val && val.toLowerCase().includes('oklch')) {
          const converted = resolveColor(val);
          el.style.setProperty(prop, converted, 'important');
        }
      }
    } catch {
      // Continue
    }
  });
}

/**
 * Gathers all CSS from document.styleSheets, <link rel="stylesheet">, and <style> tags,
 * sanitizes OKLCH color notations, and removes @property definitions that break html2canvas.
 */
async function collectAllStylesheetsCss(): Promise<string> {
  const cssChunks: string[] = [];

  // 1. Try to read from document.styleSheets
  try {
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      try {
        if (sheet.cssRules && sheet.cssRules.length > 0) {
          let sheetCss = '';
          for (let j = 0; j < sheet.cssRules.length; j++) {
            const ruleText = sheet.cssRules[j].cssText;
            if (!ruleText.startsWith('@property')) {
              sheetCss += ruleText + '\n';
            }
          }
          if (sheetCss.trim()) {
            cssChunks.push(sheetCss);
            continue;
          }
        }
      } catch {
        // Cross-origin CSSStyleSheet restriction, fallback to fetch below
      }

      // If cssRules was inaccessible or empty, fetch the stylesheet text directly
      if (sheet.href) {
        try {
          const resp = await fetch(sheet.href);
          if (resp.ok) {
            const text = await resp.text();
            cssChunks.push(text);
          }
        } catch {
          // Ignore fetch error
        }
      }
    }
  } catch {
    // Continue
  }

  // 2. Scan all <link rel="stylesheet"> tags in document.head
  try {
    const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
    for (const link of linkTags) {
      if (link.href && !cssChunks.some((chunk) => chunk.includes(link.href))) {
        try {
          const resp = await fetch(link.href);
          if (resp.ok) {
            const text = await resp.text();
            cssChunks.push(text);
          }
        } catch {
          // Continue
        }
      }
    }
  } catch {
    // Continue
  }

  // 3. Scan all <style> tags in document
  try {
    const styleTags = Array.from(document.querySelectorAll('style'));
    for (const style of styleTags) {
      if (style.textContent) {
        cssChunks.push(style.textContent);
      }
    }
  } catch {
    // Continue
  }

  // Combine and clean up
  let combined = cssChunks.join('\n');

  // Strip @property blocks: e.g. @property --tw-... { ... }
  combined = combined.replace(/@property\s+[^{]+\{[^}]*\}/gi, '');

  // Convert all OKLCH colors to rgb/rgba
  return convertOklchToRgb(combined);
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

  // Gather complete sanitized stylesheet text
  const fullCss = await collectAllStylesheetsCss();

  // To prevent mobile/laptop viewports from compressing or wrapping columns:
  // Mount an isolated, unscaled 794px × 1123px container with positive z-index and opacity near zero
  const tempHost = document.createElement('div');
  tempHost.id = 'omr-pdf-render-host';
  tempHost.style.position = 'fixed';
  tempHost.style.top = '0';
  tempHost.style.left = '0';
  tempHost.style.width = '794px';
  tempHost.style.minWidth = '794px';
  tempHost.style.maxWidth = '794px';
  tempHost.style.height = '1123px';
  tempHost.style.minHeight = '1123px';
  tempHost.style.maxHeight = '1123px';
  tempHost.style.zIndex = '99999'; // Positive z-index ensures html2canvas renders all layers
  tempHost.style.opacity = '0.001'; // Invisible to user during capture
  tempHost.style.pointerEvents = 'none';
  tempHost.style.overflow = 'hidden';
  tempHost.style.backgroundColor = '#ffffff';

  // Inject full CSS stylesheet directly into tempHost
  const styleEl = document.createElement('style');
  styleEl.id = 'omr-injected-full-css';
  styleEl.textContent = fullCss;
  tempHost.appendChild(styleEl);

  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = 'printable-omr-render-clone';
  clone.style.position = 'relative';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  clone.style.width = '794px';
  clone.style.minWidth = '794px';
  clone.style.maxWidth = '794px';
  clone.style.height = '1123px';
  clone.style.minHeight = '1123px';
  clone.style.maxHeight = '1123px';
  clone.style.boxSizing = 'border-box';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#000000';
  clone.style.display = 'flex';
  clone.style.flexDirection = 'column';
  clone.style.justifyContent = 'space-between';
  clone.style.visibility = 'visible';
  clone.style.opacity = '1';

  tempHost.appendChild(clone);
  document.body.appendChild(tempHost);

  // Measure if clone inner content needs auto-fit scaling to prevent any bottom clipping
  const innerFrame = clone.querySelector('#printable-omr-render-clone > div') as HTMLElement | null;
  if (innerFrame) {
    innerFrame.style.boxSizing = 'border-box';
    innerFrame.style.display = 'flex';
    innerFrame.style.flexDirection = 'column';
    innerFrame.style.justifyContent = 'space-between';
    const scrollH = innerFrame.scrollHeight;
    const clientH = innerFrame.clientHeight || 1080;
    if (scrollH > clientH + 2) {
      const fitRatio = Number((clientH / scrollH).toFixed(3));
      innerFrame.style.transform = `scale(${fitRatio})`;
      innerFrame.style.transformOrigin = 'top center';
    }
  }

  // Pre-convert OKLCH colors across the clone DOM tree before html2canvas touches it
  convertTreeOklchStyles(clone);

  try {
    const scaleFactor = 2.0; // Produces 1588px × 2246px crystal clear A4 print

    // Render using html2canvas with explicit 794px × 1123px dimensions
    const canvas = await html2canvas(clone, {
      scale: scaleFactor,
      width: 794,
      height: 1123,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1200,
      windowHeight: 1600,
      onclone: (clonedDoc) => {
        // Inject full CSS into the cloned document head
        const clonedHead = clonedDoc.head || clonedDoc.getElementsByTagName('head')[0];
        if (clonedHead) {
          const clonedStyle = clonedDoc.createElement('style');
          clonedStyle.textContent = fullCss;
          clonedHead.appendChild(clonedStyle);
        }

        if (clonedDoc.documentElement) {
          clonedDoc.documentElement.style.width = '1200px';
          clonedDoc.documentElement.style.maxWidth = 'none';
          clonedDoc.documentElement.style.overflow = 'visible';
        }
        if (clonedDoc.body) {
          clonedDoc.body.style.width = '1200px';
          clonedDoc.body.style.maxWidth = 'none';
          clonedDoc.body.style.overflow = 'visible';
        }
        sanitizeClonedDocument(clonedDoc, 'printable-omr-render-clone');
      },
    });

    // Composite onto a guaranteed opaque white background
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const finalCtx = finalCanvas.getContext('2d');
    if (finalCtx) {
      finalCtx.fillStyle = '#ffffff';
      finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      finalCtx.drawImage(canvas, 0, 0);
    }

    const targetCanvas = finalCtx ? finalCanvas : canvas;
    const imgData = targetCanvas.toDataURL('image/jpeg', 0.98);

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
      await printOMRSheet(elementId);
      return true;
    } catch {
      return false;
    }
  } finally {
    // Always clean up detached render container
    if (tempHost.parentNode) {
      tempHost.parentNode.removeChild(tempHost);
    }
  }
}

export async function printOMRSheet(elementId: string = 'printable-omr-container'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  try {
    const fullCss = await collectAllStylesheetsCss();

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.top = '-9999px';
    printFrame.style.left = '-9999px';
    printFrame.style.width = '210mm';
    printFrame.style.height = '297mm';
    printFrame.style.border = 'none';
    printFrame.id = 'omr-print-iframe';

    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (!frameDoc) {
      document.body.removeChild(printFrame);
      window.print();
      return;
    }

    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>OMR Sheet Print</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #000000 !important;
              width: 210mm !important;
              height: 297mm !important;
              max-height: 297mm !important;
              overflow: hidden !important;
            }
            #printable-omr-container {
              width: 210mm !important;
              height: 297mm !important;
              max-height: 297mm !important;
              overflow: hidden !important;
              margin: 0 !important;
              box-shadow: none !important;
              transform: none !important;
              background: #ffffff !important;
              color: #000000 !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }
            ${fullCss}
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `);
    frameDoc.close();

    setTimeout(() => {
      try {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
      } catch (e) {
        console.error('Iframe print error, falling back to window.print', e);
        window.print();
      } finally {
        setTimeout(() => {
          if (printFrame.parentNode) {
            printFrame.parentNode.removeChild(printFrame);
          }
        }, 1500);
      }
    }, 250);
  } catch (err) {
    console.error('Error preparing print iframe:', err);
    window.print();
  }
}


