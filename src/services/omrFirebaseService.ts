import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { OMRConfig, TestResult } from '../types/omr';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Save or update OMR Sheet in Firestore (enforces authenticated user ownership & rules compatibility)
export const saveOMRSheetToFirestore = async (sheet: OMRConfig, userId: string): Promise<void> => {
  const activeUid = auth.currentUser?.uid || userId;
  if (!activeUid) {
    throw new Error('User must be authenticated to save OMR sheets to Firestore');
  }
  const path = `omr_sheets/${sheet.id}`;
  try {
    const sheetDocRef = doc(db, 'omr_sheets', sheet.id);
    await setDoc(
      sheetDocRef,
      {
        ...sheet,
        userId: activeUid,
        title: sheet.title || 'Untitled OMR Sheet',
        questionsCount: typeof sheet.questionsCount === 'number' ? sheet.questionsCount : 50,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

// Delete OMR Sheet from Firestore
export const deleteOMRSheetFromFirestore = async (sheetId: string): Promise<void> => {
  const path = `omr_sheets/${sheetId}`;
  try {
    const sheetDocRef = doc(db, 'omr_sheets', sheetId);
    await deleteDoc(sheetDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
};

// Fetch single OMR Sheet from Firestore (supports intentional public templates or owner access)
export const getOMRSheetFromFirestore = async (sheetId: string): Promise<OMRConfig | null> => {
  const path = `omr_sheets/${sheetId}`;
  try {
    const sheetDocRef = doc(db, 'omr_sheets', sheetId);
    const snap = await getDoc(sheetDocRef);
    if (snap.exists()) {
      return snap.data() as OMRConfig;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    throw error;
  }
};

// Listen to user's saved OMR sheets in real-time (strictly bounded to owner UID)
export const subscribeToUserOMRSheets = (
  userId: string,
  callback: (sheets: OMRConfig[]) => void
) => {
  const activeUid = auth.currentUser?.uid || userId;
  if (!activeUid) {
    callback([]);
    return () => {};
  }
  const path = 'omr_sheets';
  const q = query(
    collection(db, 'omr_sheets'),
    where('userId', '==', activeUid)
  );

  return onSnapshot(q, (snapshot) => {
    const sheets: OMRConfig[] = [];
    snapshot.forEach((docSnap) => {
      sheets.push(docSnap.data() as OMRConfig);
    });
    // Sort by updatedAt descending
    sheets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    callback(sheets);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

// Fetch user's saved OMR sheets one-shot (strictly bounded to owner UID)
export const getUserOMRSheets = async (userId: string): Promise<OMRConfig[]> => {
  const activeUid = auth.currentUser?.uid || userId;
  if (!activeUid) return [];
  const path = 'omr_sheets';
  try {
    const q = query(collection(db, 'omr_sheets'), where('userId', '==', activeUid));
    const snap = await getDocs(q);
    const sheets: OMRConfig[] = [];
    snap.forEach((docSnap) => {
      sheets.push(docSnap.data() as OMRConfig);
    });
    sheets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return sheets;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
};

// Listen to public OMR templates (preserves intentional public access)
export const subscribeToPublicOMRSheets = (
  callback: (sheets: OMRConfig[]) => void
) => {
  const path = 'omr_sheets';
  const q = query(
    collection(db, 'omr_sheets'),
    where('isPublic', '==', true)
  );

  return onSnapshot(q, (snapshot) => {
    const sheets: OMRConfig[] = [];
    snapshot.forEach((docSnap) => {
      sheets.push(docSnap.data() as OMRConfig);
    });
    sheets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    callback(sheets);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

// Save Test Result to Firestore (enforces authenticated user ownership & rules compatibility)
export const saveTestResultToFirestore = async (result: TestResult, userId: string): Promise<void> => {
  const activeUid = auth.currentUser?.uid || userId;
  if (!activeUid) {
    throw new Error('User must be authenticated to save test results to Firestore');
  }
  const path = `test_results/${result.id}`;
  try {
    const resultDocRef = doc(db, 'test_results', result.id);
    await setDoc(
      resultDocRef,
      {
        ...result,
        userId: activeUid,
        testName: result.testName || 'Practice Test',
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

// Delete Test Result from Firestore
export const deleteTestResultFromFirestore = async (resultId: string): Promise<void> => {
  const path = `test_results/${resultId}`;
  try {
    const resultDocRef = doc(db, 'test_results', resultId);
    await deleteDoc(resultDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
};

// Listen to user's test results in real-time (strictly bounded to owner UID)
export const subscribeToUserTestResults = (
  userId: string,
  callback: (results: TestResult[]) => void
) => {
  const activeUid = auth.currentUser?.uid || userId;
  if (!activeUid) {
    callback([]);
    return () => {};
  }
  const path = 'test_results';
  const q = query(
    collection(db, 'test_results'),
    where('userId', '==', activeUid)
  );

  return onSnapshot(q, (snapshot) => {
    const results: TestResult[] = [];
    snapshot.forEach((docSnap) => {
      results.push(docSnap.data() as TestResult);
    });
    callback(results);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

// Fetch user's test results one-shot (strictly bounded to owner UID)
export const getUserTestResults = async (userId: string): Promise<TestResult[]> => {
  const activeUid = auth.currentUser?.uid || userId;
  if (!activeUid) return [];
  const path = 'test_results';
  try {
    const q = query(collection(db, 'test_results'), where('userId', '==', activeUid));
    const snap = await getDocs(q);
    const results: TestResult[] = [];
    snap.forEach((docSnap) => {
      results.push(docSnap.data() as TestResult);
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
};

