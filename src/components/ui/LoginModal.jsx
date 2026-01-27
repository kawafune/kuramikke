import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '0710') {
      onLogin();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative transform transition-all scale-100">
        
        {/* アイコン */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-orange-50 rounded-full">
            <Lock className="text-[#F4A460]" size={32} />
          </div>
        </div>

        {/* ★変更: タイトル */}
        <h2 className="text-xl font-bold text-center text-[#333] mb-2">
          入館許可
        </h2>
        
        {/* ★変更: 説明文 */}
        <p className="text-sm text-[#666] text-center mb-6 leading-relaxed">
          この先のページを閲覧するために<br/>パスワードを入力してください。
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              // ★変更: プレースホルダー
              placeholder="Pass: 0123" 
              className="w-full text-center text-lg py-3 border-2 border-[#F4A460] rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-100 text-[#333] placeholder-gray-300"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-xs text-center mt-2 font-bold">
                パスワードが違います
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#4F8E5D] hover:bg-[#3d7a4b] text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 shadow-lg"
          >
            認証して進む
          </button>
        </form>
      </div>
    </div>
  );
};