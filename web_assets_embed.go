//go:build !noembed

package main

import "embed"

// 默认（ bundled ）构建：将前端 web/dist 编译进二进制，由后端直接对外提供页面。
//
//go:embed web/dist
var buildFS embed.FS

//go:embed web/dist/index.html
var indexPage []byte
