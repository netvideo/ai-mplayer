@echo off

rem 运行应用程序并捕获输出
cd "%~dp0"
echo 运行应用程序...
"src-tauri\target\release\ai-mplayer.exe"
echo 应用程序退出代码: %errorlevel%
echo 按任意键退出...
pause
