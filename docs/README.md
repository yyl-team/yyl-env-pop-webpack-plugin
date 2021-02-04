yyl-env-pop-webpack-plugin / [Exports](modules.md)

# yyl-env-pop-webpack-plugin

用于注入 entry 下的 pop 弹窗插件， 用来方便调试时识别当前环境是线上还是本地

## install

```bash
npm i yyl-env-pop-webpack-plugin --save
```

## USAGE

```javascript
// webpack.config.js
const YylEnvPopWebpackPlugin = require('yyl-env-pop-webpack-plugin')
module.exports = {
  plugins: [
    new YylEnvPopWebpackPlugin({
      text: 'hello world',
      duration: 3000
      enable: true
    })
  ]
}

```

## ts

直接看 types 吧

```typescript
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
```
