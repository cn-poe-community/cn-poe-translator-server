# cn-poe-translator-server

`cn-poe-translator`的本地服务。

本项目基于两个目的：

- 本地开发`cn-poe-export-db`和`cn-poe-translator`时，需要集成测试
- PoeCharm依赖于`cn-poe-export-db`和`cn-poe-translator`，但之前这两个项目是为`PoExport`服务的，个人很难测试它是否满足PoeCharm的需求

因此本项目提供了一个HTTP服务，它基于本地的`cn-poe-export-db`和`cn-poe-translator`开发版本，为POB提供翻译后的JSON数据。

## 使用方式

### 测试db和translator

使用`pnpm build`编译本地的`cn-poe-export-db`和`cn-poe-translator`，如果未修改可以跳过。

修改POB的`class/ImportTab.lua`中的`https://poe.game.qq.com/`为server的监听地址`localhost:8005/`，并重启。

在`index.ts`中填写cookie：

```
const cookie = "真实的腾讯cookie"
```

编译并执行：
```
pnpm build
node .\dist\index.js
```

之后就可以使用POB进行测试了。

### 测试creator

使用`pnpm build`编译本地的`cn-poe-export-db`、`cn-poe-translator`和`pob-building-creator`，如果未修改可以跳过。

如上，填写cookie，然后编译执行。访问以下地址（修改为真实的账户名称和角色名称）：

http://localhost:8005/transform?accountName=账户名称&character=角色名称

得到BD代码，导入POB中测试。
