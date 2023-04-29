@echo off

setlocal EnableDelayedExpansion

FOR /f "tokens=*" %%i IN ('dir D:\phpstudy\WWW\honda\honda\public\images\BRE\SR /b') DO (
set aa=%%i
set bb=!aa:SR_SR=SR!
ren "%%i" "!bb!"
)