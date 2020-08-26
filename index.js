const path = require('path')
const fs = require('fs')
const { type } = require('yyl-util')
const webpack = require('webpack')

class YylEnvPopWebpackPlugin {
  constructor(op) {
    this.cnt = fs.readFileSync(path.join(__dirname, './client/client.js')).toString()
    this.env = Object.assign({
      enable: true,
      text: 'env-pop',
      duration: 3000
    }, op)
  }

  apply(compiler) {
    const { env } = this
    const { options } = compiler
    const jsPath = path.resolve(__dirname, './client/client.js')

    if (!env.enable) {
      return
    }
    function initEntry (entry) {
      if (type(entry) === 'array') {
        if (entry.indexOf(jsPath) === -1) {
          entry.push(jsPath)
        }
      } else if (type(entry) === 'string') {
        entry = [entry, jsPath]
      } else if (type(entry) === 'object') {
        Object.keys(entry).forEach((key) => {
          if (env.filter && !env.filter(key)) {
            return;
          }
          if (type(entry[key]) === 'array') {
            if (entry[key].indexOf(jsPath) === -1) {
              entry[key].unshift(jsPath)
            }
          } else if (type(entry[key]) === 'string') {
            entry[key] = [entry[key], jsPath]
          }
        })
      }
      return entry
    }

    if (type(options.entry) === 'asyncfunction') {
      const asyncFn = options.entry
      options.entry = async function () {
        return initEntry(await asyncFn())
      }
    } else {
      options.entry = initEntry(options.entry)
    }

    options.plugins.push(new webpack.DefinePlugin({
      'process.env.__YYL_ENV_POP__': (() => {
        const r = {}
        Object.keys(env).forEach((key) => {
          if (type(env[key]) === 'function') {
            return
          }
          r[key] = type(env[key]) === 'string' ? `'${env[key]}'` : env[key]
        })
        return r
      })()
    }))
  }
}

module.exports = YylEnvPopWebpackPlugin