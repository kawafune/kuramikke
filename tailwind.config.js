/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4CAF50', // 信頼感のある緑（病院・施設）
          dark: '#388E3C',
          light: '#C8E6C9',
        },
        accent: {
          DEFAULT: '#FF9800', // 温かみのあるオレンジ（暮らし・コミュニティ）
          hover: '#F57C00',
          light: '#FFE0B2',
        },
        text: {
          main: '#333333', // 読みやすい濃いグレー
          sub: '#666666',
        },
        bg: {
          base: '#FAF9F6', // 目に優しいオフホワイト
        },
      },
      fontFamily: {
        sans: ['"Hiragino Kaku Gothic ProN"', '"Noto Sans JP"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
