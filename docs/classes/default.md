[yyl-env-pop-webpack-plugin](../README.md) / [Exports](../modules.md) / default

# Class: default

## Hierarchy

* **default**

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [env](default.md#env)
- [filter](default.md#filter)

### Methods

- [apply](default.md#apply)
- [getHooks](default.md#gethooks)
- [getName](default.md#getname)

## Constructors

### constructor

\+ **new default**(`op?`: [*YylEnvPopWebpackPluginOption*](../interfaces/yylenvpopwebpackpluginoption.md)): [*default*](default.md)

#### Parameters:

Name | Type |
------ | ------ |
`op?` | [*YylEnvPopWebpackPluginOption*](../interfaces/yylenvpopwebpackpluginoption.md) |

**Returns:** [*default*](default.md)

Defined in: [index.ts:106](https://github.com/jackness1208/yyl-env-pop-webpack-plugin/blob/1a16e55/src/index.ts#L106)

## Properties

### env

• **env**: *Pick*<*Required*<[*YylEnvPopWebpackPluginOption*](../interfaces/yylenvpopwebpackpluginoption.md)\>, *enable* \| *text* \| *duration*\>

默认配置

Defined in: [index.ts:97](https://github.com/jackness1208/yyl-env-pop-webpack-plugin/blob/1a16e55/src/index.ts#L97)

___

### filter

• **filter**: *undefined* \| (`name`: *string*) => *boolean*

Defined in: [index.ts:98](https://github.com/jackness1208/yyl-env-pop-webpack-plugin/blob/1a16e55/src/index.ts#L98)

## Methods

### apply

▸ **apply**(`compiler`: *Compiler*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`compiler` | *Compiler* |

**Returns:** *void*

Defined in: [index.ts:126](https://github.com/jackness1208/yyl-env-pop-webpack-plugin/blob/1a16e55/src/index.ts#L126)

___

### getHooks

▸ `Static`**getHooks**(`compilation`: *Compilation*): *any*

#### Parameters:

Name | Type |
------ | ------ |
`compilation` | *Compilation* |

**Returns:** *any*

Defined in: [index.ts:100](https://github.com/jackness1208/yyl-env-pop-webpack-plugin/blob/1a16e55/src/index.ts#L100)

___

### getName

▸ `Static`**getName**(): *string*

**Returns:** *string*

Defined in: [index.ts:104](https://github.com/jackness1208/yyl-env-pop-webpack-plugin/blob/1a16e55/src/index.ts#L104)
