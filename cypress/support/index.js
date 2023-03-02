// index.js
const customCommands = require('./commands.js')

module.exports = {
  commands: customCommands,
  supportFile: "cypress/support/index.ts"
}
