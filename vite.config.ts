import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'

// 「いま表示している画面が、最新の版か」を、開発モードで確かめるための目印。
// ビルドのたびに、版の名前（Gitの短いID）と時刻を作り、画面の中に埋め込む（__BUILD__）と同時に、/version.json としても配る。
// 開発モードの帯の「最新か確認」は、この2つを比べる。
const gitId = () => {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
  try { return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() } catch { return 'local' }
}
const build = { id: gitId(), builtAt: new Date().toISOString() }

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'emit-version-json',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify(build) })
      },
    },
  ],
  define: { __BUILD__: JSON.stringify(build) },
})
