const
  path = require('path'),
  fse = require('fs-extra'),
  chalk = require('chalk')

const renderFile = function (fileName, api) {
  console.log(chalk.yellow(`    Copying ${fileName}`))
  fse.copySync(path.join(__dirname, 'templates', 'src-bex', 'js', fileName), path.join(api.resolve.bex('js'), fileName))
}

const chainWebpack = function (api, ctx, chain, { isClient }) {
  if (ctx.mode.bex) {
    const
      chunkManifest = 'chunk-manifest.json',
      bexDir = api.resolve.bex(''),
      initDir = api.ctx.dev ? bexDir : api.resolve.app('dist/bex/unpacked'),
      manifestPath = api.resolve.bex('manifest.json'),
      manifest = require(manifestPath),
      requiresInit = !manifest.background.scripts.includes('js/webRequestTransformer.js')

    // This might seem strange but we need Quasar to add the mode and copy the files before we can merge.
    // Note: We're not using api.render('./templates') in install.js because if we do, it'll create the
    // src-bex folder which means Quasar core won't and in turn won't copy the template files over.
    if (requiresInit) {
      const
        mergeWith = require('lodash.mergewith'),
        initManifest = require('./manifest')

      renderFile('initBexOverlay.js', api)
      renderFile('webRequestTransformer.js', api)

      console.log(chalk.yellow(`    Merging manifest.json`))
      const mergedManifest = mergeWith(manifest, initManifest, (objValue, srcValue) => {
        if (Array.isArray(objValue)) {
          // Need to account for content_scripts as we want that obj to merge
          if (objValue[0].hasOwnProperty('matches') && objValue[0].hasOwnProperty('js')) {
            objValue[0].js.concat(srcValue[0].js)
          } else {
            return objValue.concat(srcValue)
          }
        }
      })

      fse.writeFileSync(manifestPath, JSON.stringify(mergedManifest, null, 2))
    }

    // Generate a log of all chunks so they can be manually added to the
    // web browser for in page extensions.
    const Chunks2JsonPlugin = require('chunks-2-json-webpack-plugin')
    chain.plugin('chunks-2-json-webpack')
      .use(Chunks2JsonPlugin, [{
        outputDir: bexDir,
        filename: chunkManifest
      }])

      const TransformInit = require('./webpack/plugin.initTransformer')
      chain.plugin('webpack-transform-init')
        .use(TransformInit, [{
          src: initDir,
          fileName: 'initBexOverlay.js',
          chunkManifest: path.join(bexDir, chunkManifest)
        }])

    if (api.ctx.dev) {
      // Public path on dev so we can hijack and re-map to an extension URL
      chain.output.publicPath(`http://127.0.0.1/__q-bex_ext_id__`)

      // Don't watch our manifest file as this'll cause loops.
      const webpack = require('webpack')
      chain.plugin('watch-ignore')
        .use(webpack.WatchIgnorePlugin, [[path.join(bexDir, chunkManifest)]])

    }
  }
}

module.exports = function (api) {
  api.chainWebpack((chain, { isClient }) => chainWebpack(api, api.ctx, chain, isClient))
}
