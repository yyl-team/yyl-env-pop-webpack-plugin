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

    if (type(options.entry) === 'array') {
      if (options.entry.indexOf(jsPath) === -1) {
        options.entry.push(jsPath)
      }
    } else if (type(options.entry) === 'string') {
      options.entry = [options.entry, jsPath]
    } else if (type(options.entry) === 'object') {
      Object.keys(options.entry).forEach((key) => {
        if (type(options.entry[key]) === 'array') {
          if (options.entry[key].indexOf(jsPath) === -1) {
            options.entry[key].push(jsPath)
          }
        } else if (type(options.entry[key]) === 'string') {
          options.entry[key] = [options.entry[key], jsPath]
        }
      })
    }
    options.plugins.push(new webpack.DefinePlugin({
      'process.env.__YYL_ENV_POP__': (() => {
        const r = {}
        Object.keys(env).forEach((key) => {
          r[key] = type(env[key]) === 'string' ? `'${env[key]}'` : env[key]
        })
        return r
      })()
    }))
  }
}

module.exports = YylEnvPopWebpackPlugin