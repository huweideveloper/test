鉴影
![](https://img.shields.io/badge/chrome-1.0.0-519dd9.svg)
![](https://img.shields.io/badge/platform-chrome-lightgrey.svg)
![](https://img.shields.io/badge/language-javaScript-orange.svg)
![coverage](http://baochai:7201/plat/hello/badges/master/coverage.svg)

## 相关资料

- [框架介绍](https://wiki.fosun.com/pages/viewpage.action?pageId=16453043)

- [安装软件](https://wiki.fosun.com/pages/viewpage.action?pageId=16453050)

- [Apache 配置](https://wiki.fosun.com/pages/viewpage.action?pageId=16453059)（还需将 httpd.conf 中的 LoadModule proxy_http_module modules/mod_proxy_http.so 注释打开）

## 开发环境启动

根目录执行 webpack --watch 后启动 Apache 服务

### 开发环境

```js
// 智健
npm run dev:zj
// 技研所
npm run dev:jys

```

### 发布项目

```js
// 智健
npm run build:zj
// 技研所
npm run build:jys

```
