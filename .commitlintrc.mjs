export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',     // 新功能
      'fix',      // 修復
      'docs',     // 文件
      'style',    // 格式
      'refactor', // 重構
      'test',     // 測試
      'chore',    // 雜項
      'perf',     // 性能
      'ci',       // CI/CD
      'build'     // 建置
    ]],
    'subject-max-length': [2, 'always', 50],
    'body-max-line-length': [2, 'always', 72]
  }
}