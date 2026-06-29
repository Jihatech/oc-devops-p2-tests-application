@echo off
REM Lanceur double-cliquable pour la demo EtuBibliotheque.
REM Execute demo-start.ps1 en contournant la politique d'execution PowerShell.
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0demo-start.ps1"
