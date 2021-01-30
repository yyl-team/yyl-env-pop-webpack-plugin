import { Compilation, Compiler } from 'webpack';
export interface YylEnvPopWebpackPluginOption {
    /** 是否启用 */
    enable?: boolean;
    /** 显示文本 */
    text?: string;
    /** 显示时间 */
    duration?: number;
    /** 过滤 true - 添加 js, false - 跳过 */
    filter?: (name: string) => boolean;
}
export interface DefinePluginOption {
    [key: string]: string | number;
}
declare type PluginOption = Required<YylEnvPopWebpackPluginOption>;
declare type PluginEnv = Pick<PluginOption, 'enable' | 'text' | 'duration'>;
export default class YylEnvPopWebpackPlugin {
    /** 默认配置 */
    env: PluginEnv;
    filter: YylEnvPopWebpackPluginOption['filter'];
    static getHooks(compilation: Compilation): any;
    static getName(): string;
    constructor(op?: YylEnvPopWebpackPluginOption);
    apply(compiler: Compiler): void;
}
export {};
