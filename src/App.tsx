import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  saveOMRSheetToFirestore,
  deleteOMRSheetFromFirestore,
  subscribeToUserOMRSheets,
  saveTestResultToFirestore,
  deleteTestResultFromFirestore,
  subscribeToUserTestResults,
} from './services/omrFirebaseService';

import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { ProUpgradeModal } from './components/common/ProUpgradeModal';
import { Toast, ToastMessage } from './components/common/Toast';
import { PWAInstallButton } from './components/common/PWAInstallButton';
import { OfflineIndicator } from './components/common/OfflineIndicator';

import { HomePage } from './pages/HomePage';
import { OMRCreatorPage } from './pages/OMRCreatorPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { DashboardPage } from './pages/DashboardPage';
import { SavedSheetsPage } from './pages/SavedSheetsPage';
import { MyTestsPage } from './pages/MyTestsPage';
import { PracticeOMRPage } from './pages/PracticeOMRPage';
import { ScanOMRPage } from './pages/ScanOMRPage';
import { ResultsPage } from './pages/ResultsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { FAQPage } from './pages/FAQPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// SEO Landing Pages
import { OMRSheetGeneratorLanding } from './pages/seo/OMRSheetGeneratorLanding';
import { OMRSheetMakerLanding } from './pages/seo/OMRSheetMakerLanding';
import { OMRSheetPdfLanding } from './pages/seo/OMRSheetPdfLanding';
import { OnlineOMRSheetLanding } from './pages/seo/OnlineOMRSheetLanding';
import { OMRCoachingLanding } from './pages/seo/OMRCoachingLanding';
import { OMRSchoolsLanding } from './pages/seo/OMRSchoolsLanding';
import { OMRPracticeLanding } from './pages/seo/OMRPracticeLanding';

// Exam Guide Pages
import { ExamHubPage } from './pages/exams/ExamHubPage';
import { NeetOMRGuidePage } from './pages/exams/NeetOMRGuidePage';
import { JeeOMRGuidePage } from './pages/exams/JeeOMRGuidePage';
import { SscOMRGuidePage } from './pages/exams/SscOMRGuidePage';
import { CuetOMRGuidePage } from './pages/exams/CuetOMRGuidePage';
import { CtetOMRGuidePage } from './pages/exams/CtetOMRGuidePage';

// SEO Metadata Utility
import { updatePageSEO } from './utils/seo';
import { getRouteSEO } from './utils/seoConfig';

import { OMRConfig, TestResult, SectionPerformance } from './types/omr';
import { DEFAULT_OMR_CONFIG, TEMPLATES_DATA } from './data/templates';

const VALID_PUBLIC_ROUTES = [
  'home',
  'creator',
  'templates',
  'saved',
  'tests',
  'practice',
  'scan',
  'results',
  'analytics',
  'pricing',
  'blog',
  'faq',
  'profile',
  'settings',
  'dashboard',
  'omr-sheet-generator',
  'omr-sheet-maker',
  'omr-sheet-pdf',
  'online-omr-sheet',
  'omr-sheet-for-coaching',
  'omr-sheet-for-schools',
  'omr-practice',
  'omr-exams',
  'neet-omr-sheet',
  'jee-omr-sheet',
  'ssc-omr-sheet',
  'cuet-omr-sheet',
  'ctet-omr-sheet',
];

const getInitialRoute = (overrideRoute?: string): string => {
  if (overrideRoute && VALID_PUBLIC_ROUTES.includes(overrideRoute)) {
    return overrideRoute;
  }
  if (typeof window === 'undefined') return 'home';
  const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!rawPath || rawPath === 'index.html') return 'home';
  if (VALID_PUBLIC_ROUTES.includes(rawPath)) {
    return rawPath;
  }
  return 'not-found';
};

// Normalize legacy TestResult records if any exist in localStorage/Firestore
function normalizeTestResult(raw: any): TestResult {
  const totalQ = Number(raw.totalQuestions) || 50;
  const correct = Number(raw.correct) || 0;
  const wrong = Number(raw.wrong) || 0;
  const attempted = Number(raw.attempted) || correct + wrong;
  const unattempted =
    raw.unattempted !== undefined
      ? Number(raw.unattempted)
      : raw.skipped !== undefined
      ? Number(raw.skipped)
      : Math.max(0, totalQ - attempted);
  const maxScore = Number(raw.maxScore || raw.totalMarks || totalQ * 4);
  const score = Number(raw.score) || 0;
  const accuracy =
    raw.accuracy !== undefined
      ? Number(raw.accuracy)
      : attempted > 0
      ? Math.round((correct / attempted) * 100)
      : 0;

  return {
    id: raw.id || `test-${Date.now()}`,
    sheetId: raw.sheetId || 'practice-sheet',
    testName: raw.testName || 'Practice Assessment',
    date: raw.date || new Date().toLocaleDateString('en-IN'),
    totalQuestions: totalQ,
    attempted,
    correct,
    wrong,
    unattempted,
    score,
    maxScore,
    accuracy,
    timeTaken: raw.timeTaken || '00:00',
    answers: raw.answers || {},
    answerKey: raw.answerKey || {},
    sectionPerformance: raw.sectionPerformance,
  };
}

function AppMain({ initialRoute }: { initialRoute?: string }) {
  const { user, loading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>(() => getInitialRoute(initialRoute));
  const [activeEditorConfig, setActiveEditorConfig] = useState<OMRConfig>(DEFAULT_OMR_CONFIG);

  const [savedSheets, setSavedSheets] = useState<OMRConfig[]>(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
    const cached = localStorage.getItem('omrwallah_saved_sheets');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (s: OMRConfig) =>
              s.id !== 'neet-200-full' && s.id !== 'jee-main-75' && s.id !== 'default-omr'
          );
        }
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  const [testResults, setTestResults] = useState<TestResult[]>(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
    const cached = localStorage.getItem('omrwallah_test_results');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeTestResult);
        }
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  const [activeResult, setActiveResult] = useState<TestResult | null>(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
    try {
      const cached = localStorage.getItem('omrwallah_test_results');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeTestResult(parsed[0]);
        }
      }
    } catch {}
    return null;
  });

  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup' }>({
    open: false,
    mode: 'login',
  });
  const [proModalOpen, setProModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [practiceZenMode, setPracticeZenMode] = useState<boolean>(false);

  // Keep '/' accessible when users click the brand logo; AuthModal onSuccess handles post-login redirect to dashboard

  // When user logs out, redirect protected workspace routes to marketing Home page
  useEffect(() => {
    if (!loading && !user && ['dashboard', 'settings', 'tests'].includes(currentRoute)) {
      setCurrentRoute('home');
    }
  }, [user, loading, currentRoute]);

  // Sync savedSheets to local storage
  useEffect(() => {
    try {
      localStorage.setItem('omrwallah_saved_sheets', JSON.stringify(savedSheets));
    } catch (e) {
      console.warn('Storage quota or disabled', e);
    }
  }, [savedSheets]);

  // Sync testResults to local storage
  useEffect(() => {
    try {
      localStorage.setItem('omrwallah_test_results', JSON.stringify(testResults));
    } catch (e) {
      console.warn('Storage quota or disabled', e);
    }
  }, [testResults]);

  // Sync savedSheets with Firestore when user is logged in
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserOMRSheets(user.uid, (firestoreSheets) => {
      if (firestoreSheets && firestoreSheets.length > 0) {
        setSavedSheets((prev) => {
          const firestoreIds = new Set(firestoreSheets.map((s) => s.id));
          const localOnly = prev.filter((s) => !firestoreIds.has(s.id));
          return [...firestoreSheets, ...localOnly];
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Sync testResults with Firestore when user is logged in
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserTestResults(user.uid, (firestoreResults) => {
      if (firestoreResults && firestoreResults.length > 0) {
        const normalized = firestoreResults.map(normalizeTestResult);
        setTestResults((prev) => {
          const firestoreIds = new Set(normalized.map((r) => r.id));
          const localOnly = prev.filter((r) => !firestoreIds.has(r.id));
          const merged = [...normalized, ...localOnly];
          if (!activeResult && merged.length > 0) {
            setActiveResult(merged[0]);
          }
          return merged;
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Sync route on browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update Document Title, Meta tags, and Structured JSON-LD on route change
  useEffect(() => {
    const seo = getRouteSEO(currentRoute);
    updatePageSEO(seo);
  }, [currentRoute]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleNavigate = (route: string) => {
    if (route === 'login' || route === 'signin' || route === 'auth') {
      setAuthModal({ open: true, mode: 'login' });
      return;
    }
    if (route === 'signup' || route === 'register') {
      setAuthModal({ open: true, mode: 'signup' });
      return;
    }
    setCurrentRoute(route);
    const targetPath = route === 'home' ? '/' : `/${route}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTemplate = (templateId: string) => {
    const tmpl = TEMPLATES_DATA.find((t) => t.id === templateId);
    if (tmpl) {
      setActiveEditorConfig({
        ...tmpl.config,
        id: `sheet-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      });
      handleNavigate('creator');
      showToast(`Loaded ${tmpl.name} into editor`, 'info');
    }
  };

  const handleSaveSheet = async (config: OMRConfig) => {
    setSavedSheets((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === config.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = config;
        return updated;
      }
      return [config, ...prev];
    });

    if (user) {
      try {
        await saveOMRSheetToFirestore(config, user.uid);
        showToast('Saved to Cloud Firestore!', 'success');
      } catch (err) {
        console.error('Firestore save error:', err);
        showToast('Saved locally (Cloud sync failed).', 'info');
      }
    } else {
      showToast('Saved locally. Sign in to sync across devices!', 'info');
    }
  };

  const handleDeleteSheet = async (id: string) => {
    setSavedSheets((prev) => prev.filter((s) => s.id !== id));
    if (user) {
      try {
        await deleteOMRSheetFromFirestore(id);
        showToast('Sheet deleted from cloud', 'info');
      } catch (err) {
        console.error('Firestore delete error:', err);
      }
    }
  };

  const handleDuplicateSheet = async (config: OMRConfig) => {
    const duplicated: OMRConfig = {
      ...config,
      id: `sheet-${Date.now()}`,
      title: `${config.title} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    setSavedSheets((prev) => [duplicated, ...prev]);
    if (user) {
      try {
        await saveOMRSheetToFirestore(duplicated, user.uid);
      } catch (err) {
        console.error(err);
      }
    }
    showToast('Sheet duplicated successfully', 'success');
  };

  const recordTestResult = async (result: TestResult) => {
    setActiveResult(result);
    setTestResults((prev) => [result, ...prev.filter((r) => r.id !== result.id)]);

    if (user) {
      try {
        await saveTestResultToFirestore(result, user.uid);
      } catch (err) {
        console.error('Error saving test result to firestore:', err);
      }
    }
  };

  const handleUpdateTestResult = async (updated: TestResult) => {
    setActiveResult(updated);
    setTestResults((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    if (user) {
      try {
        await saveTestResultToFirestore(updated, user.uid);
      } catch (err) {
        console.error('Error updating test result in firestore:', err);
      }
    }
  };

  const handleDeleteTestResult = async (id: string) => {
    setTestResults((prev) => {
      const remaining = prev.filter((r) => r.id !== id);
      if (activeResult?.id === id) {
        setActiveResult(remaining[0] || null);
      }
      return remaining;
    });
    if (user) {
      try {
        await deleteTestResultFromFirestore(id);
      } catch (err) {
        console.error('Error deleting test result from firestore:', err);
      }
    }
    showToast('Test result deleted.', 'info');
  };

  const handleViewResult = (testId: string) => {
    const found = testResults.find((r) => r.id === testId);
    if (found) {
      setActiveResult(found);
    }
    handleNavigate('results');
  };

  const handlePracticeComplete = async (
    marked: Record<number, string>,
    customKey?: Record<number, string>,
    testMeta?: {
      totalQuestions?: number;
      testName?: string;
      timeTaken?: string;
      sections?: { name: string; startQ: number; endQ: number }[];
    }
  ) => {
    let activeKey: Record<number, string> =
      customKey && Object.keys(customKey).length > 0 ? { ...customKey } : {};
    if (Object.keys(activeKey).length === 0) {
      try {
        const cached = localStorage.getItem('omrwallah_custom_answer_key');
        if (cached) activeKey = JSON.parse(cached);
      } catch (e) {
        console.warn(e);
      }
    }

    const totalQuestions = testMeta?.totalQuestions || 50;
    const finalAnswerKey: Record<number, string> = {};
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    for (let qNum = 1; qNum <= totalQuestions; qNum++) {
      const studentAns = marked[qNum];
      const keyAns = activeKey[qNum] || ['A', 'B', 'C', 'D'][(qNum * 3) % 4];
      finalAnswerKey[qNum] = keyAns;

      if (!studentAns) {
        unattemptedCount++;
      } else if (studentAns === keyAns) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }

    const attemptedCount = correctCount + wrongCount;
    const calculatedScore = correctCount * 4 - wrongCount * 1;
    const maxScore = totalQuestions * 4;
    const accuracy =
      attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

    // Build sectionPerformance matching SectionPerformance[]
    let sectionPerformance: SectionPerformance[] | undefined = undefined;
    if (testMeta?.sections && testMeta.sections.length > 0) {
      sectionPerformance = testMeta.sections.map((sec) => {
        let sCorrect = 0;
        let sWrong = 0;
        let sUnattempted = 0;
        for (let q = sec.startQ; q <= Math.min(totalQuestions, sec.endQ); q++) {
          const sAns = marked[q];
          const kAns = finalAnswerKey[q];
          if (!sAns) sUnattempted++;
          else if (sAns === kAns) sCorrect++;
          else sWrong++;
        }
        const sTotalQ = Math.max(1, Math.min(totalQuestions, sec.endQ) - sec.startQ + 1);
        const sScore = sCorrect * 4 - sWrong * 1;
        const sMax = sTotalQ * 4;
        const sAcc =
          sCorrect + sWrong > 0
            ? Math.round((sCorrect / (sCorrect + sWrong)) * 100)
            : 0;
        return {
          sectionName: sec.name,
          totalQuestions: sTotalQ,
          correct: sCorrect,
          wrong: sWrong,
          unattempted: sUnattempted,
          score: sScore,
          maxScore: sMax,
          accuracy: sAcc,
        };
      });
    }

    const newResult: TestResult = {
      id: `test-${Date.now()}`,
      sheetId: 'practice-omr',
      testName:
        testMeta?.testName || `Interactive Practice Test (${totalQuestions} Questions)`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      totalQuestions,
      attempted: attemptedCount,
      correct: correctCount,
      wrong: wrongCount,
      unattempted: unattemptedCount,
      score: calculatedScore,
      maxScore,
      accuracy,
      timeTaken: testMeta?.timeTaken || '00:00',
      answers: { ...marked },
      answerKey: finalAnswerKey,
      sectionPerformance,
    };

    await recordTestResult(newResult);
    handleNavigate('results');
  };

  const isAppWorkspaceRoute = [
    'dashboard',
    'creator',
    'templates',
    'saved',
    'tests',
    'practice',
    'scan',
    'results',
    'analytics',
    'profile',
    'settings',
  ].includes(currentRoute);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-500 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Top Header Navbar */}
      {(!practiceZenMode || currentRoute !== 'practice') && (
        <Navbar
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
          onUpgradePro={() => setProModalOpen(true)}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex w-full max-w-full overflow-x-hidden min-w-0">
        {/* Workspace Sidebar (visible in app modes on desktop) */}
        {isAppWorkspaceRoute && (!practiceZenMode || currentRoute !== 'practice') && (
          <Sidebar
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            onOpenProModal={() => setProModalOpen(true)}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          />
        )}

        {/* Dynamic Page Content */}
        <main
          className={`flex-1 min-w-0 w-full max-w-full overflow-x-hidden bg-slate-50 flex flex-col ${
            currentRoute === 'practice' ? 'pb-0' : 'pb-28 sm:pb-32 md:pb-8'
          }`}
        >
          {currentRoute === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
              onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
            />
          )}

          {currentRoute === 'creator' && (
            <OMRCreatorPage
              initialConfig={activeEditorConfig}
              onSaveSheet={handleSaveSheet}
              showToast={showToast}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'templates' && (
            <TemplatesPage
              onSelectTemplate={handleSelectTemplate}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              onViewResult={handleViewResult}
              testResults={testResults}
              savedSheetsCount={savedSheets.length}
            />
          )}

          {currentRoute === 'saved' && (
            <SavedSheetsPage
              savedSheets={savedSheets}
              onLoadSheet={(s) => {
                setActiveEditorConfig(s);
                handleNavigate('creator');
              }}
              onDeleteSheet={handleDeleteSheet}
              onDuplicateSheet={handleDuplicateSheet}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'tests' && (
            <MyTestsPage
              onViewResult={handleViewResult}
              onNavigate={handleNavigate}
              testResults={testResults}
              onDeleteResult={handleDeleteTestResult}
            />
          )}

          {currentRoute === 'practice' && (
            <PracticeOMRPage
              onCompleteTest={handlePracticeComplete}
              showToast={showToast}
              isZenMode={practiceZenMode}
              onToggleZenMode={() => setPracticeZenMode((prev) => !prev)}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'scan' && (
            <ScanOMRPage
              onScanComplete={async (result) => {
                if (result) {
                  await recordTestResult(result);
                }
                handleNavigate('results');
              }}
              showToast={showToast}
            />
          )}

          {currentRoute === 'results' && (
            <ResultsPage
              result={activeResult}
              testResults={testResults}
              onSelectResult={(res) => setActiveResult(res)}
              onUpdateResult={handleUpdateTestResult}
              onDeleteResult={handleDeleteTestResult}
              onRetake={() => handleNavigate('practice')}
              onNavigate={handleNavigate}
              showToast={showToast}
            />
          )}

          {currentRoute === 'analytics' && (
            <AnalyticsPage
              onNavigate={handleNavigate}
              testResults={testResults}
            />
          )}

          {currentRoute === 'pricing' && (
            <PricingPage
              onUpgradeClick={() => setProModalOpen(true)}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'blog' && (
            <BlogPage showToast={showToast} onNavigate={handleNavigate} />
          )}

          {currentRoute === 'faq' && <FAQPage showToast={showToast} />}

          {/* SEO Landing Pages */}
          {currentRoute === 'omr-sheet-generator' && (
            <OMRSheetGeneratorLanding
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {currentRoute === 'omr-sheet-maker' && (
            <OMRSheetMakerLanding
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {currentRoute === 'omr-sheet-pdf' && (
            <OMRSheetPdfLanding
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {currentRoute === 'online-omr-sheet' && (
            <OnlineOMRSheetLanding
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {currentRoute === 'omr-sheet-for-coaching' && (
            <OMRCoachingLanding
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {currentRoute === 'omr-sheet-for-schools' && (
            <OMRSchoolsLanding
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {currentRoute === 'omr-practice' && (
            <OMRPracticeLanding
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {/* Exam Hub & Guides */}
          {currentRoute === 'omr-exams' && (
            <ExamHubPage
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {currentRoute === 'neet-omr-sheet' && (
            <NeetOMRGuidePage
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {currentRoute === 'jee-omr-sheet' && (
            <JeeOMRGuidePage
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {currentRoute === 'ssc-omr-sheet' && (
            <SscOMRGuidePage
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {currentRoute === 'cuet-omr-sheet' && (
            <CuetOMRGuidePage
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {currentRoute === 'ctet-omr-sheet' && (
            <CtetOMRGuidePage
              onNavigate={handleNavigate}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {currentRoute === 'profile' && (
            <ProfilePage
              showToast={showToast}
              onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
            />
          )}

          {currentRoute === 'settings' && <SettingsPage showToast={showToast} />}

          {/* 404 Not Found Page */}
          {currentRoute === 'not-found' && (
            <div className="p-8 max-w-2xl mx-auto my-12 bg-white border border-slate-200 rounded-3xl shadow-xs text-center space-y-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 font-black text-2xl">
                404
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Page Not Found
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  The URL you requested does not match any OMRWallah page. Choose one of the workspaces below to continue:
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleNavigate(user ? 'dashboard' : 'home')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  {user ? 'Go to Dashboard' : 'Go to Home'}
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('creator')}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Create OMR Sheet
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('practice')}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Practice OMR Online
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('templates')}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Browse Templates
                </button>
              </div>
            </div>
          )}

          {/* Marketing Footer */}
          {!['creator', 'practice'].includes(currentRoute) && (
            <Footer onNavigate={handleNavigate} />
          )}
        </main>
      </div>

      {/* Global Overlays */}
      <AuthModal
        isOpen={authModal.open}
        mode={authModal.mode}
        onClose={() => setAuthModal({ open: false, mode: 'login' })}
        onSwitchMode={(mode) => setAuthModal({ open: true, mode })}
        onSuccess={() => {
          setAuthModal({ open: false, mode: 'login' });
          handleNavigate('dashboard');
          showToast('Welcome to OMRWallah!', 'success');
        }}
      />

      <ProUpgradeModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
        onSelectPlan={(plan) => {
          setProModalOpen(false);
          showToast(
            `You're on the early-access notification list for ${plan}! All core OMR Creator, PDF & Scanner features are unlocked for free.`,
            'info'
          );
        }}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Offline Connectivity Status */}
      <OfflineIndicator />

      {/* Mobile App Install Prompt Banner */}
      <PWAInstallButton
        variant="banner"
        onInstalled={() => showToast('OMRWallah App added to device!', 'success')}
      />

      {/* Mobile Bottom Navigation Bar */}
      {(!practiceZenMode || currentRoute !== 'practice') && (
        <MobileBottomNav
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export function App({ initialRoute }: { initialRoute?: string } = {}) {
  return (
    <AuthProvider>
      <AppMain initialRoute={initialRoute} />
    </AuthProvider>
  );
}

export default App;
