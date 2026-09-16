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
  onSaveKey: (key: Record<number, string>) => void;
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
  totalQuestions = 50,
  optionsList = ['A', 'B', 'C', 'D'],
  title = 'Configure Answer Key (उत्तर कुंजी)',
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'paste' | 'upload'>('grid');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [pasteText, setPasteText] = useState('');
  const [qCount, setQCount] = useState<number>(totalQuestions);

  useEffect(() => {
    if (isOpen) {
      setAnswers(currentKey ? { ...currentKey } : {});
      setQCount(totalQuestions);
      setPasteText('');
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

  const handleParsePasteText = () => {
    if (!pasteText.trim()) {
      if (showToast) showToast('Kripya answers paste karein', 'error');
      return;
    }

    const newKey: Record<number, string> = {};
    const text = pasteText.trim().toUpperCase();

    // Try format 1: Line by line "1. A", "1-A", "1: A", "1 A"
    const lines = text.split(/[\r\n]+/);
    let matchedLines = 0;

    for (const line of lines) {
      const match = line.match(/(?:Q\s*)?(\d+)[\s.:\-=]+([A-E])/i);
      if (match) {
        const qNo = parseInt(match[1], 10);
        const ans = match[2].toUpperCase();
        if (qNo >= 1 && qNo <= qCount && optionsList.includes(ans)) {
          newKey[qNo] = ans;
          matchedLines++;
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
          if (q >= 1 && q <= qCount && optionsList.includes(a)) {
            newKey[q] = a;
            matchedLines++;
          }
        } else if (trimmed.length === 1 && optionsList.includes(trimmed)) {
          // It's just an answer letter in sequence
          if (sequentialIdx <= qCount) {
            newKey[sequentialIdx] = trimmed;
            sequentialIdx++;
            matchedLines++;
          }
        }
      }
    }

    // Try format 3: Continuous string like "ABCDABCD"
    if (matchedLines === 0) {
      const pureLetters = text.replace(/[^A-E]/gi, '');
      if (pureLetters.length > 0) {
        for (let i = 0; i < Math.min(pureLetters.length, qCount); i++) {
          const char = pureLetters[i].toUpperCase();
          if (optionsList.includes(char)) {
            newKey[i + 1] = char;
            matchedLines++;
          }
        }
      }
    }

    if (matchedLines > 0) {
      setAnswers(newKey);
      setActiveTab('grid');
      if (showToast) {
        showToast(`${matchedLines} questions ki answer key successfully load hui!`, 'success');
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
        // Auto parse
        const newKey: Record<number, string> = {};
        const lines = content.split(/[\r\n]+/);
        let count = 0;

        for (const line of lines) {
          const parts = line.split(/[,\t;|]+/);
          if (parts.length >= 2) {
            const qStr = parts[0].replace(/[^0-9]/g, '');
            const ansStr = parts[1].trim().toUpperCase().replace(/[^A-E]/g, '');
            if (qStr && ansStr && optionsList.includes(ansStr)) {
              const q = parseInt(qStr, 10);
              if (q >= 1 && q <= qCount) {
                newKey[q] = ansStr;
                count++;
              }
            }
          }
        }

        if (count > 0) {
          setAnswers(newKey);
          setActiveTab('grid');
          if (showToast) {
            showToast(`File se ${count} answers load ho gaye!`, 'success');
          }
        } else {
          // Fallback to paste text box
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
    for (let i = 1; i <= Math.min(20, qCount); i++) {
      const dummyOpt = optionsList[(i - 1) % optionsList.length];
      csv += `${i},${dummyOpt}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_omr_answer_key.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    onSaveKey(answers);
    const count = Object.keys(answers).length;
    if (showToast) {
      if (count > 0) {
        showToast(`${count} Questions ki Answer Key save ho gayi!`, 'success');
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

        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-between gap-2 pt-3 pb-2 border-b border-slate-100">
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
              <span>Hatao (Clear All)</span>
            </button>
          )}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-3 sm:py-4">
          
          {/* TAB 1: INTERACTIVE GRID */}
          {activeTab === 'grid' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 bg-blue-50/60 border border-blue-100 p-2.5 rounded-xl">
                <span className="font-semibold text-blue-900">
                  Tip: Question ke aage sahi option (A, B, C, ya D) par click karein. Hataney ke liye dubara click karein.
                </span>
                <span className="font-bold text-blue-700">
                  Total: {qCount} Qs
                </span>
              </div>

              {/* Grid of questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {Array.from({ length: qCount }, (_, idx) => {
                  const qNum = idx + 1;
                  const currentAns = answers[qNum];

                  return (
                    <div
                      key={qNum}
                      className={`flex items-center justify-between p-2 sm:p-2.5 rounded-xl border transition-all ${
                        currentAns
                          ? 'bg-blue-50/30 border-blue-200'
                          : 'bg-slate-50/70 border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-black text-slate-700 w-10">
                        Q{qNum < 10 ? `0${qNum}` : qNum}
                      </span>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {optionsList.map((opt) => {
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
                  <span>Supported Paste Formats:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 font-mono">
                    1-A, 2-B, 3-C, 4-D...
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 font-mono">
                    A B C D A B C...
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 font-mono">
                    ABCDABCD... (50 letters)
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
                  rows={6}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="e.g. 1-A, 2-B, 3-C, 4-D... ya seedha ABCD ABCD..."
                  className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Parsed count will be mapped to {qCount} questions.
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
