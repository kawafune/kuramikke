import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '0710') {
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] px-4" role="dialog" aria-modal="true" aria-labelledby="login-title" onClick={onClose}>
      <div className="bg-white border-t-4 border-gold p-8 w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
        
        {/* アイコン */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-cream-50 rounded-full">
            <Lock className="text-gold-deep" size={32} />
          </div>
        </div>

        {/* ★変更: タイトル */}
        <h2 id="login-title" className="text-xl text-center text-gold-deep mb-2">
          開発中の画面を見る
        </h2>
        
        {/* ★変更: 説明文 */}
        <p className="text-sm text-center mb-6 leading-relaxed">
          公開前のページを見るための<br/>パスワードを入力してください。
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
              placeholder="パスワード" 
              aria-label="パスワード"
              className="w-full text-center text-lg py-3 border-2 border-gold rounded focus:outline-none focus:border-gold-deep placeholder:text-ink-sub"
              autoFocus
            />
            {error && (
              <p className="text-accent-red-text text-sm text-center mt-2 font-bold" role="alert">
                パスワードが違います
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] bg-gold-deep text-white font-round font-bold tracking-[0.1em] rounded shadow-[0_3px_0_theme(colors.gold.shadow)] hover:brightness-110 active:translate-y-[2px] active:shadow-none"
          >
            見る
          </button>
        </form>
      </div>
    </div>
  );
};