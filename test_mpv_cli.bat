@echo off

REM 测试MPV命令行工具的音频输出
set MPV_PATH=libmpv\bin\mpv.exe

if exist "%MPV_PATH%" (
    echo Found MPV at %MPV_PATH%
    echo Testing audio playback...
    "%MPV_PATH%" --ao=wasapi --volume=100 --aid=1 --msg-level=all=info "f:\2.mkv" --start=0 --length=10
) else (
    echo MPV not found at %MPV_PATH%
    echo Looking for MPV in system path...
    mpv --ao=wasapi --volume=100 --aid=1 --msg-level=all=info "f:\2.mkv" --start=0 --length=10
)

pause
