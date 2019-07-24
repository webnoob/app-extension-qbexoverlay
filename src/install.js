/**
 * Quasar App Extension install script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/install-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/InstallAPI.js
 */
const merge = require('lodash').merge

function mergeManifest (existingPath) {

}

module.exports = function (api) {
  api.render('./templates')
  mergeManifest(api.resolve.bex('manifest.json'))
}
