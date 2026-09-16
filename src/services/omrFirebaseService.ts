import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OMRConfig, TestResult } from '../types/omr';

// Save or update OMR Sheet in Firestore
export const saveOMRSheetToFirestore = async (sheet: OMRConfig, userId: string): Promise<void> => {
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
};

// Delete OMR Sheet from Firestore
export const deleteOMRSheetFromFirestore = async (sheetId: string): Promise<void> => {
  const sheetDocRef = doc(db, 'omr_sheets', sheetId);
  await deleteDoc(sheetDocRef);
};

// Listen to user's saved OMR sheets in real-time
export const subscribeToUserOMRSheets = (
  userId: string,
  callback: (sheets: OMRConfig[]) => void
) => {
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
    console.error('Error fetching OMR sheets from Firestore:', error);
  });
};

// Save Test Result to Firestore
export const saveTestResultToFirestore = async (result: TestResult, userId: string): Promise<void> => {
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
};

// Listen to user's test results in real-time
export const subscribeToUserTestResults = (
  userId: string,
  callback: (results: TestResult[]) => void
) => {
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
    console.error('Error fetching test results from Firestore:', error);
  });
};
