import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Lock, User, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface LoginViewProps {
  onSuccess: () => void;
}

export default function LoginView({ onSuccess }: LoginViewProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all security fields.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const success = await login(username, password);
    setIsSubmitting(false);

    if (success) {
      onSuccess();
    } else {
      setError("Invalid administrative credentials. Hint: use admin / admin");
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8" id="login-view-container">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-100 bg-white p-8 shadow-md"
      >
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-amber-400">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-sans text-2xl font-semibold tracking-tight text-neutral-900">
              Merchant Authentication
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Access the high-performance Aura inventory management system.
            </p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 rounded-xl bg-rose-50 border border-rose-150 p-4 text-xs text-rose-800"
            id="login-error-alert"
          >
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-600" />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} id="login-form">
          <div className="space-y-4">
            <div>
              <label htmlFor="username-input" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Username
              </label>
              <div className="relative flex items-center bg-neutral-50 rounded-xl border border-neutral-200 px-3.5 py-2.5 focus-within:border-neutral-950 transition-colors">
                <User className="h-4 w-4 text-neutral-400 shrink-0" />
                <input
                  id="username-input"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="ml-2.5 w-full text-xs text-neutral-800 outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password-input" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center bg-neutral-50 rounded-xl border border-neutral-200 px-3.5 py-2.5 focus-within:border-neutral-950 transition-colors">
                <Lock className="h-4 w-4 text-neutral-400 shrink-0" />
                <input
                  id="password-input"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="ml-2.5 w-full text-xs text-neutral-800 outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            id="btn-login-submit"
            disabled={isSubmitting}
            className="group relative flex w-full justify-center rounded-xl bg-neutral-900 py-3 px-4 text-xs font-semibold text-white hover:bg-neutral-800 transition-all active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-1.5">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Authenticating...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1">
                <span>Unlock Merchant Hub</span>
                <Sparkles className="h-4 w-4 text-amber-300" />
              </span>
            )}
          </button>
        </form>

        <div className="border-t border-neutral-100 pt-4 text-center">
          <p className="text-[10px] text-neutral-400 uppercase font-mono tracking-widest leading-relaxed">
            Administrative access only. Use <strong className="text-neutral-600">admin</strong> / <strong className="text-neutral-600">admin</strong> to sample the console.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
