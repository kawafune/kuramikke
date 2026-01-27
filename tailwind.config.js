/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
        'bounce-slow': "bounce 3s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
      colors: {
        primary: {
          DEFAULT: '#333333',
          light: '#666666',
        },
        accent: {
          green: '#4F8E5D',
          orange: '#F4A460', // ボタンなどで使用するオレンジ
          gold: '#C8A040',   // 落ち着いたゴールド（強調用）
        },
        bg: {
          light: '#F9FAFB',
          warm: '#f9ecd3',   // ★追加：メインの温かい背景色
        }
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}