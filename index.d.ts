declare class YylEnvPopWebpackPlugin {
  constructor(op: YylEnvPopWebpackPluginOptions)
}
interface YylEnvPopWebpackPluginOptions {
  /** 是否启用 */
  enable?: boolean
  /** 显示文本 */
  text?: string
  /** 显示时间 */
  duration?: number
}
export = YylEnvPopWebpackPlugin 