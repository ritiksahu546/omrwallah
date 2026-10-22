import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  ScanLine,
  CheckCircle2,
  AlertCircle,
  Key,
  Sparkles,
  RefreshCw,
  FileCheck,
  ArrowRight,
  RotateCw,
  RotateCcw,
  Sliders,
  Eye,
  SwitchCamera,
  Check,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { TEMPLATES_DATA, DEFAULT_OMR_CONFIG } from '../data/templates';
import { TestResult, OMRConfig } from '../types/omr';
import {
  analyzeOMRImage,
  generateSampleFilledOMRImage,
  getDefaultGridBounds,
  GridCalibrationBounds,
  OMRScanAnalysisOutput,
} from '../utils/omrImageProcessor';
import { loadAppSettings, saveAppSettings } from '../utils/appSettings';

interface ScanOMRPageProps {
  onScanComplete: (result: TestResult) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const MARKING_SCHEMES = [
  { id: '4_-1', label: 'NEET / JEE (+4, -1)', correct: 4, wrong: -1 },
  { id: '2_-0.5', label: 'UPSC / SSC (+2, -0.5)', correct: 2, wrong: -0.5 },
  { id: '1_-0.25', label: 'Banking / Railway (+1, -0.25)', correct: 1, wrong: -0.25 },
  { id: '1_0', label: 'School / No Negative (+1, 0)', correct: 1, wrong: 0 },
];

export const ScanOMRPage: React.FC<ScanOMRPageProps> = ({
  onScanComplete,
  showToast,
}) => {
  const savedSettings = loadAppSettings();

  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES_DATA[0].id);
  const [scanMode, setScanMode] = useState<'upload' | 'camera'>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Scanner sensitivity & calibration
  const [sensitivity, setSensitivity] = useState<'lenient' | 'medium' | 'strict'>(
    savedSettings.scannerSensitivity
  );
  const [markingSchemeId, setMarkingSchemeId] = useState<string>(() => {
    if (savedSettings.defaultMarkingCorrect === 2) return '2_-0.5';
    if (savedSettings.defaultMarkingCorrect === 1 && savedSettings.defaultMarkingWrong === 0) return '1_0';
    return '4_-1';
  });
  const [showCalibration, setShowCalibration] = useState(false);
  const [customBounds, setCustomBounds] = useState<GridCalibrationBounds | undefined>(undefined);
  const [showAnnotatedOverlay, setShowAnnotatedOverlay] = useState(true);

  // Scan analysis output & manual override state
  const [analysisOutput, setAnalysisOutput] = useState<OMRScanAnalysisOutput | null>(null);
  const [reviewedAnswers, setReviewedAnswers] = useState<Record<number, string>>({});
  const [reviewFilter, setReviewFilter] = useState<'all' | 'uncertain' | 'filled' | 'empty'>('all');

  const selectedTemplate =
    TEMPLATES_DATA.find((t) => t.id === selectedTemplateId) || TEMPLATES_DATA[0];
  const activeConfig: OMRConfig = selectedTemplate?.config || DEFAULT_OMR_CONFIG;
  const totalQuestions = selectedTemplate?.questions || activeConfig.questionsCount || 30;
  const optionsCount = activeConfig.optionsCount || 4;
  const optionLabels =
    activeConfig.optionLabels && activeConfig.optionLabels.length >= optionsCount
      ? activeConfig.optionLabels.slice(0, optionsCount)
      : ['A', 'B', 'C', 'D', 'E'].slice(0, optionsCount);

  // Answer key state persisted per template
  const [answerKey, setAnswerKey] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem(`omrwallah_scan_key_${selectedTemplateId}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial: Record<number, string> = {};
    for (let i = 1; i <= 200; i++) {
      initial[i] = ['A', 'B', 'C', 'D'][(i * 3) % 4];
    }
    return initial;
  });

  const [showAnswerKeyEditor, setShowAnswerKeyEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera stream helper
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Start real camera stream when in camera mode
  const startCameraStream = useCallback(async () => {
    stopCameraStream();
    setCameraError(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        'Camera API is not available in this browser or context. Please use Upload Image mode.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 1700 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access failed:', err);
      setCameraError(
        err?.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in your browser settings or upload an OMR photo.'
          : 'Could not access camera device. Please upload an image of your OMR sheet instead.'
      );
    }
  }, [facingMode, stopCameraStream]);

  useEffect(() => {
    if (scanMode === 'camera' && !uploadedImage) {
      startCameraStream();
    } else {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [scanMode, uploadedImage, startCameraStream, stopCameraStream]);

  // Attach stream to video element when mounted
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  // Reset custom bounds when template changes
  useEffect(() => {
    setCustomBounds(undefined);
    setAnalysisOutput(null);
  }, [selectedTemplateId]);

  // Save answer key changes to localStorage
  const handleUpdateAnswerKey = (qNum: number, opt: string) => {
    setAnswerKey((prev) => {
      const next = { ...prev, [qNum]: opt };
      try {
        localStorage.setItem(`omrwallah_scan_key_${selectedTemplateId}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Validate and load uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|bmp)$/i)) {
      showToast('Invalid file format. Please upload a PNG, JPG, or WebP image.', 'error');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('Image file is too large (max 15 MB). Please choose a smaller image.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setRotationDeg(0);
      setAnalysisOutput(null);
      showToast('OMR sheet image loaded! Click "Analyze & Detect Bubbles" to scan.', 'info');
    };
    reader.onerror = () => {
      showToast('Failed to read image file. Please try another file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Capture frame from live camera video
  const handleCaptureCameraFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const vw = video.videoWidth || 900;
    const vh = video.videoHeight || 1200;

    const canvas = document.createElement('canvas');
    canvas.width = vw;
    canvas.height = vh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, vw, vh);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.94);
    stopCameraStream();
    setUploadedImage(dataUrl);
    setRotationDeg(0);
    setAnalysisOutput(null);
    showToast('Camera frame captured! Ready to analyze bubbles.', 'success');
  };

  // Generate a realistic filled sample OMR image for this template so user can test real pixel scanning
  const handleLoadSampleFilledSheet = () => {
    const { dataUrl } = generateSampleFilledOMRImage(activeConfig, answerKey);
    setUploadedImage(dataUrl);
    setRotationDeg(0);
    setCustomBounds(undefined);
    setAnalysisOutput(null);
    showToast(
      `Loaded realistic ${totalQuestions}-question filled OMR sheet! Click "Analyze & Detect Bubbles" to run pixel detection.`,
      'info'
    );
  };

  // Run the real HTML5 Canvas pixel OMR analysis
  const runImageAnalysis = async (
    imgUrl = uploadedImage,
    rot = rotationDeg,
    sens = sensitivity,
    bounds = customBounds
  ) => {
    if (!imgUrl) {
      showToast('Please upload or capture an OMR sheet image first.', 'error');
      return;
    }

    setIsScanning(true);
    try {
      const output = await analyzeOMRImage({
        imageDataUrl: imgUrl,
        rotationDeg: rot,
        config: activeConfig,
        sensitivity: sens,
        autoStraighten: savedSettings.autoStraighten,
        customBounds: bounds,
      });

      setAnalysisOutput(output);
      setReviewedAnswers(output.markedAnswers);
      if (!bounds) {
        setCustomBounds(output.detectedBounds);
      }

      const uncertainMsg =
        output.uncertainQuestions.length > 0
          ? ` (${output.uncertainQuestions.length} uncertain/multi-marked flagged for review)`
          : '';
      showToast(
        `Detected ${output.filledCount} filled bubbles with ${output.averageConfidence}% avg confidence${uncertainMsg}.`,
        output.uncertainQuestions.length > 0 ? 'info' : 'success'
      );
    } catch (err: any) {
      console.error('OMR analysis error:', err);
      showToast(err?.message || 'Could not analyze image. Please try a clearer image.', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  // Rotate image and re-run analysis if already scanned
  const handleRotate = (delta: number) => {
    const nextRot = (rotationDeg + delta + 360) % 360;
    setRotationDeg(nextRot);
    if (analysisOutput && uploadedImage) {
      runImageAnalysis(uploadedImage, nextRot, sensitivity, customBounds);
    }
  };

  // Toggle or override a single question's detected answer during manual review
  const handleOverrideAnswer = (qNum: number, opt: string) => {
    setReviewedAnswers((prev) => {
      const next = { ...prev };
      if (next[qNum] === opt) {
        delete next[qNum];
      } else {
        next[qNum] = opt;
      }
      return next;
    });
  };

  // Finalize evaluation and compute scorecard with selected marking scheme
  const handleCompleteEvaluation = () => {
    const scheme =
      MARKING_SCHEMES.find((s) => s.id === markingSchemeId) || MARKING_SCHEMES[0];

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    for (let qNum = 1; qNum <= totalQuestions; qNum++) {
      const studentAns = reviewedAnswers[qNum] || '';
      const correctAns = answerKey[qNum] || 'A';

      if (!studentAns) {
        unattemptedCount++;
      } else if (studentAns === correctAns) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }

    const rawScore = Number(
      (correctCount * scheme.correct + wrongCount * scheme.wrong).toFixed(2)
    );
    const maxScore = totalQuestions * scheme.correct;
    const accuracy =
      correctCount + wrongCount > 0
        ? Math.round((correctCount / (correctCount + wrongCount)) * 100)
        : 0;

    // Build section breakdown if template has sections
    const sectionPerformance =
      activeConfig.sections && activeConfig.sections.length > 0
        ? activeConfig.sections.map((sec) => {
            const startQ = sec.startQuestion || (sec as any).startQ || 1;
            const endQ = sec.endQuestion || (sec as any).endQ || totalQuestions;
            let sCorrect = 0;
            let sWrong = 0;
            let sUnattempted = 0;
            for (let q = startQ; q <= Math.min(totalQuestions, endQ); q++) {
              const sAns = reviewedAnswers[q] || '';
              const cAns = answerKey[q] || 'A';
              if (!sAns) sUnattempted++;
              else if (sAns === cAns) sCorrect++;
              else sWrong++;
            }
            const sScore = Number(
              (sCorrect * scheme.correct + sWrong * scheme.wrong).toFixed(2)
            );
            const sMax = (Math.min(totalQuestions, endQ) - startQ + 1) * scheme.correct;
            const sAcc =
              sCorrect + sWrong > 0
                ? Math.round((sCorrect / (sCorrect + sWrong)) * 100)
                : 0;
            return {
              sectionName: sec.name,
              totalQuestions: Math.min(totalQuestions, endQ) - startQ + 1,
              correct: sCorrect,
              wrong: sWrong,
              unattempted: sUnattempted,
              score: sScore,
              maxScore: sMax,
              accuracy: sAcc,
            };
          })
        : undefined;

    const result: TestResult = {
      id: `scan-${Date.now()}`,
      sheetId: selectedTemplateId,
      testName: `${selectedTemplate?.name || 'OMR Sheet'} (Scanned)`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      totalQuestions,
      attempted: correctCount + wrongCount,
      correct: correctCount,
      wrong: wrongCount,
      unattempted: unattemptedCount,
      score: rawScore,
      maxScore,
      accuracy,
      timeTaken: 'Scanned Sheet',
      answers: reviewedAnswers,
      answerKey: { ...answerKey },
      sectionPerformance,
    };

    showToast('OMR evaluation completed and saved to your Results!', 'success');
    onScanComplete(result);
  };

  const activeBounds = customBounds || getDefaultGridBounds(activeConfig);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optical Pixel Darkness & Registration Mark Scanner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Scan & Evaluate OMR Sheet
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Upload a photo or capture via camera to detect darkened bubbles, review uncertain marks, and grade against your answer key.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSampleFilledSheet}
            className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>Load Sample Filled Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAnswerKeyEditor(!showAnswerKeyEditor)}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <Key className="w-4 h-4 text-blue-600" />
            <span>{showAnswerKeyEditor ? 'Hide Answer Key' : `Edit Answer Key (${totalQuestions} Qs)`}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Answer Key Editor */}
      {showAnswerKeyEditor && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Configure Official Answer Key ({totalQuestions} Questions)
              </h3>
              <p className="text-xs text-slate-500">
                Set the correct options (A–D) before or after scanning. Automatically saved for this template.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              Key Active ({totalQuestions} Qs)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2.5 max-h-64 overflow-y-auto p-1">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={qNum}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-col items-center gap-1.5"
                >
                  <span className="text-[11px] font-mono font-bold text-slate-600">
                    Q.{qNum}
                  </span>
                  <div className="flex gap-1">
                    {optionLabels.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleUpdateAnswerKey(qNum, opt)}
                        className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors cursor-pointer ${
                          answerKey[qNum] === opt
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration & Guidelines */}
        <div className="lg:col-span-5 space-y-5">
          {/* Step 1: Template, Marking Scheme & Sensitivity */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-black">
                1
              </span>
              <span>Sheet Layout & Grading Scheme</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target OMR Template Layout
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                {TEMPLATES_DATA.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.questions} Questions)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Marking Scheme
                </label>
                <select
                  value={markingSchemeId}
                  onChange={(e) => setMarkingSchemeId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                >
                  {MARKING_SCHEMES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Darkness Threshold
                </label>
                <select
                  value={sensitivity}
                  onChange={(e) => {
                    const nextSens = e.target.value as 'lenient' | 'medium' | 'strict';
                    setSensitivity(nextSens);
                    saveAppSettings({ ...savedSettings, scannerSensitivity: nextSens });
                    if (uploadedImage && analysisOutput) {
                      runImageAnalysis(uploadedImage, rotationDeg, nextSens, customBounds);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                >
                  <option value="lenient">Lenient (Faint Pencil / Light Ink)</option>
                  <option value="medium">Balanced (Standard Ball Pen)</option>
                  <option value="strict">Strict (Heavy Dark Fill Only)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Grid Geometry:</span>
              <span className="font-bold text-slate-900">
                {totalQuestions} Qs • {optionsCount} Options ({optionLabels.join('/')})
              </span>
            </div>
          </div>

          {/* Step 2: Capture Method */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-black">
                2
              </span>
              <span>Capture or Upload Sheet</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setScanMode('upload')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  scanMode === 'upload'
                    ? 'bg-blue-50/70 border-blue-600 text-blue-950 ring-2 ring-blue-500/15'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Upload className={`w-5 h-5 ${scanMode === 'upload' ? 'text-blue-600' : 'text-slate-500'}`} />
                <div className="font-bold text-xs">Upload Image</div>
                <div className="text-[11px] text-slate-500">JPG, PNG, WebP</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadedImage(null);
                  setAnalysisOutput(null);
                  setScanMode('camera');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  scanMode === 'camera'
                    ? 'bg-blue-50/70 border-blue-600 text-blue-950 ring-2 ring-blue-500/15'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Camera className={`w-5 h-5 ${scanMode === 'camera' ? 'text-blue-600' : 'text-slate-500'}`} />
                <div className="font-bold text-xs">Live Camera</div>
                <div className="text-[11px] text-slate-500">Webcam / Mobile Cam</div>
              </button>
            </div>
          </div>

          {/* Grid Calibration Controls (when image is loaded) */}
          {uploadedImage && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Grid Alignment & Calibration</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCalibration((prev) => !prev)}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  {showCalibration ? 'Hide Sliders' : 'Adjust Grid Box'}
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                If your photo is cropped or zoomed, adjust the dashed blue question-grid boundary so the sample circles align over your sheet's bubbles.
              </p>

              {showCalibration && (
                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Grid Top</span>
                        <span>{Math.round(activeBounds.top * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={60}
                        value={Math.round(activeBounds.top * 100)}
                        onChange={(e) =>
                          setCustomBounds({
                            ...activeBounds,
                            top: Number(e.target.value) / 100,
                          })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Grid Bottom</span>
                        <span>{Math.round(activeBounds.bottom * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={55}
                        max={98}
                        value={Math.round(activeBounds.bottom * 100)}
                        onChange={(e) =>
                          setCustomBounds({
                            ...activeBounds,
                            bottom: Number(e.target.value) / 100,
                          })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Grid Left</span>
                        <span>{Math.round(activeBounds.left * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={35}
                        value={Math.round(activeBounds.left * 100)}
                        onChange={(e) =>
                          setCustomBounds({
                            ...activeBounds,
                            left: Number(e.target.value) / 100,
                          })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Grid Right</span>
                        <span>{Math.round(activeBounds.right * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={65}
                        max={99}
                        value={Math.round(activeBounds.right * 100)}
                        onChange={(e) =>
                          setCustomBounds({
                            ...activeBounds,
                            right: Number(e.target.value) / 100,
                          })
                        }
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const def = getDefaultGridBounds(activeConfig);
                        setCustomBounds(def);
                        runImageAnalysis(uploadedImage, rotationDeg, sensitivity, def);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      Reset Default Bounds
                    </button>
                    <button
                      type="button"
                      onClick={() => runImageAnalysis(uploadedImage, rotationDeg, sensitivity, activeBounds)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                    >
                      Re-Scan With New Bounds
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Scanning Tips */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Tips for 99%+ Detection Accuracy</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Ensure all 4 black corner registration squares are visible inside the frame.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Place the sheet on a flat surface under even lighting without harsh shadows.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Double-bubbled or faint marks are automatically flagged in amber/red for your review before grading.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Viewport, Pixel Scanner & Interactive Bubble Verification */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between min-h-[440px] shadow-xs relative overflow-hidden">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Viewport Area */}
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/70 p-4 relative overflow-hidden min-h-[340px]">
              {uploadedImage ? (
                <div className="relative w-full flex flex-col items-center">
                  {/* Top Image Toolbar */}
                  <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRotate(-90)}
                        className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="Rotate 90° Counter-Clockwise"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>-90°</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRotate(90)}
                        className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="Rotate 90° Clockwise"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>+90°</span>
                      </button>
                      {analysisOutput && (
                        <button
                          type="button"
                          onClick={() => setShowAnnotatedOverlay((p) => !p)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer border ${
                            showAnnotatedOverlay
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{showAnnotatedOverlay ? 'Overlay: ON' : 'Overlay: OFF'}</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={uploadedImage}
                        download={`OMR-Sheet-${selectedTemplateId}.jpg`}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1"
                        title="Download Sheet Image"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImage(null);
                          setAnalysisOutput(null);
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>

                  {/* Sheet Image Display */}
                  <div className="relative max-h-[420px] overflow-auto rounded-lg border border-slate-300 bg-white shadow-sm flex justify-center">
                    <img
                      src={
                        analysisOutput
                          ? showAnnotatedOverlay
                            ? analysisOutput.annotatedImageUrl
                            : analysisOutput.normalizedImageUrl
                          : uploadedImage
                      }
                      alt="Uploaded OMR Sheet"
                      style={
                        !analysisOutput && rotationDeg !== 0
                          ? { transform: `rotate(${rotationDeg}deg)` }
                          : undefined
                      }
                      className="max-h-[400px] w-auto object-contain transition-transform"
                    />
                  </div>

                  {/* Legend for overlay colors */}
                  {analysisOutput && (
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-500/30 border-2 border-emerald-600 inline-block" />
                        Filled ({analysisOutput.filledCount})
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-amber-500/30 border-2 border-amber-500 inline-block" />
                        Faint / Low Conf
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/30 border-2 border-red-600 inline-block" />
                        Multiple Marked ({analysisOutput.multipleCount})
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-slate-400 inline-block" />
                        Blank ({analysisOutput.emptyCount})
                      </span>
                    </div>
                  )}
                </div>
              ) : scanMode === 'upload' ? (
                <div className="text-center space-y-4 max-w-sm py-8">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      Drop your OMR sheet image here
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Upload a photo of your filled OMR sheet or load a sample filled sheet to test pixel bubble grading.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Browse Image File
                    </button>
                    <button
                      type="button"
                      onClick={handleLoadSampleFilledSheet}
                      className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Try Sample Filled OMR
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3 w-full max-w-md py-2">
                  <div className="w-full aspect-[3/4] max-h-[360px] bg-slate-900 rounded-xl border-2 border-slate-800 flex flex-col items-center justify-center text-white relative overflow-hidden mx-auto">
                    {cameraError ? (
                      <div className="p-6 text-center space-y-3">
                        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                        <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
                        <div className="flex flex-wrap justify-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={startCameraStream}
                            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Retry Camera
                          </button>
                          <button
                            type="button"
                            onClick={() => setScanMode('upload')}
                            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Switch to File Upload
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        {/* Corner Frame Alignment Guide Overlay */}
                        <div className="absolute inset-5 border border-dashed border-cyan-400/60 rounded-lg pointer-events-none">
                          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-cyan-400" />
                          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-cyan-400" />
                          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-cyan-400" />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-cyan-400" />
                        </div>

                        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setFacingMode((prev) =>
                                prev === 'environment' ? 'user' : 'environment'
                              )
                            }
                            className="px-3 py-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs cursor-pointer"
                          >
                            <SwitchCamera className="w-4 h-4 text-cyan-400" />
                            <span>Flip Cam</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleCaptureCameraFrame}
                            disabled={!cameraActive}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 cursor-pointer"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Capture OMR Frame</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  {analysisOutput
                    ? `Analyzed ${totalQuestions} Qs • ${analysisOutput.filledCount} filled, ${analysisOutput.uncertainQuestions.length} uncertain`
                    : `Ready to analyze ${selectedTemplate?.name} (${totalQuestions} Qs)`}
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                {uploadedImage && (
                  <button
                    type="button"
                    disabled={isScanning}
                    onClick={() => runImageAnalysis()}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      analysisOutput
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                    }`}
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Scanning Pixels...</span>
                      </>
                    ) : (
                      <>
                        <ScanLine className="w-4 h-4" />
                        <span>{analysisOutput ? 'Re-Analyze Sheet' : 'Analyze & Detect Bubbles'}</span>
                      </>
                    )}
                  </button>
                )}

                {analysisOutput && (
                  <button
                    type="button"
                    onClick={handleCompleteEvaluation}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Finalize & View Scorecard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Post-Scan Bubble Verification & Manual Override Card */}
          {analysisOutput && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <span>Detected Bubbles & Manual Review</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {analysisOutput.averageConfidence}% Confidence
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any option bubble below to manually correct or override before generating your final scorecard.
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold self-start">
                  {(
                    [
                      { id: 'all', label: `All (${totalQuestions})` },
                      {
                        id: 'uncertain',
                        label: `Review (${analysisOutput.uncertainQuestions.length})`,
                      },
                      { id: 'filled', label: `Filled (${Object.keys(reviewedAnswers).length})` },
                      {
                        id: 'empty',
                        label: `Blank (${totalQuestions - Object.keys(reviewedAnswers).length})`,
                      },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setReviewFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        reviewFilter === tab.id
                          ? 'bg-white text-blue-600 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {analysisOutput.uncertainQuestions.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-2 text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>{analysisOutput.uncertainQuestions.length} question(s)</strong> had faint or multiple darkened bubbles (Q.{analysisOutput.uncertainQuestions.slice(0, 8).join(', Q.')}
                      {analysisOutput.uncertainQuestions.length > 8 ? '...' : ''}). Please verify them below.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReviewFilter('uncertain')}
                    className="font-bold text-amber-800 underline shrink-0 cursor-pointer"
                  >
                    Show Uncertain
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-80 overflow-y-auto p-1">
                {Array.from({ length: totalQuestions }).map((_, idx) => {
                  const qNum = idx + 1;
                  const qScan = analysisOutput.results[qNum];
                  const currentAns = reviewedAnswers[qNum] || '';
                  const isUncertain = qScan?.needsReview;

                  if (reviewFilter === 'uncertain' && !isUncertain) return null;
                  if (reviewFilter === 'filled' && !currentAns) return null;
                  if (reviewFilter === 'empty' && currentAns) return null;

                  return (
                    <div
                      key={qNum}
                      className={`rounded-xl p-2.5 border flex flex-col gap-1.5 transition-colors ${
                        isUncertain
                          ? 'bg-amber-50/70 border-amber-300'
                          : currentAns
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-black text-slate-800">Q.{qNum}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            qScan?.status === 'multiple'
                              ? 'bg-red-100 text-red-700'
                              : qScan?.status === 'low-confidence'
                              ? 'bg-amber-100 text-amber-800'
                              : currentAns
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {qScan?.status === 'multiple'
                            ? 'Multi'
                            : qScan?.status === 'low-confidence'
                            ? 'Faint'
                            : currentAns
                            ? `${qScan?.confidence || 95}%`
                            : 'Blank'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        {optionLabels.map((opt) => {
                          const isSelected = currentAns === opt;
                          const darkPct = Math.round((qScan?.optionDarkness?.[opt] || 0) * 100);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleOverrideAnswer(qNum, opt)}
                              title={`Option ${opt} (Pixel Darkness: ${darkPct}%)`}
                              className={`w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-slate-900 text-white ring-2 ring-emerald-500'
                                  : 'bg-white border border-slate-300 text-slate-700 hover:border-blue-500'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Key comparison: <strong>{MARKING_SCHEMES.find((s) => s.id === markingSchemeId)?.label}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleCompleteEvaluation}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Generate Scorecard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
