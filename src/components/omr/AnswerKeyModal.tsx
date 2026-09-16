import React, { useState, useEffect } from 'react';
import {
  Key,
  X,
  Upload,
  FileText,
  Grid,
  CheckCircle2,
  Trash2,
  Download,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export interface AnswerKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: Record<number, string>;
  onSaveKey: (key: Record<number, string>, totalQ?: number) => void;
  totalQuestions?: number;
  optionsList?: string[];
  title?: string;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AnswerKeyModal: React.FC<AnswerKeyModalProps> = ({
  isOpen,
  onClose,
  currentKey,
  onSaveKey,
  totalQuestions = 100,
  optionsList: initialOptionsList = ['A', 'B', 'C', 'D'],
  title = 'Configure Answer Key (उत्तर कुंजी)',
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'paste' | 'upload'>('grid');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [pasteText, setPasteText] = useState('');
  const [qCount, setQCount] = useState<number>(totalQuestions || 100);
  const [optionsCount, setOptionsCount] = useState<number>(initialOptionsList.length === 5 ? 5 : 4);
  const [gridRange, setGridRange] = useState<string>('all');
  const [searchQ, setSearchQ] = useState<string>('');

  const currentOptionsList = optionsCount === 5 ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];

  useEffect(() => {
    if (isOpen) {
      const activeKeys = currentKey ? Object.keys(currentKey).map(Number) : [];
      const maxExistingQ = activeKeys.length > 0 ? Math.max(...activeKeys) : 0;
      const initialTotal = Math.max(totalQuestions || 50, maxExistingQ || 0);

      setAnswers(currentKey ? { ...currentKey } : {});
      setQCount(initialTotal);
      setPasteText('');
      setGridRange('all');
      setSearchQ('');
    }
  }, [isOpen, currentKey, totalQuestions]);

  if (!isOpen) return null;

  const handleSelectAnswer = (qNo: number, opt: string) => {
    setAnswers((prev) => {
      const next = { ...prev };
      if (next[qNo] === opt) {
        delete next[qNo]; // Toggle off if clicked again
      } else {
        next[qNo] = opt;
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setAnswers({});
    if (showToast) {
      showToast('Answer key poori tarah hata di gayi hai (Cleared)', 'info');
    }
  };

  const handleQuickFill = (option: string) => {
    const newAnswers = { ...answers };
    for (let i = 1; i <= qCount; i++) {
      if (!newAnswers[i]) {
        newAnswers[i] = option;
      }
    }
    setAnswers(newAnswers);
    if (showToast) {
      showToast(`Baaki bache questions me option '${option}' fill kiya gaya`, 'info');
    }
  };

  const handleParsePasteText = () => {
    if (!pasteText.trim()) {
      if (showToast) showToast('Kripya answers paste karein', 'error');
      return;
    }

    const newKey: Record<number, string> = {};
    const text = pasteText.trim().toUpperCase();
    let highestDetectedQ = 0;

    // Try format 1: Line by line "1. A", "1-A", "1: A", "1 A", "Q1: A"
    const lines = text.split(/[\r\n]+/);
    let matchedLines = 0;

    for (const line of lines) {
      const match = line.match(/(?:Q\s*)?(\d+)[\s.:\-=]+([A-E])/i);
      if (match) {
        const qNo = parseInt(match[1], 10);
        const ans = match[2].toUpperCase();
        if (qNo >= 1 && qNo <= 300 && currentOptionsList.includes(ans)) {
          newKey[qNo] = ans;
          matchedLines++;
          if (qNo > highestDetectedQ) highestDetectedQ = qNo;
        }
      }
    }

    // Try format 2: Comma or space separated "1-A, 2-B, 3-C" or "A, B, C, D"
    if (matchedLines === 0) {
      const items = text.split(/[\s,]+/);
      let sequentialIdx = 1;

      for (const item of items) {
        const trimmed = item.trim();
        if (!trimmed) continue;

        // Check if item is "1:A" or "1-A"
        const pairMatch = trimmed.match(/^(\d+)[:\-=]([A-E])$/i);
        if (pairMatch) {
          const q = parseInt(pairMatch[1], 10);
          const a = pairMatch[2].toUpperCase();
          if (q >= 1 && q <= 300 && currentOptionsList.includes(a)) {
            newKey[q] = a;
            matchedLines++;
            if (q > highestDetectedQ) highestDetectedQ = q;
          }
        } else if (trimmed.length === 1 && currentOptionsList.includes(trimmed)) {
          // It's just an answer letter in sequence
          if (sequentialIdx <= 300) {
            newKey[sequentialIdx] = trimmed;
            if (sequentialIdx > highestDetectedQ) highestDetectedQ = sequentialIdx;
            sequentialIdx++;
            matchedLines++;
          }
        }
      }
    }

    // Try format 3: Continuous string like "ABCDABCD..."
    if (matchedLines === 0) {
      const pureLetters = text.replace(/[^A-E]/gi, '');
      if (pureLetters.length > 0) {
        for (let i = 0; i < Math.min(pureLetters.length, 300); i++) {
          const char = pureLetters[i].toUpperCase();
          if (currentOptionsList.includes(char)) {
            newKey[i + 1] = char;
            matchedLines++;
            if (i + 1 > highestDetectedQ) highestDetectedQ = i + 1;
          }
        }
      }
    }

    if (matchedLines > 0) {
      if (highestDetectedQ > qCount) {
        setQCount(highestDetectedQ);
      }
      setAnswers(newKey);
      setActiveTab('grid');
      if (showToast) {
        showToast(`${matchedLines} questions ki answer key successfully load hui! (Total Qs: ${Math.max(qCount, highestDetectedQ)})`, 'success');
      }
    } else {
      if (showToast) {
        showToast('Answer format recognize nahi hua. E.g. "1-A, 2-B" ya "A B C D" try karein.', 'error');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPasteText(content);
        const newKey: Record<number, string> = {};
        const lines = content.split(/[\r\n]+/);
        let count = 0;
        let maxFileQ = 0;

        for (const line of lines) {
          const parts = line.split(/[,\t;|]+/);
          if (parts.length >= 2) {
            const qStr = parts[0].replace(/[^0-9]/g, '');
            const ansStr = parts[1].trim().toUpperCase().replace(/[^A-E]/g, '');
            if (qStr && ansStr && currentOptionsList.includes(ansStr)) {
              const q = parseInt(qStr, 10);
              if (q >= 1 && q <= 300) {
                newKey[q] = ansStr;
                count++;
                if (q > maxFileQ) maxFileQ = q;
              }
            }
          }
        }

        if (count > 0) {
          if (maxFileQ > qCount) {
            setQCount(maxFileQ);
          }
          setAnswers(newKey);
          setActiveTab('grid');
          if (showToast) {
            showToast(`File se ${count} answers load ho gaye! Total questions set to ${Math.max(qCount, maxFileQ)}`, 'success');
          }
        } else {
          setActiveTab('paste');
          if (showToast) {
            showToast('File text paste area me copy ho gayi hai. Parse Answers click karein.', 'info');
          }
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCsv = () => {
    let csv = 'Question,CorrectOption\n';
    for (let i = 1; i <= Math.min(qCount, 100); i++) {
      const dummyOpt = currentOptionsList[(i - 1) % currentOptionsList.length];
      csv += `${i},${dummyOpt}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omr_answer_key_${qCount}q.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    onSaveKey(answers, qCount);
    const count = Object.keys(answers).length;
    if (showToast) {
      if (count > 0) {
        showToast(`${count} Questions (${qCount} Total) ki Answer Key save ho gayi!`, 'success');
      } else {
        showToast('Answer key empty save ki gayi hai (No key active)', 'info');
      }
    }
    onClose();
  };

  const countFilled = Object.keys(answers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {countFilled}/{qCount} Set
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Apni test ke sahi answers set ya upload karein taaki OMR sahi se evaluate ho sake.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs & Controls Bar */}
        <div className="pt-3 pb-2 border-b border-slate-100 space-y-2.5">
          {/* Main Tabs and Clear Button */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('grid')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'grid'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Interactive Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'paste'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Paste Text</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>CSV / File</span>
              </button>
            </div>

            {/* Clear Key (Hatao) button */}
            {countFilled > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                title="Sabhi answers hatao"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hatao (Clear Key)</span>
              </button>
            )}
          </div>

          {/* DYNAMIC QUESTION COUNT & OPTIONS SELECTOR (Addresses 50 Qs limitation) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Total Questions:
                </span>
                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                  {qCount} Questions
                </span>
              </div>

              {/* 4 or 5 options toggle */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 font-semibold mr-1">Options:</span>
                <button
                  type="button"
                  onClick={() => setOptionsCount(4)}
                  className={`px-2 py-0.5 rounded-md font-bold text-[11px] border cursor-pointer ${
                    optionsCount === 4
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  4 (A-D)
                </button>
                <button
                  type="button"
                  onClick={() => setOptionsCount(5)}
                  className={`px-2 py-0.5 rounded-md font-bold text-[11px] border cursor-pointer ${
                    optionsCount === 5
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  5 (A-E)
                </button>
              </div>
            </div>

            {/* Quick Presets for Questions */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              {[20, 25, 30, 50, 75, 100, 150, 180, 200].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQCount(num)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    qCount === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {num}
                  {num === 75 ? ' (JEE)' : num === 100 ? ' (SSC)' : num === 180 ? ' (NEET)' : ''}
                </button>
              ))}

              {/* Custom input */}
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-[11px] font-semibold text-slate-500">Custom:</span>
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={qCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0 && val <= 300) {
                      setQCount(val);
                    }
                  }}
                  className="w-14 px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-3 sm:py-4">
          
          {/* TAB 1: INTERACTIVE GRID */}
          {activeTab === 'grid' && (
            <div className="space-y-3.5">
              {/* Filter / Quick Jump & Fill Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs">
                {/* Range Filters if qCount > 30 */}
                {qCount > 30 ? (
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-slate-500 font-semibold mr-1">Section:</span>
                    <button
                      type="button"
                      onClick={() => setGridRange('all')}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold border cursor-pointer ${
                        gridRange === 'all'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      All ({qCount})
                    </button>
                    {Array.from({ length: Math.ceil(qCount / 25) }, (_, b) => {
                      const start = b * 25 + 1;
                      const end = Math.min((b + 1) * 25, qCount);
                      const key = `${start}-${end}`;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setGridRange(key)}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold border cursor-pointer ${
                            gridRange === key
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-600 border-slate-200'
                          }`}
                        >
                          {start}–{end}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <span className="font-semibold text-slate-700">
                    Question ke aage sahi option par click karein.
                  </span>
                )}

                {/* Quick Search Q# */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-slate-500 font-semibold text-[11px]">Jump to Q#:</span>
                  <input
                    type="number"
                    min={1}
                    max={qCount}
                    placeholder="Q#"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    className="w-16 px-2 py-1 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>

              {/* Quick Fill remaining helper */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 px-1">
                <span>
                  Tip: Hataney ke liye dubara wahi option dabayein.
                </span>
                <div className="flex items-center gap-1 mt-1 sm:mt-0">
                  <span className="font-semibold">Fill Empty with:</span>
                  {currentOptionsList.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleQuickFill(opt)}
                      className="px-1.5 py-0.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 font-bold rounded border border-slate-200 cursor-pointer text-[10px]"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {Array.from({ length: qCount }, (_, idx) => {
                  const qNum = idx + 1;
                  
                  // Filter by range
                  if (gridRange !== 'all') {
                    const [sStr, eStr] = gridRange.split('-');
                    const s = parseInt(sStr, 10);
                    const e = parseInt(eStr, 10);
                    if (qNum < s || qNum > e) return null;
                  }

                  // Filter by searchQ
                  if (searchQ && qNum !== parseInt(searchQ, 10)) {
                    return null;
                  }

                  const currentAns = answers[qNum];

                  return (
                    <div
                      key={qNum}
                      className={`flex items-center justify-between p-2 sm:p-2.5 rounded-xl border transition-all ${
                        currentAns
                          ? 'bg-blue-50/40 border-blue-200 shadow-2xs'
                          : 'bg-slate-50/60 border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-black text-slate-700 w-12 flex items-center gap-1">
                        <span>Q{qNum < 10 ? `0${qNum}` : qNum}</span>
                        {currentAns && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                        )}
                      </span>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {currentOptionsList.map((opt) => {
                          const isSelected = currentAns === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelectAnswer(qNum, opt)}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                                isSelected
                                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500 ring-offset-1 scale-105'
                                  : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-400 hover:text-blue-600'
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
            </div>
          )}

          {/* TAB 2: PASTE TEXT */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Supported Paste Formats (Auto-detects up to 200+ Questions):</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 font-mono">
                    1-A, 2-B, 3-C, 4-D... 100-A
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 font-mono">
                    A B C D A B C...
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 font-mono">
                    ABCDABCD... (any length string)
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 font-mono">
                    1. A {'\n'} 2. B {'\n'} 3. C...
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Paste Answer Key Text Here:
                </label>
                <textarea
                  rows={7}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="e.g. 1-A, 2-B, 3-C, 4-D... ya 100 questions ka raw text 'A B C D'..."
                  className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Agar aap 100 ya 180 questions paste karenge, question count auto-expand ho jayega.
                </span>
                <button
                  type="button"
                  onClick={handleParsePasteText}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Parse & Apply Answers →
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: UPLOAD CSV / FILE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-6 sm:p-8 text-center bg-slate-50/50 transition-colors">
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">
                  Upload Answer Key File (.csv ya .txt)
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Column 1: Question Number (1, 2, 3...) <br />
                  Column 2: Correct Option (A, B, C, D)
                </p>

                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <label className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors inline-block">
                    <span>Browse CSV File</span>
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleDownloadSampleCsv}
                    className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Sample CSV</span>
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>CSV Format:</strong> File me do columns hone chahiye (Question Number, Correct Option). Example: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">1,A</code>, <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">2,B</code>.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {countFilled > 0 ? (
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {countFilled} of {qCount} answers configured
              </span>
            ) : (
              <span className="text-slate-400">
                Koi answer set nahi hai (Empty Key)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 cursor-pointer transition-colors"
            >
              Save Answer Key
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
