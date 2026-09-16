import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  saveOMRSheetToFirestore,
  deleteOMRSheetFromFirestore,
  subscribeToUserOMRSheets,
  saveTestResultToFirestore,
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

import { OMRConfig, TestResult } from './types/omr';
import { DEFAULT_OMR_CONFIG, TEMPLATES_DATA } from './data/templates';

function AppMain() {
  const { user, loading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [activeEditorConfig, setActiveEditorConfig] = useState<OMRConfig>(DEFAULT_OMR_CONFIG);
  
  const [savedSheets, setSavedSheets] = useState<OMRConfig[]>(() => {
    const cached = localStorage.getItem('omrwallah_saved_sheets');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          // Exclude default demo templates so user starts with a clean slate
          return parsed.filter(
            (s: OMRConfig) => s.id !== 'neet-200-full' && s.id !== 'jee-main-75' && s.id !== 'default-omr'
          );
        }
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  const [activeResult, setActiveResult] = useState<TestResult | null>(null);

  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup' }>({
    open: false,
    mode: 'login',
  });
  const [proModalOpen, setProModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [practiceZenMode, setPracticeZenMode] = useState<boolean>(false);

  // Auto-redirect logged-in users to Dashboard (so mobile/desktop immediately show workspace)
  useEffect(() => {
    if (!loading && user && currentRoute === 'home') {
      setCurrentRoute('dashboard');
    }
  }, [user, loading, currentRoute]);

  // When user logs out, redirect to marketing Home page
  useEffect(() => {
    if (!loading && !user && ['dashboard', 'profile', 'settings', 'tests'].includes(currentRoute)) {
      setCurrentRoute('home');
    }
  }, [user, loading, currentRoute]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('omrwallah_saved_sheets', JSON.stringify(savedSheets));
    } catch (e) {
      console.warn('Storage quota or disabled', e);
    }
  }, [savedSheets]);

  // Sync with Firestore when user is logged in
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserOMRSheets(user.uid, (firestoreSheets) => {
      if (firestoreSheets && firestoreSheets.length > 0) {
        setSavedSheets((prev) => {
          // Merge firestore sheets with local defaults if needed
          const firestoreIds = new Set(firestoreSheets.map((s) => s.id));
          const localOnly = prev.filter((s) => !firestoreIds.has(s.id));
          return [...firestoreSheets, ...localOnly];
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
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
      setCurrentRoute('creator');
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

    // Save to Firestore if user is authenticated
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
    // Check if customKey exists in parameter or localStorage
    let activeKey: Record<number, string> = customKey && Object.keys(customKey).length > 0 ? customKey : {};
    if (Object.keys(activeKey).length === 0) {
      try {
        const cached = localStorage.getItem('omrwallah_custom_answer_key');
        if (cached) activeKey = JSON.parse(cached);
      } catch (e) {
        console.warn(e);
      }
    }

    let correctCount = 0;
    let wrongCount = 0;
    const totalQuestions = testMeta?.totalQuestions || 50;

    const evaluatedQuestions = Array.from({ length: totalQuestions }, (_, i) => {
      const qNum = i + 1;
      const studentAns = marked[qNum];
      const correctAns = activeKey[qNum] || null;

      let status: 'correct' | 'wrong' | 'skipped' = 'skipped';
      if (studentAns) {
        if (correctAns) {
          if (studentAns === correctAns) {
            status = 'correct';
            correctCount++;
          } else {
            status = 'wrong';
            wrongCount++;
          }
        } else {
          // If no key was configured, mark as attempted
          status = 'correct';
          correctCount++;
        }
      }

      // Subject determination from sections if provided
      let subject = 'General';
      if (testMeta?.sections && testMeta.sections.length > 0) {
        const matchingSection = testMeta.sections.find((s) => qNum >= s.startQ && qNum <= s.endQ);
        if (matchingSection) {
          subject = matchingSection.name;
        }
      } else {
        subject =
          qNum <= Math.round(totalQuestions * 0.3)
            ? 'Physics'
            : qNum <= Math.round(totalQuestions * 0.6)
            ? 'Chemistry'
            : 'Biology';
      }

      return {
        questionNo: qNum,
        studentAnswer: studentAns || null,
        correctAnswer: correctAns || (studentAns || 'A'),
        status,
        subject,
      };
    });

    const calculatedScore = Math.max(0, correctCount * 4 - wrongCount * 1);
    const attemptedCount = correctCount + wrongCount;
    const totalMarks = totalQuestions * 4;

    // Build subjectWise summary
    let subjectWiseList: { subject: string; score: number; total: number; percentage: number }[] = [];
    if (testMeta?.sections && testMeta.sections.length > 0) {
      subjectWiseList = testMeta.sections.map((sec) => {
        const secQuestions = evaluatedQuestions.filter(
          (q) => q.questionNo >= sec.startQ && q.questionNo <= sec.endQ
        );
        const secCorrect = secQuestions.filter(
          (q) => q.status === 'correct' && q.studentAnswer !== null
        ).length;
        const secWrong = secQuestions.filter((q) => q.status === 'wrong').length;
        const secScore = Math.max(0, secCorrect * 4 - secWrong * 1);
        const secTotalMarks = (sec.endQ - sec.startQ + 1) * 4;
        const secPercentage = secTotalMarks > 0 ? Math.round((secScore / secTotalMarks) * 100) : 0;
        return {
          subject: sec.name,
          score: secScore,
          total: secTotalMarks,
          percentage: secPercentage,
        };
      });
    } else {
      const pCount = Math.round(totalQuestions * 0.3);
      const cCount = Math.round(totalQuestions * 0.3);
      const bCount = totalQuestions - pCount - cCount;

      const pCorrect = evaluatedQuestions.filter((q) => q.subject === 'Physics' && q.status === 'correct').length;
      const cCorrect = evaluatedQuestions.filter((q) => q.subject === 'Chemistry' && q.status === 'correct').length;
      const bCorrect = evaluatedQuestions.filter((q) => q.subject === 'Biology' && q.status === 'correct').length;

      subjectWiseList = [
        { subject: 'Physics', score: pCorrect * 4, total: pCount * 4, percentage: pCount > 0 ? Math.round((pCorrect / pCount) * 100) : 0 },
        { subject: 'Chemistry', score: cCorrect * 4, total: cCount * 4, percentage: cCount > 0 ? Math.round((cCorrect / cCount) * 100) : 0 },
        { subject: 'Biology', score: bCorrect * 4, total: bCount * 4, percentage: bCount > 0 ? Math.round((bCorrect / bCount) * 100) : 0 },
      ];
    }

    const newResult: TestResult = {
      id: `test-${Date.now()}`,
      testName: testMeta?.testName || `Interactive Practice Test (${totalQuestions} Questions)`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalQuestions,
      attempted: attemptedCount,
      correct: correctCount,
      wrong: wrongCount,
      skipped: totalQuestions - attemptedCount,
      score: calculatedScore,
      totalMarks,
      percentage: totalMarks > 0 ? Math.round((calculatedScore / totalMarks) * 100) : 0,
      timeTaken: testMeta?.timeTaken || '38m 20s',
      accuracy: attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0,
      subjectWise: subjectWiseList,
      questions: evaluatedQuestions,
    };

    setActiveResult(newResult);

    // Save test result to Firestore if user logged in
    if (user) {
      try {
        await saveTestResultToFirestore(newResult, user.uid);
      } catch (err) {
        console.error('Error saving test result to firestore:', err);
      }
    }

    setCurrentRoute('results');
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
        <main className={`flex-1 min-w-0 w-full max-w-full overflow-x-hidden bg-slate-50 flex flex-col ${
          currentRoute === 'practice' ? 'pb-0' : 'pb-28 sm:pb-32 md:pb-8'
        }`}>
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
              onViewResult={() => setCurrentRoute('results')}
            />
          )}

          {currentRoute === 'saved' && (
            <SavedSheetsPage
              savedSheets={savedSheets}
              onSelectSheet={(s) => {
                setActiveEditorConfig(s);
                setCurrentRoute('creator');
              }}
              onDeleteSheet={handleDeleteSheet}
              onDuplicateSheet={handleDuplicateSheet}
              onNavigate={handleNavigate}
              showToast={showToast}
            />
          )}

          {currentRoute === 'tests' && (
            <MyTestsPage
              onViewResult={() => setCurrentRoute('results')}
              onNavigate={handleNavigate}
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
              onScanComplete={(result) => {
                if (result) {
                  setActiveResult(result);
                }
                setCurrentRoute('results');
              }}
              showToast={showToast}
            />
          )}

          {currentRoute === 'results' && (
            <ResultsPage
              result={activeResult}
              onNavigate={handleNavigate}
              showToast={showToast}
            />
          )}

          {currentRoute === 'analytics' && <AnalyticsPage />}

          {currentRoute === 'pricing' && (
            <PricingPage
              onUpgradePro={() => setProModalOpen(true)}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === 'blog' && <BlogPage showToast={showToast} />}

          {currentRoute === 'faq' && <FAQPage showToast={showToast} />}

          {currentRoute === 'profile' && (
            <ProfilePage
              showToast={showToast}
              onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
            />
          )}

          {currentRoute === 'settings' && <SettingsPage showToast={showToast} />}

          {/* Marketing Footer (for Home, Pricing, Blog, FAQ, Templates) */}
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
          setCurrentRoute('dashboard');
          showToast('Welcome to OMRWallah!', 'success');
        }}
      />

      <ProUpgradeModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
        onUpgrade={() => {
          setProModalOpen(false);
          showToast('Upgraded to Pro Plan successfully!', 'success');
        }}
        onSelectPlan={(plan) => {
          setProModalOpen(false);
          showToast(`Subscribed to ${plan} Plan successfully!`, 'success');
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

      {/* Mobile Bottom Navigation Bar (Home, Create, Practice, Results, Profile) */}
      <MobileBottomNav
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppMain />
    </AuthProvider>
  );
}
