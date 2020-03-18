const { getHooks } = require('./lib/hooks')
const PLUGIN_NAME = 'yylEnvPop'
const path = require('path')
const LANG = require('./lang/index')
const fs = require('fs')
const chalk = require('chalk')

class YylEnvPopWebpackPlugin {
  constructor(op) {
    this.cnt = fs.readFileSync(path.join(__dirname, './client/client.js')).toString()
    this.env = Object.assign({
      enable: true,
      text: 'env-pop',
      duration: 3000
    }, op)
  }
  static getName() {
    return PLUGIN_NAME
  }
  static getHooks(compilation) {
    return getHooks(compilation)
  }

  appendScript(source) {
    const { env, cnt } = this
    const r = `${source.toString()};\r\nwindow.__YYL_ENV_POP_OPTION=${JSON.stringify(env)};${cnt}`
    return Buffer.from(r)
  }
  apply(compiler) {
    const { env } = this
    // const { output, context } = compiler.options
    compiler.hooks.emit.tap(
      PLUGIN_NAME,
      (compilation) => {
        const logger = compilation.getLogger(PLUGIN_NAME)
        const iHooks = getHooks(compilation)
        logger.group(PLUGIN_NAME)

        if (!env.enable) {
          logger.info(LANG.DISABLE)
        } else {
          const entrys = []
          compilation.chunks.forEach((chunk) => {
            chunk.files.forEach((fName) => {
              console.log(fName)
              if (
                chunk.name &&
                path.extname(fName) === '.js'
              ) {
                console.log(chunk.name)
                entrys.push(fName)
              }
            })
          })
          entrys.forEach((assetName) => {
            const rCnt = this.appendScript(compilation.assets[assetName].source())
            logger.info(`${LANG.APPEND_SCRIPT}: ${chalk.cyan(assetName)}`)
            compilation.assets[assetName] = {
              source() {
                return rCnt
              },
              size() {
                return rCnt.length
              }
            }
            compilation.hooks.moduleAsset.call({
              userRequest: assetName
            }, assetName)
          })
        }

        iHooks.emit.promise()
        logger.groupEnd()
      }
    )
  }
}

module.exports = YylEnvPopWebpackPlugin