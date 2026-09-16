import {
  collection,
  doc,
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

// Save or update OMR Sheet in Firestore
export const saveOMRSheetToFirestore = async (sheet: OMRConfig, userId: string): Promise<void> => {
  const path = `omr_sheets/${sheet.id}`;
  try {
    const sheetDocRef = doc(db, 'omr_sheets', sheet.id);
    await setDoc(
      sheetDocRef,
      {
        ...sheet,
        userId,
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

// Listen to user's saved OMR sheets in real-time
export const subscribeToUserOMRSheets = (
  userId: string,
  callback: (sheets: OMRConfig[]) => void
) => {
  const path = 'omr_sheets';
  const q = query(
    collection(db, 'omr_sheets'),
    where('userId', '==', userId)
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

// Save Test Result to Firestore
export const saveTestResultToFirestore = async (result: TestResult, userId: string): Promise<void> => {
  const path = `test_results/${result.id}`;
  try {
    const resultDocRef = doc(db, 'test_results', result.id);
    await setDoc(
      resultDocRef,
      {
        ...result,
        userId,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

// Listen to user's test results in real-time
export const subscribeToUserTestResults = (
  userId: string,
  callback: (results: TestResult[]) => void
) => {
  const path = 'test_results';
  const q = query(
    collection(db, 'test_results'),
    where('userId', '==', userId)
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
