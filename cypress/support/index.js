// index.js
const customCommands = require('./commands.ts')

module.exports = {
  commands: customCommands,
  supportFile: "cypress/support/index.ts"
};
