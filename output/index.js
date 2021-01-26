/*!
 * yyl-env-pop-webpack-plugin cjs 1.0.0
 * (c) 2020 - 2021 jackness
 * Released under the MIT License.
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var yylUtil = require('yyl-util');
var chalk = _interopDefault(require('chalk'));
var tapable = require('tapable');
var webpack = require('webpack');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const weakMap = new WeakMap();
function createHooks() {
    return {
        emit: new tapable.AsyncSeriesWaterfallHook(['pluginArgs'])
    };
}
function getHooks(compilation) {
    let hooks = weakMap.get(compilation);
    if (hooks === undefined) {
        hooks = createHooks();
        weakMap.set(compilation, hooks);
    }
    return hooks;
}

const PLUGIN_NAME = 'yylEnvPop';
/** 默认配置 */
const DEFAULT_ENV = {
    enable: true,
    text: 'env-pop',
    duration: 3000
};
/** client 注入 js 地址 */
const CLIENT_JS_PATH = path.resolve(__dirname, '../client/client.js');
function toCtx(ctx) {
    return ctx;
}
/** 往 entry 插入 js */
function injectEntry(op) {
    const { entry, filter, logger } = op;
    const iEntry = toCtx(entry);
    function logInjectSuccess(ctx) {
        logger(`${chalk.cyan(ctx)} inject finished`);
    }
    if (yylUtil.type(iEntry) === 'array') {
        const rEntry = toCtx(iEntry);
        if (rEntry.indexOf(CLIENT_JS_PATH) === -1) {
            rEntry.unshift(CLIENT_JS_PATH);
            logInjectSuccess(rEntry[rEntry.length - 1]);
        }
        return toCtx(rEntry);
    }
    else if (yylUtil.type(iEntry) === 'string') {
        const rEntry = [CLIENT_JS_PATH, iEntry];
        logInjectSuccess(rEntry[rEntry.length - 1]);
        return toCtx(rEntry);
    }
    else if (yylUtil.type(iEntry) === 'object') {
        const rEntry = toCtx(iEntry);
        Object.keys(rEntry).forEach((key) => {
            if (filter && !filter(key)) {
                return;
            }
            const entryObjItem = toCtx(rEntry[key]);
            if (yylUtil.type(entryObjItem) === 'string') {
                rEntry[key] = [CLIENT_JS_PATH, rEntry[key]];
                logInjectSuccess(key);
            }
            else if (yylUtil.type(entryObjItem) === 'array') {
                rEntry[key] = [CLIENT_JS_PATH].concat(rEntry[key]);
                logInjectSuccess(key);
            }
            else if (yylUtil.type(entryObjItem) === 'object') {
                const entryItem = toCtx(entryObjItem);
                if (entryItem.import) {
                    entryItem.import = [CLIENT_JS_PATH].concat(entryItem.import);
                    logInjectSuccess(key);
                }
            }
        });
        return toCtx(rEntry);
    }
    else {
        return toCtx(iEntry);
    }
}
module.exports = class YylEnvPopWebpackPlugin {
    constructor(op) {
        /** 默认配置 */
        this.env = DEFAULT_ENV;
        if ((op === null || op === void 0 ? void 0 : op.enable) !== undefined) {
            this.env.enable = op.enable;
        }
        if ((op === null || op === void 0 ? void 0 : op.duration) !== undefined) {
            this.env.duration = op.duration;
        }
        if ((op === null || op === void 0 ? void 0 : op.text) !== undefined) {
            this.env.text = op.text;
        }
        if (op === null || op === void 0 ? void 0 : op.filter) {
            this.filter = op.filter;
        }
    }
    static getHooks(compilation) {
        return getHooks(compilation);
    }
    static getName() {
        return PLUGIN_NAME;
    }
    apply(compiler) {
        const { env, filter } = this;
        const logger = compiler.getInfrastructureLogger(PLUGIN_NAME);
        logger.group(PLUGIN_NAME);
        if (!this.env.enable) {
            logger.info('disabled');
        }
        else {
            const { options } = compiler;
            if (yylUtil.type(options.entry) === 'asyncfunction') {
                const asyncFn = toCtx(options.entry);
                options.entry = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return injectEntry({
                            entry: yield asyncFn(),
                            filter,
                            logger(...args) {
                                logger.info(...args);
                            }
                        });
                    });
                };
            }
            else {
                options.entry = injectEntry({
                    entry: options.entry,
                    filter,
                    logger(...args) {
                        logger.info(...args);
                    }
                });
            }
            options.plugins.push(new webpack.DefinePlugin({
                'process.env.__YYL_ENV_POP__': (() => {
                    const r = {};
                    Object.keys(env).forEach((key) => {
                        const iEnv = toCtx(env[key]);
                        r[key] = yylUtil.type(iEnv) === 'string' ? JSON.stringify(iEnv) : iEnv;
                    });
                    return r;
                })()
            }));
            logger.info(`inited. text: ${env.text}, duration: ${env.duration}`);
        }
        logger.groupEnd();
    }
};
