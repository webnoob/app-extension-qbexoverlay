const
  path = require('path')

const chainWebpack = function (api, ctx, chain, { isClient }) {
  const
    chunkManifest = 'chunk-manifest.json',
    bexDir = api.resolve.bex(''),
    initDir = api.ctx.dev ? bexDir : api.resolve.app('dist/bex/unpacked')
  
    if (ctx.mode.bex) {
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
