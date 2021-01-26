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
