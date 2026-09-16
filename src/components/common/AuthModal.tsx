import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  mode?: 'login' | 'signup';
  onClose: () => void;
  onSwitchMode?: (mode: 'login' | 'signup') => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode = 'login',
  onClose,
  onSwitchMode,
  onSuccess,
}) => {
  const { signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const [activeMode, setActiveMode] = useState<'login' | 'signup'>(mode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    setActiveMode(mode);
    setErrorMsg(null);
    setErrorCode(null);
    setResetSent(false);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setErrorCode(null);
    setResetSent(false);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanConfirmPassword = confirmPassword.trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!cleanPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (activeMode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (cleanPassword.length < 6) {
        setErrorMsg('Password should be at least 6 characters long.');
        return;
      }
      if (cleanPassword !== cleanConfirmPassword) {
        setErrorMsg('Password aur Confirm Password match nahi kar rahe hain. Please verify again.');
        return;
      }
    }

    setLoading(true);

    try {
      if (activeMode === 'login') {
        await signInWithEmail(cleanEmail, cleanPassword);
      } else {
        await signUpWithEmail(cleanEmail, cleanPassword, name.trim());
      }
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      console.error('Authentication error:', err);
      const code = err.code || '';
      setErrorCode(code);

      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setErrorMsg('Invalid email or password. If you forgot your password, you can reset it below or switch to sign up.');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg(`An account with "${cleanEmail}" already exists. Please sign in below.`);
      } else if (code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters long.');
      } else if (code === 'auth/invalid-email') {
        setErrorMsg('Please enter a valid email address.');
      } else if (code === 'auth/too-many-requests') {
        setErrorMsg('Too many failed attempts. Please reset your password or wait a moment.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
      }
    }
  };

  const handleResetPassword = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your email address in the field above to receive the password reset link.');
      return;
    }
    setResetLoading(true);
    setErrorMsg(null);
    try {
      await resetPassword(cleanEmail);
      setResetSent(true);
      setErrorMsg(null);
      setErrorCode(null);
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setErrorMsg('No user found with this email. Please click "Sign Up" to create an account.');
      } else {
        setErrorMsg('Could not send password reset email. Please verify the email address.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setActiveMode(newMode);
    setErrorMsg(null);
    setErrorCode(null);
    setResetSent(false);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (onSwitchMode) onSwitchMode(newMode);
  };

  const passwordsMatch = activeMode === 'signup' && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = activeMode === 'signup' && confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#121722] text-slate-100 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-800">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 mb-2.5 border border-blue-500/20 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            {activeMode === 'login' ? 'Welcome Back!' : 'Join OMRWallah Free'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {activeMode === 'login'
              ? 'Sign in to access your cloud-saved OMR sheets and test history'
              : 'Start creating, practicing, and evaluating your OMRs in the cloud'}
          </p>
        </div>

        {/* Password reset success banner */}
        {resetSent && (
          <div className="mb-4 p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-xs text-emerald-200 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-emerald-300">Password Reset Link Sent!</p>
              <p className="text-[11px] text-emerald-400/90 mt-0.5 leading-relaxed">
                Check your email inbox or spam folder for instructions to reset your password, then return here to sign in.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-xs text-rose-200 space-y-2 animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMsg}</div>
            </div>

            {/* Smart resolution button when email already exists */}
            {errorCode === 'auth/email-already-in-use' && (
              <div className="flex items-center gap-2 pt-2 border-t border-rose-500/20">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-lg cursor-pointer text-xs transition-colors"
                >
                  Sign In to this Account →
                </button>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                  className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 font-bold rounded-lg hover:bg-slate-700 cursor-pointer text-xs transition-colors"
                >
                  {resetLoading ? 'Sending...' : 'Reset Password'}
                </button>
              </div>
            )}

            {/* Smart resolution button when password/credential is invalid */}
            {(errorCode === 'auth/invalid-credential' ||
              errorCode === 'auth/wrong-password' ||
              errorCode === 'auth/user-not-found') && (
              <div className="flex items-center gap-2 pt-2 border-t border-rose-500/20">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-lg cursor-pointer text-xs transition-colors"
                >
                  {resetLoading ? 'Sending Link...' : 'Email Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 font-bold rounded-lg hover:bg-slate-700 cursor-pointer text-xs transition-colors"
                >
                  Sign Up New
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {activeMode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ritik Kumar"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#181f2c] border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#181f2c] border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-200">
                Password
              </label>
              {activeMode === 'login' && (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>{resetLoading ? 'Sending...' : 'Forgot Password?'}</span>
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-[#181f2c] border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer p-0.5"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Added for signup mode) */}
          {activeMode === 'signup' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-200">
                  Confirm Password
                </label>
                {passwordsMatch && (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </span>
                )}
                {passwordsMismatch && (
                  <span className="text-[11px] font-bold text-rose-400">
                    Does not match
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3 top-3 ${passwordsMismatch ? 'text-rose-400' : 'text-slate-400'}`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-[#181f2c] text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                    passwordsMismatch
                      ? 'border border-rose-500 focus:ring-rose-500/40 focus:border-rose-500'
                      : passwordsMatch
                      ? 'border border-emerald-500/80 focus:ring-emerald-500/40 focus:border-emerald-500'
                      : 'border border-slate-700 focus:ring-blue-500/40 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer p-0.5"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{activeMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle mode (Already have an account? Sign In / Don't have an account? Sign Up) */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {activeMode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-blue-400 font-extrabold hover:underline cursor-pointer ml-1"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-blue-400 font-extrabold hover:underline cursor-pointer ml-1"
              >
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

