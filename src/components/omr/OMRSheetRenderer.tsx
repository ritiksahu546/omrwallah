import React, { useState, useRef, useEffect } from 'react';
import { OMRConfig } from '../../types/omr';
import { ShieldCheck, QrCode, Check, X } from 'lucide-react';

interface OMRSheetRendererProps {
  config: OMRConfig;
  interactive?: boolean;
  selectedAnswers?: Record<number, string>;
  markedAnswers?: Record<number, string>;
  onSelectAnswer?: (qNo: number, option: string) => void;
  onAnswerChange?: (qNo: number, option: string) => void;
  scale?: number;
  highlightQuestions?: Record<number, 'correct' | 'wrong' | 'skipped'>;
}

export const OMRSheetRenderer: React.FC<OMRSheetRendererProps> = ({
  config,
  interactive = false,
  selectedAnswers: propSelectedAnswers,
  markedAnswers,
  onSelectAnswer,
  onAnswerChange,
  scale = 1,
  highlightQuestions = {},
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number>(1123);

  const selectedAnswers = propSelectedAnswers || markedAnswers || {};
  const handleSelect = onSelectAnswer || onAnswerChange;
  const {
    questionsCount,
    startingQuestionNumber = 1,
    optionsCount,
    optionLabels,
    layoutColumns,
    numberingStyle,
    gridDensity = 'standard',
    enableSections,
    sections = [],
    bubble,
    header,
    enableRollNumber,
    rollNumberDigits = 7,
    rollNumberStyle = 'both',
    enableRegistrationNumber,
    registrationNumberDigits = 8,
    enableCenterCode,
    centerCodeDigits = 5,
    enableCandidateName,
    enableFatherName,
    enableSubjectExam,
    enableSetSeries,
    enableDateField,
    enableClassBatch,
    customFields = [],
    enableInstructions,
    instructions,
    enableSignatureBox,
    enableInvigilatorSign,
    footerText,
    enableQrCode,
    enableBarcode,
    enableCornerMarks = true,
    printMode = 'monochrome',
  } = config;

  // Determine actual number of columns
  let colsCount = 2;
  if (layoutColumns === 'auto') {
    if (questionsCount <= 30) colsCount = 1;
    else if (questionsCount <= 75) colsCount = 2;
    else if (questionsCount <= 130) colsCount = 3;
    else colsCount = 4;
  } else {
    colsCount = parseInt(layoutColumns, 10) || 2;
  }

  // Calculate questions per column
  const perCol = Math.ceil(questionsCount / colsCount);

  // Column arrays with starting question offset
  const columns: number[][] = [];
  for (let c = 0; c < colsCount; c++) {
    const colQuestions: number[] = [];
    for (let r = 0; r < perCol; r++) {
      const qIndex = c * perCol + r;
      const qNum = startingQuestionNumber + qIndex;
      if (qIndex < questionsCount) {
        colQuestions.push(qNum);
      }
    }
    if (colQuestions.length > 0) {
      columns.push(colQuestions);
    }
  }

  // Question numbering format
  const formatQNum = (n: number) => {
    switch (numberingStyle) {
      case 'leading-zeros':
        return n < 10 ? `0${n}` : `${n}`;
      case 'q-prefix':
        return `Q${n}`;
      case 'q-dot':
        return `Q.${n}`;
      default:
        return `${n}`;
    }
  };

  // Font family class
  const getFontFamilyClass = () => {
    switch (config.page.fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      default:
        return 'font-sans';
    }
  };

  // Bubble shape class
  const getBubbleRadius = () => {
    switch (bubble.shape) {
      case 'square':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-xs';
      case 'circle':
      default:
        return 'rounded-full';
    }
  };

  // Measure unscaled rendered sheet height so scaling container never clips questions
  useEffect(() => {
    if (!sheetRef.current) return;
    const updateSize = () => {
      if (sheetRef.current) {
        const h = sheetRef.current.scrollHeight || sheetRef.current.offsetHeight;
        if (h > 100) {
          setMeasuredHeight(h);
        }
      }
    };
    updateSize();
    const timer = setTimeout(updateSize, 80);

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateSize);
      observer.observe(sheetRef.current);
      return () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    }
    return () => clearTimeout(timer);
  }, [config, questionsCount, optionsCount, selectedAnswers]);

  // Dynamic bubble styles guaranteeing exact pixel/millimeter height budget
  const getBubbleStyle = () => {
    if (questionsCount >= 150) {
      return {
        width: '12px',
        height: '12px',
        minWidth: '12px',
        minHeight: '12px',
        maxWidth: '12px',
        maxHeight: '12px',
        fontSize: '7.5px',
        lineHeight: 1,
        padding: 0,
        boxSizing: 'border-box' as const,
      };
    }
    if (questionsCount > 100 || gridDensity === 'compact') {
      return {
        width: '13.5px',
        height: '13.5px',
        minWidth: '13.5px',
        minHeight: '13.5px',
        maxWidth: '13.5px',
        maxHeight: '13.5px',
        fontSize: '8px',
        lineHeight: 1,
        padding: 0,
        boxSizing: 'border-box' as const,
      };
    }
    if (questionsCount > 60) {
      return {
        width: '14.5px',
        height: '14.5px',
        minWidth: '14.5px',
        minHeight: '14.5px',
        maxWidth: '14.5px',
        maxHeight: '14.5px',
        fontSize: '9px',
        lineHeight: 1,
        padding: 0,
        boxSizing: 'border-box' as const,
      };
    }
    // <= 60 questions (e.g. 50 questions)
    return {
      width: '16px',
      height: '16px',
      minWidth: '16px',
      minHeight: '16px',
      maxWidth: '16px',
      maxHeight: '16px',
      fontSize: '9.5px',
      lineHeight: 1,
      padding: 0,
      boxSizing: 'border-box' as const,
    };
  };

  // Row vertical style to prevent question columns overflowing A4 height
  const getRowStyle = (qNum: number, qHighlight: string | undefined) => {
    let pad = '2px 4px';
    if (questionsCount >= 150) {
      pad = '0.5px 2px';
    } else if (questionsCount > 100 || gridDensity === 'compact') {
      pad = '1px 3px';
    } else if (questionsCount > 60) {
      pad = '1.5px 3px';
    } else {
      pad = '2px 4px';
    }

    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor:
        qHighlight === 'correct'
          ? '#ecfdf5'
          : qHighlight === 'wrong'
          ? '#fff1f2'
          : qNum % 2 === 0
          ? '#f8fafc'
          : '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: pad,
      boxSizing: 'border-box' as const,
    };
  };

  // Roll Number top box dimension style
  const getRollDigitBoxStyle = () => {
    if (questionsCount >= 150) {
      return {
        width: '15px',
        height: '17px',
        fontSize: '9px',
        marginBottom: '1px',
      };
    }
    if (questionsCount > 80) {
      return {
        width: '16px',
        height: '19px',
        fontSize: '9.5px',
        marginBottom: '1.5px',
      };
    }
    return {
      width: '18px',
      height: '21px',
      fontSize: '10px',
      marginBottom: '2px',
    };
  };

  // Roll Number 0-9 bubble dimension style
  const getRollBubbleStyle = () => {
    if (questionsCount >= 150) {
      return {
        width: '11px',
        height: '11px',
        minWidth: '11px',
        minHeight: '11px',
        fontSize: '7px',
        lineHeight: 1,
        padding: 0,
      };
    }
    if (questionsCount > 80) {
      return {
        width: '12.5px',
        height: '12.5px',
        minWidth: '12.5px',
        minHeight: '12.5px',
        fontSize: '7.5px',
        lineHeight: 1,
        padding: 0,
      };
    }
    return {
      width: '13.5px',
      height: '13.5px',
      minWidth: '13.5px',
      minHeight: '13.5px',
      fontSize: '8px',
      lineHeight: 1,
      padding: 0,
    };
  };

  // Signature box height style
  const getSigBoxHeight = () => {
    if (questionsCount >= 150) return '38px';
    if (questionsCount > 80) return '44px';
    return '50px';
  };

  // Border thickness class
  const getBorderThicknessClass = () => {
    switch (bubble.borderThickness) {
      case 'thick':
        return 'border-2';
      case 'thin':
        return 'border-[0.75px]';
      default:
        return 'border';
    }
  };

  const isMono = printMode !== 'navy';
  const strokeColor = isMono ? 'border-black' : 'border-slate-800';
  const textColor = isMono ? 'text-black' : 'text-slate-900';

  const isHighDensity = questionsCount >= 150;
  const isMidDensity = questionsCount > 80;
  const marginV = isHighDensity ? Math.min(4.5, config.page.marginTop || 4.5) : isMidDensity ? Math.min(5.5, config.page.marginTop || 5.5) : (config.page.marginTop || 6);
  const marginH = isHighDensity ? Math.min(5, config.page.marginLeft || 5) : (config.page.marginLeft || 6);

  // Helper to find section for a question
  const getSectionForQ = (qNum: number) => {
    if (!sections || sections.length === 0) return null;
    return sections.find((s) => s.startQuestion === qNum || (s as any).startQ === qNum);
  };

  const sheetContent = (
    <div
      id="printable-omr-container"
      className={`bg-white ${textColor} ${getFontFamilyClass()} select-none transition-all shadow-md relative shrink-0`}
      style={{
        width: '210mm',
        height: '297mm',
        maxHeight: '297mm',
        backgroundColor: '#ffffff',
        color: isMono ? '#000000' : '#0f172a',
        padding: `${marginV}mm ${marginH}mm`,
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Watermark Overlay (if enabled) */}
      {config.watermark?.enabled && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          style={{
            transform: 'rotate(-35deg)',
            opacity: config.watermark.opacity || 0.07,
          }}
        >
          <span className="text-6xl font-black tracking-widest text-slate-900 uppercase whitespace-nowrap">
            {config.watermark.text || 'OFFICIAL OMR'}
          </span>
        </div>
      )}

      {/* Corner Registration Timing Marks (Scanner Alignment Anchors) */}
      {enableCornerMarks && (
        <>
          <div className="absolute top-2 left-2 w-4 h-4 bg-black" aria-hidden="true" />
          <div className="absolute top-2 right-2 w-4 h-4 bg-black" aria-hidden="true" />
          <div className="absolute bottom-2 left-2 w-4 h-4 bg-black" aria-hidden="true" />
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-black" aria-hidden="true" />

          {/* Vertical Optical Timing Track (left and right alignment ticks) */}
          <div className="absolute top-16 left-2 bottom-16 flex flex-col justify-between items-center w-1.5 py-4 pointer-events-none opacity-80" aria-hidden="true">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1 bg-black" />
            ))}
          </div>
          <div className="absolute top-16 right-2 bottom-16 flex flex-col justify-between items-center w-1.5 py-4 pointer-events-none opacity-80" aria-hidden="true">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1 bg-black" />
            ))}
          </div>
        </>
      )}

      {/* Main OMR Frame Container */}
      <div
        className={`w-full h-full flex flex-col justify-between ${
          header.showBorder ? `border-2 ${strokeColor} ${isHighDensity ? 'p-1.5' : 'p-2 sm:p-2.5'}` : 'p-0.5'
        }`}
        style={{
          width: '100%',
          height: '100%',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        
        {/* ================= HEADER SECTION ================= */}
        <div className={`w-full ${isHighDensity ? 'mb-1' : 'mb-1.5'}`}>
          {/* Centered logo (if logoPosition === 'center') */}
          {header.logoPosition === 'center' && (
            <div className="flex justify-center mb-1">
              {header.logoUrl ? (
                <img
                  src={header.logoUrl}
                  alt="Institute Logo"
                  referrerPolicy="no-referrer"
                  className={`${
                    isHighDensity
                      ? 'w-8 h-8'
                      : header.logoSize === 'large'
                      ? 'w-14 h-14'
                      : header.logoSize === 'small'
                      ? 'w-8 h-8'
                      : 'w-11 h-11'
                  } object-contain border border-black p-0.5`}
                />
              ) : (
                <div className={`${
                  isHighDensity
                    ? 'w-8 h-8'
                    : header.logoSize === 'large'
                    ? 'w-14 h-14'
                    : header.logoSize === 'small'
                    ? 'w-8 h-8'
                    : 'w-11 h-11'
                } border-2 ${strokeColor} flex items-center justify-center font-black text-sm bg-slate-50`}>
                  <ShieldCheck className="w-6 h-6 text-black stroke-[2]" />
                </div>
              )}
            </div>
          )}

          <div
            className="flex items-start justify-between gap-3"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}
          >
            {/* Left Logo (if position is left) */}
            {header.logoPosition === 'left' && (
              <div className="flex-shrink-0" style={{ flexShrink: 0 }}>
                {header.logoUrl ? (
                  <img
                    src={header.logoUrl}
                    alt="Institute Logo"
                    referrerPolicy="no-referrer"
                    className={`${
                      header.logoSize === 'large' ? 'w-16 h-16' : header.logoSize === 'small' ? 'w-9 h-9' : 'w-12 h-12'
                    } object-contain border border-black p-0.5`}
                    style={{
                      width: header.logoSize === 'large' ? '64px' : header.logoSize === 'small' ? '36px' : '48px',
                      height: header.logoSize === 'large' ? '64px' : header.logoSize === 'small' ? '36px' : '48px',
                      objectFit: 'contain',
                      border: '1px solid black',
                    }}
                  />
                ) : (
                  <div
                    className={`${
                      header.logoSize === 'large' ? 'w-16 h-16' : header.logoSize === 'small' ? 'w-9 h-9' : 'w-12 h-12'
                    } border-2 ${strokeColor} flex items-center justify-center font-black text-sm bg-slate-50`}
                    style={{
                      width: header.logoSize === 'large' ? '64px' : header.logoSize === 'small' ? '36px' : '48px',
                      height: header.logoSize === 'large' ? '64px' : header.logoSize === 'small' ? '36px' : '48px',
                      border: '2px solid black',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f8fafc',
                    }}
                  >
                    <ShieldCheck className="w-7 h-7 text-black stroke-[2]" />
                  </div>
                )}
              </div>
            )}

            {/* Header Text Branding */}
            <div
              className={`flex-1 ${header.textAlignment === 'center' ? 'text-center' : header.textAlignment === 'right' ? 'text-right' : 'text-left'}`}
              style={{ flex: 1, textAlign: header.textAlignment === 'center' ? 'center' : header.textAlignment === 'right' ? 'right' : 'left' }}
            >
              <h1 className={`font-black uppercase tracking-tight text-black leading-tight ${
                header.headerFontSize === 'large' ? 'text-lg sm:text-xl' : header.headerFontSize === 'small' ? 'text-sm' : 'text-base sm:text-lg'
              }`}>
                {header.schoolName || 'APEX ACADEMY OF EXCELLENCE'}
              </h1>

              {header.tagline && (
                <p className="text-[10px] font-semibold text-slate-700 tracking-wider uppercase mt-0.5">
                  {header.tagline}
                </p>
              )}

              {header.contactInfo && (
                <p className="text-[9px] font-medium text-slate-600 tracking-wide mt-0.5">
                  {header.contactInfo}
                </p>
              )}
              
              <div className="inline-flex items-center gap-2 mt-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span className="bg-black text-white font-black text-[10px] px-2.5 py-0.5 tracking-wider rounded-xs uppercase">
                  OMR ANSWER SHEET
                </span>
                {header.sessionYear && (
                  <span className="text-[10px] font-bold text-slate-800">
                    Session: {header.sessionYear}
                  </span>
                )}
              </div>

              {/* Custom Note Banner (Time / Max Marks) */}
              {header.customNote && (
                <div className="mt-1 text-[9.5px] font-bold text-slate-900 tracking-wide">
                  {header.customNote}
                </div>
              )}
            </div>

            {/* Right Logo or Set Box */}
            <div className="flex items-center gap-2 flex-shrink-0" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {header.logoPosition === 'right' && (
                <div>
                  {header.logoUrl ? (
                    <img
                      src={header.logoUrl}
                      alt="Institute Logo"
                      referrerPolicy="no-referrer"
                      className={`${
                        header.logoSize === 'large' ? 'w-16 h-16' : header.logoSize === 'small' ? 'w-9 h-9' : 'w-12 h-12'
                      } object-contain border border-black p-0.5`}
                      style={{
                        width: header.logoSize === 'large' ? '64px' : header.logoSize === 'small' ? '36px' : '48px',
                        height: header.logoSize === 'large' ? '64px' : header.logoSize === 'small' ? '36px' : '48px',
                        objectFit: 'contain',
                        border: '1px solid black',
                      }}
                    />
                  ) : (
                    <div
                      className={`${
                        header.logoSize === 'large' ? 'w-16 h-16' : header.logoSize === 'small' ? 'w-9 h-9' : 'w-12 h-12'
                      } border-2 ${strokeColor} flex items-center justify-center font-black text-sm bg-slate-50`}
                      style={{
                        width: header.logoSize === 'large' ? '64px' : header.logoSize === 'small' ? '36px' : '48px',
                        height: header.logoSize === 'large' ? '64px' : header.logoSize === 'small' ? '36px' : '48px',
                        border: '2px solid black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8fafc',
                      }}
                    >
                      <ShieldCheck className="w-7 h-7 text-black stroke-[2]" />
                    </div>
                  )}
                </div>
              )}

              {/* Set / Series Box */}
              {enableSetSeries && (
                <div
                  className={`w-14 border-2 ${strokeColor} text-center`}
                  style={{ width: '56px', border: '2px solid black', textAlign: 'center' }}
                >
                  <div
                    className="text-[8.5px] font-bold bg-slate-100 border-b border-black py-0.5 uppercase tracking-wider"
                    style={{ fontSize: '8.5px', fontWeight: 'bold', backgroundColor: '#f1f5f9', borderBottom: '1px solid black', padding: '2px 0' }}
                  >
                    SET / CODE
                  </div>
                  <div
                    className="font-black text-lg py-0.5 leading-none"
                    style={{ fontWeight: 900, fontSize: '18px', padding: '2px 0', lineHeight: 1 }}
                  >
                    {header.setSeries || 'A'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {header.showDivider && <div className={`w-full h-[1.5px] ${isMono ? 'bg-black' : 'bg-slate-800'} my-1.5`} />}

          {/* Metadata Fields: Exam Name, Subject, Date, Class */}
          <div
            className={`grid grid-cols-12 gap-x-2 gap-y-1 text-[10px] font-bold border ${strokeColor} p-1.5 bg-slate-50/70`}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
              columnGap: '8px',
              rowGap: '4px',
              fontSize: '10px',
              fontWeight: 'bold',
              border: '1px solid black',
              padding: '6px',
              backgroundColor: '#f8fafc',
            }}
          >
            {enableSubjectExam && (
              <>
                <div className="col-span-5 flex items-center gap-1 truncate" style={{ gridColumn: 'span 5 / span 5', display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                  <span className="text-black font-extrabold flex-shrink-0" style={{ fontWeight: 800, flexShrink: 0 }}>EXAM:</span>
                  <span className="font-semibold truncate border-b border-dotted border-black flex-1 text-[9.5px]" style={{ flex: 1, borderBottom: '1px dotted black', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {header.examName || 'Assessment Test'}
                  </span>
                </div>
                <div className="col-span-4 flex items-center gap-1 truncate" style={{ gridColumn: 'span 4 / span 4', display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                  <span className="text-black font-extrabold flex-shrink-0" style={{ fontWeight: 800, flexShrink: 0 }}>SUBJECT:</span>
                  <span className="font-semibold truncate border-b border-dotted border-black flex-1 text-[9.5px]" style={{ flex: 1, borderBottom: '1px dotted black', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {header.subjectName || 'General Mock'}
                  </span>
                </div>
              </>
            )}

            {enableDateField && (
              <div className="col-span-3 flex items-center gap-1" style={{ gridColumn: 'span 3 / span 3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="text-black font-extrabold flex-shrink-0" style={{ fontWeight: 800, flexShrink: 0 }}>DATE:</span>
                <span className="font-semibold border-b border-dotted border-black flex-1 text-center text-[9.5px]" style={{ flex: 1, borderBottom: '1px dotted black', textAlign: 'center' }}>
                  {header.date || '___ / ___ / 2025'}
                </span>
              </div>
            )}

            {enableCandidateName && (
              <div className="col-span-8 flex items-center gap-1 mt-0.5" style={{ gridColumn: 'span 8 / span 8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <span className="text-black font-extrabold flex-shrink-0" style={{ fontWeight: 800, flexShrink: 0 }}>CANDIDATE NAME:</span>
                <span className="font-normal border-b border-dotted border-black flex-1" style={{ flex: 1, borderBottom: '1px dotted black' }}>
                  &nbsp;
                </span>
              </div>
            )}

            {enableClassBatch && (
              <div className="col-span-4 flex items-center gap-1 mt-0.5" style={{ gridColumn: 'span 4 / span 4', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <span className="text-black font-extrabold flex-shrink-0" style={{ fontWeight: 800, flexShrink: 0 }}>BATCH / CLASS:</span>
                <span className="font-normal border-b border-dotted border-black flex-1" style={{ flex: 1, borderBottom: '1px dotted black' }}>
                  &nbsp;
                </span>
              </div>
            )}

            {enableFatherName && (
              <div className="col-span-8 flex items-center gap-1 mt-0.5" style={{ gridColumn: 'span 8 / span 8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <span className="text-black font-extrabold flex-shrink-0" style={{ fontWeight: 800, flexShrink: 0 }}>FATHER'S NAME:</span>
                <span className="font-normal border-b border-dotted border-black flex-1" style={{ flex: 1, borderBottom: '1px dotted black' }}>
                  &nbsp;
                </span>
              </div>
            )}

            {/* Custom Extra Fields */}
            {customFields.map((cf) => (
              <div key={cf.id} className="col-span-4 flex items-center gap-1 mt-0.5">
                <span className="text-black font-extrabold flex-shrink-0 uppercase text-[9px]">{cf.label}:</span>
                {cf.type === 'boxes' ? (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: cf.digits || 5 }).map((_, bIdx) => (
                      <div
                        key={bIdx}
                        className="w-3.5 h-4 border border-black bg-white flex items-center justify-center text-[8px]"
                      >
                        &nbsp;
                      </div>
                    ))}
                  </div>
                ) : cf.type === 'bubbles' ? (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: cf.digits || 4 }).map((_, cIdx) => (
                      <div key={cIdx} className="flex flex-col items-center">
                        <div className="w-3 h-3.5 border border-black text-[7.5px] bg-white mb-0.5">&nbsp;</div>
                        <div className="flex flex-col gap-[1px]">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].slice(0, 5).map((d) => (
                            <div key={d} className="w-2.5 h-2.5 rounded-full border border-black text-[6px] flex items-center justify-center font-bold">
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="font-normal border-b border-dotted border-black flex-1">
                    &nbsp;
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= ROLL NUMBER & IDENTIFICATION BUBBLE GRID ================= */}
        {(enableRollNumber || enableRegistrationNumber || enableCenterCode) && (
          <div
            className={`w-full border ${strokeColor} bg-white flex flex-wrap items-start justify-around text-center`}
            style={{
              width: '100%',
              border: '1px solid black',
              padding: isHighDensity ? '2px 4px' : '4px',
              marginBottom: isHighDensity ? '3px' : '6px',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-around',
              gap: isHighDensity ? '4px' : '6px',
              textAlign: 'center',
            }}
          >
            
            {/* Roll Number Grid */}
            {enableRollNumber && (
              <div className="flex flex-col items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  className="font-black uppercase tracking-wider text-black bg-slate-100 border border-black w-full"
                  style={{ fontSize: isHighDensity ? '8px' : '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000000', marginBottom: isHighDensity ? '2px' : '3px', backgroundColor: '#f1f5f9', padding: '1px 6px', border: '1px solid black', width: '100%' }}
                >
                  Roll Number
                </div>

                <div
                  className="flex items-center"
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: isHighDensity ? '2px' : '3px' }}
                >
                  {Array.from({ length: rollNumberDigits }).map((_, colIdx) => (
                    <div
                      key={colIdx}
                      className="flex flex-col items-center"
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      {/* Top Digit Box */}
                      {(rollNumberStyle === 'boxes' || rollNumberStyle === 'both') && (
                        <div
                          className="border border-black flex items-center justify-center font-mono font-bold bg-slate-50"
                          style={{
                            border: '1px solid black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8fafc',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            ...getRollDigitBoxStyle(),
                          }}
                        >
                          &nbsp;
                        </div>
                      )}

                      {/* 0-9 Bubbles */}
                      {(rollNumberStyle === 'bubbles' || rollNumberStyle === 'both') && (
                        <div
                          className="flex flex-col"
                          style={{ display: 'flex', flexDirection: 'column', gap: isHighDensity ? '1px' : '1.5px', alignItems: 'center' }}
                        >
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                            <div
                              key={digit}
                              className="rounded-full border border-black flex items-center justify-center font-bold"
                              style={{
                                borderRadius: '50%',
                                border: '1px solid black',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                ...getRollBubbleStyle(),
                              }}
                            >
                              {digit}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Registration Number Grid (if enabled) */}
            {enableRegistrationNumber && (
              <div className="flex flex-col items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  className="font-black uppercase tracking-wider text-black bg-slate-100 border border-black w-full"
                  style={{ fontSize: isHighDensity ? '8px' : '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000000', marginBottom: isHighDensity ? '2px' : '3px', backgroundColor: '#f1f5f9', padding: '1px 6px', border: '1px solid black', width: '100%' }}
                >
                  Registration No.
                </div>

                <div
                  className="flex items-center"
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: isHighDensity ? '2px' : '3px' }}
                >
                  {Array.from({ length: registrationNumberDigits }).map((_, colIdx) => (
                    <div
                      key={colIdx}
                      className="flex flex-col items-center"
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <div
                        className="border border-black flex items-center justify-center font-mono font-bold bg-slate-50"
                        style={{
                          border: '1px solid black',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f8fafc',
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          ...getRollDigitBoxStyle(),
                        }}
                      >
                        &nbsp;
                      </div>
                      <div
                        className="flex flex-col"
                        style={{ display: 'flex', flexDirection: 'column', gap: isHighDensity ? '1px' : '1.5px', alignItems: 'center' }}
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                          <div
                            key={digit}
                            className="rounded-full border border-black flex items-center justify-center font-bold"
                            style={{
                              borderRadius: '50%',
                              border: '1px solid black',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              ...getRollBubbleStyle(),
                            }}
                          >
                            {digit}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Center Code Grid (if enabled) */}
            {enableCenterCode && (
              <div className="flex flex-col items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  className="font-black uppercase tracking-wider text-black bg-slate-100 border border-black w-full"
                  style={{ fontSize: isHighDensity ? '8px' : '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000000', marginBottom: isHighDensity ? '2px' : '3px', backgroundColor: '#f1f5f9', padding: '1px 6px', border: '1px solid black', width: '100%' }}
                >
                  Centre Code
                </div>

                <div
                  className="flex items-center"
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: isHighDensity ? '2px' : '3px' }}
                >
                  {Array.from({ length: centerCodeDigits }).map((_, colIdx) => (
                    <div
                      key={colIdx}
                      className="flex flex-col items-center"
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <div
                        className="border border-black flex items-center justify-center font-mono font-bold bg-slate-50"
                        style={{
                          border: '1px solid black',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f8fafc',
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          ...getRollDigitBoxStyle(),
                        }}
                      >
                        &nbsp;
                      </div>
                      <div
                        className="flex flex-col"
                        style={{ display: 'flex', flexDirection: 'column', gap: isHighDensity ? '1px' : '1.5px', alignItems: 'center' }}
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                          <div
                            key={digit}
                            className="rounded-full border border-black flex items-center justify-center font-bold"
                            style={{
                              borderRadius: '50%',
                              border: '1px solid black',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              ...getRollBubbleStyle(),
                            }}
                          >
                            {digit}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Guide: Correct Method */}
            <div
              className={`flex flex-col items-center justify-center border border-slate-300 bg-slate-50/70 rounded-xs ${
                isHighDensity ? 'p-1 text-[7.5px] space-y-0.5' : 'p-1.5 text-[8.5px] space-y-1'
              }`}
            >
              <span className="font-extrabold text-black uppercase tracking-wider">
                Marking Method
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  <span className={`${isHighDensity ? 'w-3 h-3 text-[7px]' : 'w-3.5 h-3.5 text-[8px]'} rounded-full bg-black text-white font-bold flex items-center justify-center`}>A</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5 text-[7.5px]">
                    <Check className="w-2.5 h-2.5" /> Correct
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  <span className={`${isHighDensity ? 'w-3 h-3 text-[7px]' : 'w-3.5 h-3.5 text-[8px]'} rounded-full border border-black font-bold flex items-center justify-center line-through`}>✓</span>
                  <span className="text-rose-600 font-bold flex items-center gap-0.5 text-[7.5px]">
                    <X className="w-2.5 h-2.5" /> Wrong
                  </span>
                </div>
              </div>
              <span className="text-[7px] text-slate-500 font-medium">Use Blue/Black Ball Pen Only</span>
            </div>

          </div>
        )}

        {/* ================= QUESTIONS GRID ================= */}
        <div className="flex-1 w-full my-0.5 overflow-hidden" style={{ flex: 1, minHeight: 0, width: '100%', margin: '1px 0', overflow: 'hidden' }}>
          <div
            className="flex justify-between items-stretch h-full"
            style={{ display: 'flex', flexDirection: 'row', gap: isHighDensity ? '4px' : '6px', justifyContent: 'space-between', alignItems: 'stretch', height: '100%', minHeight: 0 }}
          >
            {columns.map((colQuestions, colIdx) => (
              <div
                key={colIdx}
                className={`flex-1 border ${strokeColor} rounded-xs overflow-hidden flex flex-col justify-start`}
                style={{ flex: 1, minHeight: 0, border: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden' }}
              >
                {/* Column Header */}
                <div
                  className="bg-slate-200 border-b border-black px-1 py-0.5 flex items-center justify-between font-black"
                  style={{ backgroundColor: '#e2e8f0', borderBottom: '1px solid black', padding: '1.5px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: isHighDensity ? '8.5px' : '9.5px', fontWeight: 900 }}
                >
                  <span className="text-center text-black" style={{ width: isHighDensity ? '22px' : '26px', textAlign: 'center', color: '#000000' }}>Q.No.</span>
                  <div className="flex items-center justify-around flex-1 px-0.5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flex: 1, padding: '0 2px' }}>
                    {Array.from({ length: optionsCount }).map((_, optIdx) => (
                      <span key={optIdx} className="text-center font-bold" style={{ width: isHighDensity ? '14px' : '18px', textAlign: 'center', fontWeight: 'bold' }}>
                        {optionLabels[optIdx] || String.fromCharCode(65 + optIdx)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rows with optional Section Dividers */}
                <div className="divide-y divide-slate-200 bg-white flex-1" style={{ backgroundColor: '#ffffff', flex: 1, minHeight: 0 }}>
                  {colQuestions.map((qNum) => {
                    const qHighlight = highlightQuestions[qNum];
                    const selected = selectedAnswers[qNum];
                    const section = getSectionForQ(qNum);

                    return (
                      <React.Fragment key={qNum}>
                        {/* Section Header Banner if configured */}
                        {section && (
                          <div
                            className="bg-black text-white px-1 py-0.5 font-extrabold uppercase tracking-wider text-center border-y border-black"
                            style={{ backgroundColor: '#000000', color: '#ffffff', padding: isHighDensity ? '1px 4px' : '2px 6px', fontSize: isHighDensity ? '7.5px' : '8.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', borderTop: '1px solid black', borderBottom: '1px solid black' }}
                          >
                            {section.name} (Q.{section.startQuestion || (section as any).startQ} - Q.{section.endQuestion || (section as any).endQ})
                          </div>
                        )}

                        <div
                          className="flex items-center justify-between transition-colors"
                          style={getRowStyle(qNum, qHighlight)}
                        >
                          {/* Question Number */}
                          <span
                            className="font-mono font-extrabold text-center text-slate-800"
                            style={{
                              width: isHighDensity ? '22px' : '26px',
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              fontSize: isHighDensity ? '8.5px' : '9.5px',
                              textAlign: 'center',
                              color: '#1e293b',
                              lineHeight: 1,
                            }}
                          >
                            {formatQNum(qNum)}
                          </span>

                          {/* Options Bubbles */}
                          <div
                            className="flex items-center justify-around flex-1"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-around',
                              flex: 1,
                              padding: '0 2px',
                              gap: isHighDensity ? '2px' : '3px',
                            }}
                          >
                            {Array.from({ length: optionsCount }).map((_, optIdx) => {
                              const optLabel = optionLabels[optIdx] || String.fromCharCode(65 + optIdx);
                              const isSelected = selected === optLabel;

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  disabled={!interactive}
                                  onClick={() => {
                                    if (interactive && handleSelect) {
                                      handleSelect(qNum, optLabel);
                                    }
                                  }}
                                  className={`
                                    ${getBubbleRadius()}
                                    ${getBorderThicknessClass()}
                                    ${strokeColor}
                                    flex items-center justify-center font-bold tracking-tighter
                                    select-none
                                    ${
                                      isSelected
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black hover:bg-slate-200'
                                    }
                                    ${interactive ? 'cursor-pointer hover:border-blue-600' : 'cursor-default'}
                                    transition-all
                                  `}
                                  style={{
                                    borderRadius: bubble.shape === 'square' ? '0' : bubble.shape === 'rounded' ? '2px' : '50%',
                                    border: '1px solid black',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: isSelected ? '#000000' : '#ffffff',
                                    color: isSelected ? '#ffffff' : '#000000',
                                    ...getBubbleStyle(),
                                  }}
                                >
                                  {optLabel}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= INSTRUCTIONS & SIGNATURES ================= */}
        <div className={`w-full ${isHighDensity ? 'mt-1 pt-1' : 'mt-1.5 pt-1.5'} border-t ${strokeColor}`}>
          {enableInstructions ? (
            <div className="grid grid-cols-12 gap-2 sm:gap-3 items-stretch">
              {/* Instructions list */}
              <div
                className={`col-span-7 border ${strokeColor} ${
                  isHighDensity ? 'p-1 text-[7.5px]' : 'p-1.5 text-[8.5px]'
                } leading-tight bg-slate-50 flex flex-col justify-between`}
              >
                <div>
                  <div className="font-extrabold uppercase tracking-wider text-black mb-0.5">
                    Important Instructions for Candidates:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-800 font-medium">
                    {instructions.slice(0, isHighDensity ? 2 : 4).map((ins, i) => (
                      <li key={i} className="truncate">{ins}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Signature Boxes & Machine Readable Codes */}
              <div className="col-span-5 flex flex-col justify-between gap-1">
                <div className="grid grid-cols-2 gap-1.5">
                  {enableSignatureBox && (
                    <div
                      className={`border ${strokeColor} p-1 text-center bg-white flex flex-col justify-between min-w-0`}
                      style={{ height: getSigBoxHeight() }}
                    >
                      <div className="flex-1 flex items-center justify-center text-[7px] text-slate-400 italic">
                        Candidate Sign
                      </div>
                      <span className="text-[8px] font-bold text-slate-900 border-t border-dotted border-black pt-0.5 leading-none whitespace-nowrap uppercase">
                        Candidate's Signature
                      </span>
                    </div>
                  )}

                  {enableInvigilatorSign && (
                    <div
                      className={`border ${strokeColor} p-1 text-center bg-white flex flex-col justify-between min-w-0`}
                      style={{ height: getSigBoxHeight() }}
                    >
                      <div className="flex-1 flex items-center justify-center text-[7px] text-slate-400 italic">
                        With Seal
                      </div>
                      <span className="text-[8px] font-bold text-slate-900 border-t border-dotted border-black pt-0.5 leading-none whitespace-nowrap uppercase">
                        Invigilator's Signature
                      </span>
                    </div>
                  )}
                </div>

                {/* Barcode & Security ID */}
                <div className="flex items-center justify-between text-[7.5px] font-mono font-bold text-slate-700 px-0.5">
                  {enableBarcode && (
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-[1px] h-3 items-end">
                        {[1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 1].map((w, i) => (
                          <span
                            key={i}
                            className="bg-black inline-block h-full"
                            style={{ width: `${w * 1.1}px` }}
                          />
                        ))}
                      </div>
                      <span className="tracking-wider">OMR-{config.id?.slice(0, 8) || '2025-A'}</span>
                    </div>
                  )}

                  {enableQrCode && (
                    <div className="flex items-center gap-1 text-black">
                      <QrCode className="w-3 h-3" />
                      <span>SECURE-VERIFIED</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Full-width professional layout when instructions are hidden (Standard Exam Hall Layout) */
            <div className="w-full flex items-center justify-between gap-3 py-0.5">
              
              {/* Left: Barcode & Security Verification */}
              <div className="flex flex-col justify-center gap-1 min-w-[160px]">
                {enableBarcode && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-[1.5px] h-3.5 items-end">
                      {[1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2].map((w, i) => (
                        <span
                          key={i}
                          className="bg-black inline-block h-full"
                          style={{ width: `${w * 1.2}px` }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[8.5px] font-bold text-slate-800 tracking-wider">
                      OMR-{config.id?.slice(0, 8) || '2025-A'}
                    </span>
                  </div>
                )}
                
                {enableQrCode && (
                  <div className="flex items-center gap-1 text-[7.5px] font-mono font-bold text-slate-700">
                    <QrCode className="w-3 h-3 text-black shrink-0" />
                    <span className="tracking-tight">MACHINE-READABLE • SECURE-VERIFIED</span>
                  </div>
                )}
              </div>

              {/* Right: Generous, Professional Candidate & Invigilator Signature Boxes */}
              <div className="flex items-center gap-3 flex-1 justify-end max-w-[460px]">
                {enableSignatureBox && (
                  <div
                    className={`border ${strokeColor} px-2 py-1 text-center bg-white flex-1 flex flex-col justify-between min-w-[140px]`}
                    style={{ height: getSigBoxHeight() }}
                  >
                    <div className="flex-1 flex items-center justify-center text-[7px] text-slate-400 italic">
                      Sign within this box
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-900 border-t border-dotted border-black pt-0.5 leading-none uppercase tracking-tight whitespace-nowrap">
                      Candidate's Signature
                    </span>
                  </div>
                )}

                {enableInvigilatorSign && (
                  <div
                    className={`border ${strokeColor} px-2 py-1 text-center bg-white flex-1 flex flex-col justify-between min-w-[140px]`}
                    style={{ height: getSigBoxHeight() }}
                  >
                    <div className="flex-1 flex items-center justify-center text-[7px] text-slate-400 italic">
                      With Official Seal / Stamp
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-900 border-t border-dotted border-black pt-0.5 leading-none uppercase tracking-tight whitespace-nowrap">
                      Invigilator's Signature
                    </span>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="w-full text-center text-[7.5px] font-semibold text-slate-500 pt-0.5 mt-0.5 border-t border-slate-200 flex items-center justify-between">
          <span>A4 Standard (210 × 297 mm)</span>
          <span>{footerText || 'OMRWallah • Official Examination Standard'}</span>
          <span>Machine Readable • Single Page</span>
        </div>

      </div>
    </div>
  );

  if (scale && scale !== 1) {
    return (
      <div
        className="omr-scale-outer-container mx-auto shrink-0 relative rounded-lg shadow-md transition-all"
        style={{
          width: Math.round(794 * scale),
          height: Math.round(1123 * scale),
          minHeight: Math.round(1123 * scale),
          maxHeight: Math.round(1123 * scale),
          overflow: 'hidden',
        }}
      >
        <div
          ref={sheetRef}
          style={{
            width: '210mm',
            height: '297mm',
            maxHeight: '297mm',
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {sheetContent}
        </div>
      </div>
    );
  }

  return (
    <div ref={sheetRef} className="mx-auto shrink-0 flex justify-center items-start">
      {sheetContent}
    </div>
  );
};

