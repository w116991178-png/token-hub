@echo off
setlocal EnableDelayedExpansion

REM ============================================================
REM build.bat — new-api 前后端分离部署构建（Linux）
REM 前端编译为静态文件 (release/frontend)，由 Nginx 托管；
REM 后端编译为 new-api 二进制（不内嵌前端，-tags noembed），仅提供 API。
REM 用法:  build.bat [amd64|arm64]
REM   build.bat            -> linux/amd64
REM   build.bat arm64      -> linux/arm64
REM ============================================================

REM 无论在哪里调用，都切换到脚本所在目录（项目根）
cd /d "%~dp0"

REM 确保 bun 在 PATH 中（官方安装器默认装到 %USERPROFILE%\.bun\bin）
set "BUN_BIN=%USERPROFILE%\.bun\bin"
if exist "%BUN_BIN%\bun.exe" set "PATH=%BUN_BIN%;%PATH%"

set "GOOS_TARGET=linux"
set "GOARCH_TARGET=amd64"
if not "%~1"=="" set "GOARCH_TARGET=%~1"

set "OUT_DIR=release"
set "BIN_NAME=new-api"

REM ---------- 推导版本号 ----------
set "VERSION="
for /f "tokens=*" %%v in ('git describe --tags --always 2^>nul') do set "VERSION=%%v"
if "%VERSION%"=="" set "VERSION=v0.0.0"

echo ============================================================
echo  new-api 分离部署构建
echo  GOOS=%GOOS_TARGET% GOARCH=%GOARCH_TARGET% VERSION=%VERSION%
echo ============================================================

REM ---------- [1/5] 构建前端静态文件 ----------
echo [1/5] 构建前端 (web) ...
where bun >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 bun，请先安装: https://bun.sh
    exit /b 1
)
cd web
call bun install
if errorlevel 1 exit /b 1
set "DISABLE_ESLINT_PLUGIN=true"
set "VITE_REACT_APP_VERSION=%VERSION%"
call bun run build
if errorlevel 1 exit /b 1
cd ..
if not exist "web\dist\index.html" (
    echo [错误] 前端构建产物缺失: web/dist/index.html
    exit /b 1
)

REM ---------- [2/5] 交叉编译后端（不内嵌前端） ----------
echo [2/5] 交叉编译后端 (-tags noembed) ...
set "CGO_ENABLED=0"
set "GOOS=%GOOS_TARGET%"
set "GOARCH=%GOARCH_TARGET%"
set "GOWORK=off"
go build -trimpath -tags noembed -ldflags "-s -w -X 'github.com/QuantumNous/new-api/common.Version=%VERSION%'" -o "%BIN_NAME%"
if errorlevel 1 exit /b 1
if not exist "%BIN_NAME%" (
    echo [错误] 后端编译失败: %BIN_NAME%
    exit /b 1
)

REM ---------- [3/5] 打包后端 ----------
echo [3/5] 打包后端 ...
if exist "%OUT_DIR%" rmdir /s /q "%OUT_DIR%"
mkdir "%OUT_DIR%"
copy /y "%BIN_NAME%" "%OUT_DIR%\%BIN_NAME%" >nul
if exist "LICENSE" copy /y "LICENSE" "%OUT_DIR%\" >nul
if exist "NOTICE" copy /y "NOTICE" "%OUT_DIR%\" >nul
if exist "THIRD-PARTY-LICENSES.md" copy /y "THIRD-PARTY-LICENSES.md" "%OUT_DIR%\" >nul
if exist "README.md" copy /y "README.md" "%OUT_DIR%\" >nul
if exist "bin\*.sql" (
    mkdir "%OUT_DIR%\bin"
    copy /y "bin\*.sql" "%OUT_DIR%\bin\" >nul
)

REM ---------- [4/5] 打包前端静态文件 + Nginx 配置 ----------
echo [4/5] 打包前端静态文件与 Nginx 配置 ...
xcopy "web\dist" "%OUT_DIR%\frontend\" /E /I /Y >nul
if exist "deploy\nginx\new-api.conf" (
    mkdir "%OUT_DIR%\nginx"
    copy /y "deploy\nginx\new-api.conf" "%OUT_DIR%\nginx\" >nul
)

REM ---------- [5/5] 完成 ----------
echo [5/5] 构建完成。
echo.
echo 部署包已生成在: %OUT_DIR%\
dir "%OUT_DIR%"
echo.
echo ===== 部署方式（前后端分离）=====
echo 1) 前端：将 %OUT_DIR%\frontend\ 部署到 Nginx 的 root 目录
echo 2) 后端：在 Linux 运行 ./%BIN_NAME% （默认 3000 端口）
echo 3) Nginx：参考 %OUT_DIR%\nginx\new-api.conf，将 API 前缀反代到后端
echo    （前端使用同源相对请求，无需额外 CORS 配置）
echo.
echo 也可设置环境变量 FRONTEND_BASE_URL 指向前端站点地址作为兜底。
endlocal
