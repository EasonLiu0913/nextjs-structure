module.exports = {
  types: [
    { value: 'feat', name: '✨ feat:     新功能' },
    { value: 'fix', name: '🐛 fix:      修復 bug' },
    { value: 'docs', name: '📚 docs:     文件更新' },
    { value: 'style', name: '💎 style:    程式碼格式調整' },
    { value: 'refactor', name: '📦 refactor: 重構程式碼' },
    { value: 'perf', name: '🚀 perf:     性能優化' },
    { value: 'test', name: '🚨 test:     測試相關' },
    { value: 'chore', name: '🔧 chore:    建置或輔助工具' },
    { value: 'ci', name: '⚙️ ci:       CI/CD 相關' },
    { value: 'build', name: '🛠️ build:    建置系統' }
  ],
  scopes: [
    { name: 'auth' },
    { name: 'ui' },
    { name: 'api' },
    { name: 'i18n' },
    { name: 'config' },
    { name: 'test' }
  ],
  messages: {
    type: '選擇提交類型:',
    scope: '選擇影響範圍 (可選):',
    subject: '簡短描述:',
    body: '詳細描述 (可選):',
    breaking: '重大變更說明 (可選):',
    footer: '關聯 issue (可選):'
  },
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 50
}