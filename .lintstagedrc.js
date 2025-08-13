module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'vitest related --run'
  ],
  '*.{js,jsx,ts,tsx,md,html,css}': 'prettier --write',
  '*.{ts,tsx}': () => 'tsc --noEmit'
}