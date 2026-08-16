//go:build noembed

package main

import "io/fs"

// 前后端分离构建（go build -tags noembed）：
// 不内嵌前端，前端静态文件由 Nginx 等反向代理直接托管，后端仅提供 API。
//
// 部署要求（二选一）：
//  1. 设置环境变量 FRONTEND_BASE_URL 指向前端站点地址，后端收到页面类请求时跳转过去；
//  2. 或将 Nginx 配置为：静态资源由 Nginx 提供，API 前缀反向代理到本服务（推荐，性能更好）。
var buildFS fs.FS = nil
var indexPage []byte = []byte("")
