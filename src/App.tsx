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
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { ProUpgradeModal } from './components/common/ProUpgradeModal';
import { Toast, ToastMessage } from './components/common/Toast';

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
import { MOCK_SAMPLE_RESULT } from './data/mockData';

function AppMain() {
  const { user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [activeEditorConfig, setActiveEditorConfig] = useState<OMRConfig>(DEFAULT_OMR_CONFIG);
  
  const [savedSheets, setSavedSheets] = useState<OMRConfig[]>(() => {
    const cached = localStorage.getItem('omrwallah_saved_sheets');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // fallback
      }
    }
    return [
      DEFAULT_OMR_CONFIG,
      TEMPLATES_DATA[0].config,
      TEMPLATES_DATA[1].config,
    ];
  });

  const [activeResult, setActiveResult] = useState<TestResult>(MOCK_SAMPLE_RESULT);

  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'login' | 'signup' }>({
    open: false,
    mode: 'login',
  });
  const [proModalOpen, setProModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

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

  const handlePracticeComplete = async (marked: Record<number, string>) => {
    // Generate calculated test result based on marked answers
    let correctCount = 0;
    let wrongCount = 0;
    const totalQuestions = 50;

    const evaluatedQuestions = Array.from({ length: totalQuestions }, (_, i) => {
      const qNum = i + 1;
      const studentAns = marked[qNum];
      const correctAns = ['A', 'B', 'C', 'D'][(qNum * 3) % 4];

      let status: 'correct' | 'wrong' | 'skipped' = 'skipped';
      if (studentAns) {
        if (studentAns === correctAns) {
          status = 'correct';
          correctCount++;
        } else {
          status = 'wrong';
          wrongCount++;
        }
      }

      return {
        questionNo: qNum,
        studentAnswer: studentAns || null,
        correctAnswer: correctAns,
        status,
        subject: qNum <= 15 ? 'Physics' : qNum <= 30 ? 'Chemistry' : 'Biology',
      };
    });

    const calculatedScore = Math.max(0, correctCount * 4 - wrongCount * 1);
    const attemptedCount = correctCount + wrongCount;

    const newResult: TestResult = {
      id: `test-${Date.now()}`,
      testName: 'Interactive Practice Test #03',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalQuestions,
      attempted: attemptedCount,
      correct: correctCount,
      wrong: wrongCount,
      skipped: totalQuestions - attemptedCount,
      score: calculatedScore,
      totalMarks: 200,
      percentage: Math.round((calculatedScore / 200) * 100),
      timeTaken: '38m 20s',
      accuracy: attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0,
      subjectWise: [
        { subject: 'Physics', score: Math.round(correctCount * 0.3), total: 15, percentage: 70 },
        { subject: 'Chemistry', score: Math.round(correctCount * 0.35), total: 15, percentage: 80 },
        { subject: 'Biology', score: Math.round(correctCount * 0.35), total: 20, percentage: 85 },
      ],
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
    'creator',
    'dashboard',
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      
      {/* Top Header Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        onUpgradePro={() => setProModalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Workspace Sidebar (visible in app modes on desktop) */}
        {isAppWorkspaceRoute && currentRoute !== 'creator' && (
          <Sidebar
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            onOpenProModal={() => setProModalOpen(true)}
          />
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
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
            <TemplatesPage onSelectTemplate={handleSelectTemplate} />
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
            />
          )}

          {currentRoute === 'scan' && (
            <ScanOMRPage
              onScanComplete={() => setCurrentRoute('results')}
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
