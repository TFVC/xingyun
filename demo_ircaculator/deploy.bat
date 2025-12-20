@echo off
REM BebeTools 热像仪计算工具部署脚本 (Windows)
REM 支持多种部署方式

setlocal enabledelayedexpansion

echo 🚀 BebeTools 部署脚本 (Windows)
echo ========================

REM 检查部署类型参数
set DEPLOY_TYPE=%1
if "%DEPLOY_TYPE%"=="" set DEPLOY_TYPE=local

if "%DEPLOY_TYPE%"=="local" (
    echo 📍 启动本地开发服务器...
    echo 访问地址: http://localhost:8080
    python -m http.server 8080
    goto :end
)

if "%DEPLOY_TYPE%"=="vercel" (
    echo ☁️ 部署到 Vercel...
    where vercel >nul 2>nul
    if errorlevel 1 (
        echo ❌ Vercel CLI 未安装，正在安装...
        npm install -g vercel
    )
    vercel --prod
    echo ✅ Vercel 部署完成！
    goto :end
)

if "%DEPLOY_TYPE%"=="netlify" (
    echo 🌐 部署到 Netlify...
    where netlify >nul 2>nul
    if errorlevel 1 (
        echo ❌ Netlify CLI 未安装，正在安装...
        npm install -g netlify-cli
    )
    netlify deploy --prod --dir .
    echo ✅ Netlify 部署完成！
    goto :end
)

if "%DEPLOY_TYPE%"=="docker" (
    echo 🐳 构建 Docker 镜像...
    docker build -t bebetools:latest .
    echo 🚀 启动 Docker 容器...
    docker run -d -p 8080:80 --name bebetools-container bebetools:latest
    echo ✅ Docker 部署完成！访问地址: http://localhost:8080
    goto :end
)

if "%DEPLOY_TYPE%"=="github" (
    echo 📚 部署到 GitHub Pages...
    where gh-pages >nul 2>nul
    if errorlevel 1 (
        echo ❌ gh-pages 未安装，正在安装...
        npm install -g gh-pages
    )
    gh-pages -d .
    echo ✅ GitHub Pages 部署完成！
    goto :end
)

if "%DEPLOY_TYPE%"=="build" (
    echo 🔨 构建项目...
    echo 📁 检查文件完整性...
    
    REM 检查必要文件
    if not exist "index.html" (
        echo ❌ index.html 文件缺失
        exit /b 1
    )
    
    if not exist "assets" (
        echo ❌ assets 目录缺失
        exit /b 1
    )
    
    echo ✅ 所有文件检查完成，项目已准备好部署！
    goto :end
)

REM 未知部署类型
echo ❌ 未知的部署类型: %DEPLOY_TYPE%
echo.
echo 支持的部署类型:
echo   local    - 本地开发服务器 (默认)
echo   vercel   - 部署到 Vercel
echo   netlify  - 部署到 Netlify
echo   docker   - Docker 容器化部署
echo   github   - 部署到 GitHub Pages
echo   build    - 构建检查
echo.
echo 使用方法: deploy.bat [部署类型]
echo 示例: deploy.bat vercel
exit /b 1

:end
echo 🎉 部署完成！
pause