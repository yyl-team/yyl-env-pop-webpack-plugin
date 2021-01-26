import path from 'path'
import { type } from 'yyl-util'
import chalk from 'chalk'
import { getHooks } from './hooks'
import { Entry, EntryObject, EntryItem, EntryObjectItem } from './types'
import { Compilation, DefinePlugin, Compiler, EntryNormalized } from 'webpack'

const PLUGIN_NAME = 'yylEnvPop'

export interface YylEnvPopWebpackPluginOption {
  /** 是否启用 */
  enable?: boolean
  /** 显示文本 */
  text?: string
  /** 显示时间 */
  duration?: number
  /** 过滤 true - 添加 js, false - 跳过 */
  filter?: (name: string) => boolean
}

export interface DefinePluginOption {
  [key: string]: string | number
}

type PluginOption = Required<YylEnvPopWebpackPluginOption>

type PluginEnv = Pick<PluginOption, 'enable' | 'text' | 'duration'>

/** 默认配置 */
const DEFAULT_ENV: PluginEnv = {
  enable: true,
  text: 'env-pop',
  duration: 3000
}

/** client 注入 js 地址 */
const CLIENT_JS_PATH = path.resolve(__dirname, '../client/client.js')

function toCtx<T>(ctx: any) {
  return ctx as T
}

interface InjectEntryOption {
  entry: EntryNormalized
  filter?: YylEnvPopWebpackPluginOption['filter']
  logger(...args: string[]): void
}

/** 往 entry 插入 js */
function injectEntry(op: InjectEntryOption) {
  const { entry, filter, logger } = op
  const iEntry = toCtx<Entry>(entry)
  function logInjectSuccess(ctx: string) {
    logger(`${chalk.cyan(ctx)} inject finished`)
  }

  if (type(iEntry) === 'array') {
    const rEntry = toCtx<string[]>(iEntry)
    if (rEntry.indexOf(CLIENT_JS_PATH) === -1) {
      rEntry.unshift(CLIENT_JS_PATH)
      logInjectSuccess(rEntry[rEntry.length - 1])
    }
    return toCtx<EntryNormalized>(rEntry)
  } else if (type(iEntry) === 'string') {
    const rEntry = [CLIENT_JS_PATH, iEntry as string]
    logInjectSuccess(rEntry[rEntry.length - 1])

    return toCtx<EntryNormalized>(rEntry)
  } else if (type(iEntry) === 'object') {
    const rEntry = toCtx<EntryObject>(iEntry)
    Object.keys(rEntry).forEach((key) => {
      if (filter && !filter(key)) {
        return
      }
      const entryObjItem = toCtx<EntryObjectItem>(rEntry[key])
      if (type(entryObjItem) === 'string') {
        rEntry[key] = [CLIENT_JS_PATH, rEntry[key] as string]
        logInjectSuccess(key)
      } else if (type(entryObjItem) === 'array') {
        rEntry[key] = [CLIENT_JS_PATH].concat(rEntry[key] as string[])
        logInjectSuccess(key)
      } else if (type(entryObjItem) === 'object') {
        const entryItem = toCtx<EntryItem>(entryObjItem)
        if (entryItem.import) {
          entryItem.import = [CLIENT_JS_PATH].concat(entryItem.import)
          logInjectSuccess(key)
        }
      }
    })
    return toCtx<EntryNormalized>(rEntry)
  } else {
    return toCtx<EntryNormalized>(iEntry)
  }
}

module.exports = class YylEnvPopWebpackPlugin {
  /** 默认配置 */
  env: PluginEnv = DEFAULT_ENV
  filter: YylEnvPopWebpackPluginOption['filter']

  static getHooks(compilation: Compilation) {
    return getHooks(compilation)
  }

  static getName() {
    return PLUGIN_NAME
  }

  constructor(op?: YylEnvPopWebpackPluginOption) {
    if (op?.enable !== undefined) {
      this.env.enable = op.enable
    }

    if (op?.duration !== undefined) {
      this.env.duration = op.duration
    }

    if (op?.text !== undefined) {
      this.env.text = op.text
    }

    if (op?.filter) {
      this.filter = op.filter
    }
  }

  apply(compiler: Compiler) {
    const { env, filter } = this

    const logger = compiler.getInfrastructureLogger(PLUGIN_NAME)
    logger.group(PLUGIN_NAME)
    if (!this.env.enable) {
      logger.info('disabled')
    } else {
      const { options } = compiler
      if (type(options.entry) === 'asyncfunction') {
        const asyncFn = toCtx<() => Promise<EntryNormalized>>(options.entry)
        options.entry = async function () {
          return injectEntry({
            entry: await asyncFn(),
            filter,
            logger(...args: string[]) {
              logger.info(...args)
            }
          })
        } as EntryNormalized
      } else {
        options.entry = injectEntry({
          entry: options.entry,
          filter,
          logger(...args: string[]) {
            logger.info(...args)
          }
        })
      }

      options.plugins.push(
        new DefinePlugin({
          'process.env.__YYL_ENV_POP': (() => {
            const r: DefinePluginOption = {}
            Object.keys(env).forEach((key) => {
              const iEnv = toCtx<any>(env[key as keyof PluginEnv])
              r[key] = type(iEnv) === 'string' ? JSON.stringify(iEnv) : iEnv
            })
            return r
          })()
        })
      )
      logger.info(`inited. text: ${env.text}, duration: ${env.duration}`)
    }
    logger.groupEnd()
  }
}
