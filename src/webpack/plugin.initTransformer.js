const
  fse = require('fs-extra'),
  path = require('path')


class PluginInitTransformer {
  constructor (options) {
    this.options = options
  }

  apply (compiler) {
    compiler.hooks.done.tap('done-compiling', async () => {
      if (fse.existsSync(this.options.chunkManifest)) {
        const manData = fse.readFileSync(this.options.chunkManifest)
        const data = fse.readFileSync(path.join(this.options.src, 'js', this.options.fileName))
        const varData = `const BEXChunkData=${manData.toString()};`
        let newValue = data.toString().indexOf('BEXChunkData=') > -1
          ? data.toString().replace(/const[ .*]BEXChunkData.*};/g, varData)
          : varData + data.toString()
        fse.writeFileSync(path.join(this.options.src, 'js', this.options.fileName), newValue, 'utf-8')
      }
    })
  }
}

module.exports = PluginInitTransformer
