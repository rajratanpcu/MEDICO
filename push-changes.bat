@echo off
setlocal enabledelayedexpansion

cd /d "c:\Users\hp\Desktop\AI-Powered Smart Medical Assistant for Patient Records, Report Analysis & Clinical"

echo.
echo === Git Status ===
git status
echo.

echo === Committing Changes ===
git commit -m "refactor: reorganize to industry-standard folder structure - complete refactoring with apps, infra, docs, data, automation, tests directories; update docker-compose and dockerfile paths; add comprehensive documentation"

echo.
echo === Pushing to GitHub ===
git push origin main

echo.
echo === Complete ===
pause
