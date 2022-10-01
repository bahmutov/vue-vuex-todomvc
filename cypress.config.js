const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: false,
  projectId: '4kdnzs',
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: false
  },
})
