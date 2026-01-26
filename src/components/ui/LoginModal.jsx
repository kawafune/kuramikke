import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '0710') {
      onLoginSuccess();
    } else {
      setError('パスワードが違います');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        <div className="text-center mb-6">
          <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="text-orange-500" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">関係者認証</h3>
          <p className="text-sm text-gray-500 mt-2">
            プロトタイプ閲覧のため
            <br />
            パスワードを入力してください。
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Pass: 0710"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-lg tracking-widest"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm font-bold text-center">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold shadow hover:bg-green-700 transition-colors"
          >
            認証して進む
          </button>
        </form>
      </div>
    </div>
  );
};
