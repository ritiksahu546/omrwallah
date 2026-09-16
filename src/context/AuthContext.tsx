import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  institute: string;
  targetExam: string;
  rollNumber: string;
  plan: 'free' | 'pro' | 'coaching';
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create user document in Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            const defaultProfile: UserProfile = {
              userId: currentUser.uid,
              name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Student',
              email: currentUser.email || '',
              role: 'student',
              institute: 'Allen Career Institute (Kota)',
              targetExam: 'NEET UG 2026',
              rollNumber: '24058912',
              plan: 'free',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            try {
              await setDoc(userDocRef, defaultProfile);
            } catch (writeErr) {
              console.warn('Could not write profile to Firestore immediately:', writeErr);
            }
            setUserProfile(defaultProfile);
          }
        } catch (err) {
          console.warn('Error fetching user profile from Firestore, using offline profile fallback:', err);
          setUserProfile({
            userId: currentUser.uid,
            name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Student',
            email: currentUser.email || '',
            role: 'student',
            institute: 'Allen Career Institute (Kota)',
            targetExam: 'NEET UG 2026',
            rollNumber: '24058912',
            plan: 'free',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      const userDocRef = doc(db, 'users', result.user.uid);
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        const newProfile: UserProfile = {
          userId: result.user.uid,
          name: result.user.displayName || 'Student',
          email: result.user.email || '',
          role: 'student',
          institute: 'Apex Medical Academy',
          targetExam: 'NEET UG 2026',
          rollNumber: '24058912',
          plan: 'free',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    await signInWithEmailAndPassword(auth, cleanEmail, pass.trim());
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass.trim());
    if (res.user) {
      const newProfile: UserProfile = {
        userId: res.user.uid,
        name: name?.trim() || cleanEmail.split('@')[0],
        email: res.user.email || cleanEmail,
        role: 'student',
        institute: 'OMR Coaching Academy',
        targetExam: 'NEET / JEE 2026',
        rollNumber: 'OMR' + Math.floor(100000 + Math.random() * 900000),
        plan: 'free',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', res.user.uid), newProfile);
      setUserProfile(newProfile);
    }
  };

  const resetPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    await sendPasswordResetEmail(auth, cleanEmail);
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const updated = {
      ...(userProfile || {}),
      ...data,
      updatedAt: new Date().toISOString(),
    } as UserProfile;
    await setDoc(userDocRef, updated, { merge: true });
    setUserProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logOut,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
