/** @type {import('tailwindcss').Config} */
// 色・文字の定義は docs/design/spec.md（3章・4章）が正
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#CCAD30', // 原案のゴールド（面・線・装飾）
          deep: '#8A6D0B',    // 文字・ボタン用の濃ゴールド（白地で4.9:1）
          shadow: '#5E4A07',  // ボタン下の影線
          line: '#E5D697',
        },
        cream: {
          50: '#FAF7EA',  // セクション背景・パンくず
          100: '#F7F3E0',
          200: '#F0E7C1', // 見出し帯・日付チップ
          300: '#EBDEAC',
        },
        ink: {
          DEFAULT: '#4C4C4C', // 本文
          sub: '#6B6B6B',     // 補足（白地で5.3:1）
        },
        line: '#D9D9D9',
        accent: {
          red: '#E44D32',      // 面（CTA・丸バッジ）
          'red-text': '#C93A20', // 文字・小さなタグ用
        },
        sns: {
          facebook: '#3B5998',
          x: '#000000',
          instagram: '#E1306C',
        },
      },
      fontFamily: {
        // 本文はOSの日本語フォント（読み込み0KB）、見出しだけWebフォント
        sans: ['"Hiragino Sans"', '"Hiragino Kaku Gothic ProN"', '"Noto Sans JP"', '"Yu Gothic UI"', 'Meiryo', 'sans-serif'],
        round: ['"M PLUS Rounded 1c"', '"Hiragino Maru Gothic ProN"', 'sans-serif'],
      },
      letterSpacing: {
        soft: '0.08em',
      },
      maxWidth: {
        content: '1060px',
      },
    },
  },
  plugins: [],
}
