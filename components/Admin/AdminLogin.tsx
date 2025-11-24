
import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [ password, setPassword ] = useState('');
  const { error: toastError } = useToast(); // Renamed to avoid conflict with removed local 'error' state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded validation for demo purposes
    if (password === 'admin123') { // Changed password and removed email check
      onLogin();
    } else {
      toastError('סיסמה שגויה'); // Using toast for error display
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black">כניסה למערכת ניהול</h2>
          <p className="text-gray-500 mt-2">אנא הזן פרטי גישה</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="admin@store.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
          >
            התחבר
          </button>
        </form>

        <button
          onClick={onBack}
          className="w-full mt-6 flex items-center justify-center gap-2 text-gray-500 hover:text-black font-medium text-sm"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לחנות
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;