import { AsyncSeriesWaterfallHook } from 'tapable'
import { Compilation } from 'webpack'

const weakMap = new WeakMap()
export function createHooks() {
  return {
    emit: new AsyncSeriesWaterfallHook(['pluginArgs'])
  }
}

export function getHooks(compilation: Compilation) {
  let hooks = weakMap.get(compilation)
  if (hooks === undefined) {
    hooks = createHooks()
    weakMap.set(compilation, hooks)
  }
  return hooks
}
