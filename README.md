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
[./index.d.ts](./index.d.ts)
