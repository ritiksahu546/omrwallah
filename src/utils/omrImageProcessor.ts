import { OMRConfig } from '../types/omr';

export type BubbleClassificationStatus = 'filled' | 'empty' | 'multiple' | 'low-confidence';

export interface QuestionScanResult {
  questionNo: number;
  status: BubbleClassificationStatus;
  markedOption: string; // 'A' | 'B' | 'C' | 'D' | 'E' | ''
  detectedOptions: string[];
  optionDarkness: Record<string, number>; // 0..1 relative darkness score per option
  confidence: number; // 0..100
  needsReview: boolean;
}

export interface GridCalibrationBounds {
  top: number;    // 0.05..0.60 (fraction of sheet height where question grid starts)
  bottom: number; // 0.50..0.96 (fraction of sheet height where question grid ends)
  left: number;   // 0.02..0.40 (fraction of sheet width where question grid starts)
  right: number;  // 0.60..0.98 (fraction of sheet width where question grid ends)
}

export interface OMRScanAnalysisOutput {
  results: Record<number, QuestionScanResult>;
  markedAnswers: Record<number, string>;
  annotatedImageUrl: string;
  normalizedImageUrl: string;
  detectedBounds: GridCalibrationBounds;
  cornersDetected: number;
  averageConfidence: number;
  uncertainQuestions: number[];
  filledCount: number;
  emptyCount: number;
  multipleCount: number;
}

export interface AnalyzeOMROptions {
  imageDataUrl: string;
  rotationDeg?: number;
  config: OMRConfig;
  sensitivity?: 'lenient' | 'medium' | 'strict';
  autoStraighten?: boolean;
  customBounds?: GridCalibrationBounds;
}

/**
 * Computes default normalized grid bounds for an OMRConfig based on header/roll-number/footer presence
 */
export function getDefaultGridBounds(config: OMRConfig): GridCalibrationBounds {
  const hasRollOrId = Boolean(
    config.enableRollNumber || config.enableRegistrationNumber || config.enableCenterCode
  );
  const isHighDensity = config.questionsCount >= 150;

  const top = hasRollOrId ? (isHighDensity ? 0.34 : 0.38) : (isHighDensity ? 0.18 : 0.22);
  const bottom = config.enableSignatureBox || config.enableInvigilatorSign ? 0.90 : 0.94;
  const left = 0.045;
  const right = 0.955;

  return { top, bottom, left, right };
}

/**
 * Loads an image data URL into an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not decode image file. Please upload a valid PNG, JPG, or WebP image.'));
    img.src = src;
  });
}

/**
 * Renders the source image with rotation applied onto a standardized working canvas
 */
function createRotatedCanvas(img: HTMLImageElement, rotationDeg: number): HTMLCanvasElement {
  const normRot = ((rotationDeg % 360) + 360) % 360;
  const swapDims = normRot === 90 || normRot === 270;

  const rawW = swapDims ? img.naturalHeight || img.height : img.naturalWidth || img.width;
  const rawH = swapDims ? img.naturalWidth || img.width : img.naturalHeight || img.height;

  // Target width around 900px for accurate & fast pixel sampling
  const targetW = 900;
  const scale = targetW / Math.max(1, rawW);
  const targetH = Math.max(400, Math.round(rawH * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetW, targetH);

  ctx.save();
  ctx.translate(targetW / 2, targetH / 2);
  ctx.rotate((normRot * Math.PI) / 180);
  if (swapDims) {
    ctx.drawImage(img, -targetH / 2, -targetW / 2, targetH, targetW);
  } else {
    ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
  }
  ctx.restore();

  return canvas;
}

/**
 * Detects dark registration corner anchors in the 4 quadrants of the sheet
 */
function detectCornerRegistrationAnchors(
  gray: Uint8Array,
  width: number,
  height: number
): { cornersFound: number; contentBox: { minX: number; maxX: number; minY: number; maxY: number } } {
  const searchW = Math.floor(width * 0.18);
  const searchH = Math.floor(height * 0.18);
  const darkCutoff = 95; // 0 = black, 255 = white

  const findAnchorInRegion = (startX: number, endX: number, startY: number, endY: number) => {
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let y = startY; y < endY; y += 2) {
      const rowOffset = y * width;
      for (let x = startX; x < endX; x += 2) {
        if (gray[rowOffset + x] < darkCutoff) {
          sumX += x;
          sumY += y;
          count++;
        }
      }
    }
    if (count >= 12) {
      return { x: sumX / count, y: sumY / count, found: true };
    }
    return { x: (startX + endX) / 2, y: (startY + endY) / 2, found: false };
  };

  const tl = findAnchorInRegion(4, searchW, 4, searchH);
  const tr = findAnchorInRegion(width - searchW, width - 4, 4, searchH);
  const bl = findAnchorInRegion(4, searchW, height - searchH, height - 4);
  const br = findAnchorInRegion(width - searchW, width - 4, height - searchH, height - 4);

  const cornersFound = [tl, tr, bl, br].filter((c) => c.found).length;

  const minX = tl.found && bl.found ? Math.min(tl.x, bl.x) : width * 0.03;
  const maxX = tr.found && br.found ? Math.max(tr.x, br.x) : width * 0.97;
  const minY = tl.found && tr.found ? Math.min(tl.y, tr.y) : height * 0.02;
  const maxY = bl.found && br.found ? Math.max(bl.y, br.y) : height * 0.98;

  return {
    cornersFound,
    contentBox: { minX, maxX, minY, maxY },
  };
}

/**
 * Performs genuine pixel-level OMR bubble detection on an uploaded or captured image
 */
export async function analyzeOMRImage(options: AnalyzeOMROptions): Promise<OMRScanAnalysisOutput> {
  const {
    imageDataUrl,
    rotationDeg = 0,
    config,
    sensitivity = 'medium',
    autoStraighten = true,
    customBounds,
  } = options;

  const img = await loadImage(imageDataUrl);
  const workCanvas = createRotatedCanvas(img, rotationDeg);
  const width = workCanvas.width;
  const height = workCanvas.height;
  const ctx = workCanvas.getContext('2d')!;

  const imageData = ctx.getImageData(0, 0, width, height);
  const rgba = imageData.data;

  // 1. Convert RGBA to grayscale luminance and compute histogram for contrast normalization
  const gray = new Uint8Array(width * height);
  const hist = new Uint32Array(256);

  for (let i = 0, p = 0; i < rgba.length; i += 4, p++) {
    const lum = Math.round(0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2]);
    gray[p] = lum;
    hist[lum]++;
  }

  // Find 5th and 95th percentile for contrast stretching
  const totalPixels = width * height;
  let cumulative = 0;
  let p5 = 20;
  let p95 = 240;
  for (let v = 0; v < 256; v++) {
    cumulative += hist[v];
    if (cumulative <= totalPixels * 0.05) p5 = v;
    if (cumulative <= totalPixels * 0.95) p95 = v;
  }
  const range = Math.max(40, p95 - p5);
  for (let p = 0; p < totalPixels; p++) {
    const norm = Math.round(((gray[p] - p5) / range) * 255);
    gray[p] = Math.max(0, Math.min(255, norm));
  }

  // 2. Detect corner registration marks and determine active question grid bounds
  const { cornersFound, contentBox } = detectCornerRegistrationAnchors(gray, width, height);
  const baseBounds = customBounds || getDefaultGridBounds(config);

  let activeBounds: GridCalibrationBounds = { ...baseBounds };
  if (!customBounds && autoStraighten && cornersFound >= 2) {
    const sheetW = Math.max(width * 0.5, contentBox.maxX - contentBox.minX);
    const sheetH = Math.max(height * 0.5, contentBox.maxY - contentBox.minY);
    activeBounds = {
      left: Math.max(0.02, Math.min(0.35, (contentBox.minX + sheetW * baseBounds.left) / width)),
      right: Math.max(0.65, Math.min(0.98, (contentBox.minX + sheetW * baseBounds.right) / width)),
      top: Math.max(0.05, Math.min(0.65, (contentBox.minY + sheetH * baseBounds.top) / height)),
      bottom: Math.max(0.45, Math.min(0.97, (contentBox.minY + sheetH * baseBounds.bottom) / height)),
    };
  }

  // 3. Determine column count and row geometry matching OMRSheetRenderer
  const questionsCount = config.questionsCount;
  const optionsCount = config.optionsCount || 4;
  const optionLabels =
    config.optionLabels && config.optionLabels.length >= optionsCount
      ? config.optionLabels
      : ['A', 'B', 'C', 'D', 'E'].slice(0, optionsCount);

  let colsCount = 2;
  if (config.layoutColumns === 'auto') {
    if (questionsCount <= 30) colsCount = 1;
    else if (questionsCount <= 75) colsCount = 2;
    else if (questionsCount <= 130) colsCount = 3;
    else colsCount = 4;
  } else {
    colsCount = parseInt(String(config.layoutColumns), 10) || 2;
  }

  const perCol = Math.ceil(questionsCount / colsCount);

  // Sensitivity thresholds
  const filledThreshold =
    sensitivity === 'lenient' ? 0.19 : sensitivity === 'strict' ? 0.33 : 0.25;
  const uncertainThreshold =
    sensitivity === 'lenient' ? 0.11 : sensitivity === 'strict' ? 0.20 : 0.15;

  const gridLeftPx = activeBounds.left * width;
  const gridRightPx = activeBounds.right * width;
  const gridTopPx = activeBounds.top * height;
  const gridBottomPx = activeBounds.bottom * height;

  const gridWidthPx = Math.max(100, gridRightPx - gridLeftPx);
  const gridHeightPx = Math.max(100, gridBottomPx - gridTopPx);

  const colGapRatio = questionsCount >= 150 ? 0.012 : 0.016;
  const totalGapW = gridWidthPx * colGapRatio * Math.max(0, colsCount - 1);
  const colWidthPx = (gridWidthPx - totalGapW) / colsCount;
  const colStepX = colsCount > 1 ? (gridWidthPx - colWidthPx) / (colsCount - 1) : 0;

  // Prepare annotation overlay canvas
  const annotCanvas = document.createElement('canvas');
  annotCanvas.width = width;
  annotCanvas.height = height;
  const annotCtx = annotCanvas.getContext('2d')!;
  annotCtx.drawImage(workCanvas, 0, 0);

  // Draw calibrated grid boundary rectangle
  annotCtx.strokeStyle = 'rgba(37, 99, 235, 0.85)';
  annotCtx.lineWidth = 2.5;
  annotCtx.setLineDash([6, 4]);
  annotCtx.strokeRect(gridLeftPx, gridTopPx, gridWidthPx, gridHeightPx);
  annotCtx.setLineDash([]);

  // Account for column header row ("Q.No. | A B C D") at top of each column (~20px in 900px scale)
  const colHeaderOffsetPx = Math.min(24, gridHeightPx * 0.032);
  const rowsAreaTopPx = gridTopPx + colHeaderOffsetPx;
  const rowsAreaHeightPx = Math.max(60, gridHeightPx - colHeaderOffsetPx);
  const rowHeightPx = rowsAreaHeightPx / perCol;

  const results: Record<number, QuestionScanResult> = {};
  const markedAnswers: Record<number, string> = {};
  const uncertainQuestions: number[] = [];

  let filledCount = 0;
  let emptyCount = 0;
  let multipleCount = 0;
  let confidenceSum = 0;

  const bubbleRadius = Math.max(
    4,
    Math.min(rowHeightPx * 0.38, (colWidthPx * 0.72) / (optionsCount * 2.4))
  );

  // 4. Sample each question and option bubble
  for (let c = 0; c < colsCount; c++) {
    const colStartX = gridLeftPx + c * colStepX;
    // Left ~23% of each column is the Question Number ("Q.No."); remaining ~77% holds the options evenly spaced
    const optionsStartX = colStartX + colWidthPx * 0.23;
    const optionsAreaW = colWidthPx * 0.75;
    const optSlotW = optionsAreaW / optionsCount;

    for (let r = 0; r < perCol; r++) {
      const qIdx = c * perCol + r;
      if (qIdx >= questionsCount) break;
      const qNum = (config.startingQuestionNumber || 1) + qIdx;

      const cy = rowsAreaTopPx + (r + 0.5) * rowHeightPx;
      const optionDarkness: Record<string, number> = {};
      const optionCenters: Record<string, { cx: number; cy: number }> = {};

      for (let o = 0; o < optionsCount; o++) {
        const label = optionLabels[o] || String.fromCharCode(65 + o);
        const cx = optionsStartX + (o + 0.5) * optSlotW;
        optionCenters[label] = { cx, cy };

        // Sample interior pixels vs local background ring to measure relative bubble fill
        const innerR = Math.max(3, bubbleRadius * 0.82);
        const outerRMin = bubbleRadius * 1.15;
        const outerRMax = bubbleRadius * 1.55;

        let innerDarkSum = 0;
        let innerDarkPixels = 0;
        let innerTotal = 0;

        let ringLumSum = 0;
        let ringTotal = 0;

        const minY = Math.max(0, Math.floor(cy - outerRMax));
        const maxY = Math.min(height - 1, Math.ceil(cy + outerRMax));
        const minX = Math.max(0, Math.floor(cx - outerRMax));
        const maxX = Math.min(width - 1, Math.ceil(cx + outerRMax));

        for (let py = minY; py <= maxY; py++) {
          const dy = py - cy;
          const rowOff = py * width;
          for (let px = minX; px <= maxX; px++) {
            const dx = px - cx;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const lum = gray[rowOff + px];

            if (dist <= innerR) {
              innerTotal++;
              const darkness = (255 - lum) / 255;
              innerDarkSum += darkness;
              if (lum < 145) {
                innerDarkPixels++;
              }
            } else if (dist >= outerRMin && dist <= outerRMax) {
              ringLumSum += lum;
              ringTotal++;
            }
          }
        }

        const localBgLum = ringTotal > 0 ? ringLumSum / ringTotal : 235;
        const meanInnerLum = innerTotal > 0 ? 255 - (innerDarkSum / innerTotal) * 255 : 235;
        const relativeDrop = Math.max(0, (localBgLum - meanInnerLum) / Math.max(100, localBgLum));
        const darkDensity = innerTotal > 0 ? innerDarkPixels / innerTotal : 0;

        // Combined darkness score (balances printed bubble outline vs filled ink interior)
        // Subtract baseline printed ring/letter darkness (~0.10)
        const rawScore = relativeDrop * 0.55 + darkDensity * 0.45;
        const adjustedScore = Math.max(0, Math.min(1, (rawScore - 0.08) / 0.72));
        optionDarkness[label] = Number(adjustedScore.toFixed(3));
      }

      // Rank options by darkness
      const sorted = Object.entries(optionDarkness).sort((a, b) => b[1] - a[1]);
      const [bestLabel, bestScore] = sorted[0];
      const [, secondScore] = sorted[1] || ['', 0];

      const filledOpts = sorted
        .filter(([, score]) => score >= filledThreshold)
        .map(([lbl]) => lbl);

      let status: BubbleClassificationStatus = 'empty';
      let markedOption = '';
      let confidence = 95;
      let needsReview = false;

      if (filledOpts.length > 1 || (bestScore >= filledThreshold && secondScore >= bestScore * 0.78)) {
        // Multiple bubbles darkened
        status = 'multiple';
        markedOption = bestLabel;
        needsReview = true;
        multipleCount++;
        uncertainQuestions.push(qNum);
        confidence = Math.max(30, Math.round((1 - secondScore / Math.max(0.01, bestScore)) * 100));
      } else if (filledOpts.length === 1) {
        // Single clearly filled bubble
        status = 'filled';
        markedOption = bestLabel;
        filledCount++;
        const separation = bestScore - secondScore;
        confidence = Math.min(99, Math.max(68, Math.round(65 + separation * 75)));
      } else if (bestScore >= uncertainThreshold) {
        // Faint or ambiguous mark
        status = 'low-confidence';
        markedOption = bestLabel;
        needsReview = true;
        uncertainQuestions.push(qNum);
        confidence = Math.max(40, Math.round((bestScore / filledThreshold) * 70));
      } else {
        // Blank / unattempted
        status = 'empty';
        markedOption = '';
        emptyCount++;
        confidence = Math.min(99, Math.round((1 - bestScore / filledThreshold) * 100));
      }

      if (markedOption && status !== 'empty') {
        markedAnswers[qNum] = markedOption;
      }

      confidenceSum += confidence;

      results[qNum] = {
        questionNo: qNum,
        status,
        markedOption,
        detectedOptions: filledOpts.length > 0 ? filledOpts : bestScore >= uncertainThreshold ? [bestLabel] : [],
        optionDarkness,
        confidence,
        needsReview,
      };

      // Draw visual overlay markers on annotCanvas
      for (let o = 0; o < optionsCount; o++) {
        const label = optionLabels[o] || String.fromCharCode(65 + o);
        const center = optionCenters[label];
        if (!center) continue;

        annotCtx.beginPath();
        annotCtx.arc(center.cx, center.cy, bubbleRadius + 1.5, 0, Math.PI * 2);

        if (status === 'multiple' && optionDarkness[label] >= uncertainThreshold) {
          annotCtx.strokeStyle = '#ef4444'; // Red for double-bubbled
          annotCtx.lineWidth = 2.2;
          annotCtx.fillStyle = 'rgba(239, 68, 68, 0.24)';
          annotCtx.fill();
          annotCtx.stroke();
        } else if (status === 'low-confidence' && label === markedOption) {
          annotCtx.strokeStyle = '#f59e0b'; // Amber for faint/uncertain
          annotCtx.lineWidth = 2.2;
          annotCtx.fillStyle = 'rgba(245, 158, 11, 0.24)';
          annotCtx.fill();
          annotCtx.stroke();
        } else if (status === 'filled' && label === markedOption) {
          annotCtx.strokeStyle = '#10b981'; // Emerald for confident fill
          annotCtx.lineWidth = 2.2;
          annotCtx.fillStyle = 'rgba(16, 185, 129, 0.24)';
          annotCtx.fill();
          annotCtx.stroke();
        } else {
          annotCtx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
          annotCtx.lineWidth = 0.8;
          annotCtx.stroke();
        }
      }
    }
  }

  const totalSampled = Math.max(1, Object.keys(results).length);
  const averageConfidence = Math.round(confidenceSum / totalSampled);

  return {
    results,
    markedAnswers,
    annotatedImageUrl: annotCanvas.toDataURL('image/jpeg', 0.92),
    normalizedImageUrl: workCanvas.toDataURL('image/jpeg', 0.92),
    detectedBounds: activeBounds,
    cornersDetected: cornersFound,
    averageConfidence,
    uncertainQuestions,
    filledCount,
    emptyCount,
    multipleCount,
  };
}

/**
 * Generates a realistic high-resolution filled OMR sheet image on an HTML5 Canvas
 * so users can test the real pixel scanner even without a physical printed sheet in front of their camera.
 */
export function generateSampleFilledOMRImage(
  config: OMRConfig,
  answerKey: Record<number, string> = {}
): { dataUrl: string; groundTruthAnswers: Record<number, string> } {
  const width = 900;
  const height = 1273; // A4 aspect ratio
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Paper background
  ctx.fillStyle = '#fdfdfd';
  ctx.fillRect(0, 0, width, height);

  // Corner registration marks
  ctx.fillStyle = '#0f172a';
  const markSize = 20;
  ctx.fillRect(18, 18, markSize, markSize);
  ctx.fillRect(width - 18 - markSize, 18, markSize, markSize);
  ctx.fillRect(18, height - 18 - markSize, markSize, markSize);
  ctx.fillRect(width - 18 - markSize, height - 18 - markSize, markSize, markSize);

  // Outer frame
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3;
  ctx.strokeRect(34, 34, width - 68, height - 68);

  // Header block
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(config.header?.schoolName || 'OMRWALLAH NATIONAL MOCK TEST', width / 2, 74);

  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#334155';
  ctx.fillText(
    `${config.header?.examName || 'Competitive Assessment'} • ${config.questionsCount} Questions`,
    width / 2,
    98
  );

  // Candidate & Roll Number box
  const bounds = getDefaultGridBounds(config);
  const rollBottomY = Math.round(bounds.top * height) - 14;
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(42, 114, width - 84, Math.max(40, rollBottomY - 114));

  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#475569';
  ctx.textAlign = 'left';
  ctx.fillText('CANDIDATE: SAMPLE FILLED OMR SHEET (REAL PIXEL SCAN TEST)', 56, 140);
  ctx.fillText('ROLL NO: 20250891   |   SET: A   |   USE BLACK/BLUE BALL PEN', 56, 164);

  // Questions grid geometry matching getDefaultGridBounds
  const questionsCount = config.questionsCount;
  const optionsCount = config.optionsCount || 4;
  const optionLabels =
    config.optionLabels && config.optionLabels.length >= optionsCount
      ? config.optionLabels
      : ['A', 'B', 'C', 'D', 'E'].slice(0, optionsCount);

  let colsCount = 2;
  if (config.layoutColumns === 'auto') {
    if (questionsCount <= 30) colsCount = 1;
    else if (questionsCount <= 75) colsCount = 2;
    else if (questionsCount <= 130) colsCount = 3;
    else colsCount = 4;
  } else {
    colsCount = parseInt(String(config.layoutColumns), 10) || 2;
  }

  const perCol = Math.ceil(questionsCount / colsCount);
  const gridLeftPx = bounds.left * width;
  const gridRightPx = bounds.right * width;
  const gridTopPx = bounds.top * height;
  const gridBottomPx = bounds.bottom * height;
  const gridWidthPx = gridRightPx - gridLeftPx;
  const gridHeightPx = gridBottomPx - gridTopPx;

  const colGapRatio = questionsCount >= 150 ? 0.012 : 0.016;
  const totalGapW = gridWidthPx * colGapRatio * Math.max(0, colsCount - 1);
  const colWidthPx = (gridWidthPx - totalGapW) / colsCount;
  const colStepX = colsCount > 1 ? (gridWidthPx - colWidthPx) / (colsCount - 1) : 0;

  const colHeaderOffsetPx = Math.min(24, gridHeightPx * 0.032);
  const rowsAreaTopPx = gridTopPx + colHeaderOffsetPx;
  const rowsAreaHeightPx = gridHeightPx - colHeaderOffsetPx;
  const rowHeightPx = rowsAreaHeightPx / perCol;
  const bubbleRadius = Math.max(
    4.5,
    Math.min(rowHeightPx * 0.36, (colWidthPx * 0.72) / (optionsCount * 2.4))
  );

  const groundTruthAnswers: Record<number, string> = {};

  for (let c = 0; c < colsCount; c++) {
    const colStartX = gridLeftPx + c * colStepX;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(colStartX, gridTopPx, colWidthPx, gridHeightPx);

    // Column Header
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(colStartX, gridTopPx, colWidthPx, colHeaderOffsetPx);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Q.No', colStartX + colWidthPx * 0.11, gridTopPx + colHeaderOffsetPx * 0.7);

    const optionsStartX = colStartX + colWidthPx * 0.23;
    const optionsAreaW = colWidthPx * 0.75;
    const optSlotW = optionsAreaW / optionsCount;

    for (let o = 0; o < optionsCount; o++) {
      const lbl = optionLabels[o];
      const cx = optionsStartX + (o + 0.5) * optSlotW;
      ctx.fillText(lbl, cx, gridTopPx + colHeaderOffsetPx * 0.7);
    }

    for (let r = 0; r < perCol; r++) {
      const qIdx = c * perCol + r;
      if (qIdx >= questionsCount) break;
      const qNum = (config.startingQuestionNumber || 1) + qIdx;
      const cy = rowsAreaTopPx + (r + 0.5) * rowHeightPx;

      // Alternating row tint
      if (qNum % 2 === 0) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(colStartX + 1, rowsAreaTopPx + r * rowHeightPx, colWidthPx - 2, rowHeightPx);
      }

      // Question number
      ctx.fillStyle = '#1e293b';
      ctx.font = `bold ${Math.max(8, Math.min(11, Math.floor(rowHeightPx * 0.55)))}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(qNum), colStartX + colWidthPx * 0.11, cy);

      // Decide which option is darkened on this sample sheet:
      // 80% match answerKey (if provided) or deterministic pattern, 12% wrong option, 8% left blank
      const keyOpt = answerKey[qNum] || optionLabels[(qNum * 3 + c) % optionsCount];
      let chosenOpt = '';
      if (qNum % 13 === 0) {
        chosenOpt = ''; // Leave blank to test unattempted detection
      } else if (qNum % 7 === 0) {
        // Pick a different option to test wrong-answer evaluation
        const altIdx = (optionLabels.indexOf(keyOpt) + 1) % optionsCount;
        chosenOpt = optionLabels[altIdx];
      } else {
        chosenOpt = keyOpt;
      }

      if (chosenOpt) {
        groundTruthAnswers[qNum] = chosenOpt;
      }

      for (let o = 0; o < optionsCount; o++) {
        const lbl = optionLabels[o];
        const cx = optionsStartX + (o + 0.5) * optSlotW;

        ctx.beginPath();
        ctx.arc(cx, cy, bubbleRadius, 0, Math.PI * 2);

        if (lbl === chosenOpt) {
          // Darken with realistic dark ballpoint ink
          ctx.fillStyle = '#111827';
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  return {
    dataUrl: canvas.toDataURL('image/jpeg', 0.94),
    groundTruthAnswers,
  };
}
