@echo off
REM Script para inicializar Git e fazer push para GitHub (Windows)
REM Execute este script no diretório do projeto

echo 🚀 Iniciando configuração do Git e push para GitHub...
echo.

REM Verificar se Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git não está instalado. Por favor, instale o Git primeiro.
    echo Download: https://git-scm.com/downloads
    pause
    exit /b 1
)

REM Solicitar informações do usuário
set /p GITHUB_USERNAME="Digite seu nome de usuário do GitHub: "
set /p REPO_NAME="Digite o nome do repositório (padrão: revisor-lrco): "
if "%REPO_NAME%"=="" set REPO_NAME=revisor-lrco

echo.
echo 📝 Configurando Git...

REM Configurar Git (se ainda não configurado)
for /f "delims=" %%i in ('git config --global user.name') do set GIT_NAME=%%i
if "%GIT_NAME%"=="" (
    set /p GIT_NAME="Digite seu nome para commits: "
    git config --global user.name "%GIT_NAME%"
)

for /f "delims=" %%i in ('git config --global user.email') do set GIT_EMAIL=%%i
if "%GIT_EMAIL%"=="" (
    set /p GIT_EMAIL="Digite seu email para commits: "
    git config --global user.email "%GIT_EMAIL%"
)

echo.
echo 📦 Inicializando repositório Git...

REM Inicializar Git (se ainda não inicializado)
if not exist .git (
    git init
    echo ✅ Repositório Git inicializado
) else (
    echo ℹ️  Repositório Git já existe
)

echo.
echo ➕ Adicionando arquivos...
git add .

echo.
echo 💾 Fazendo commit inicial...
git commit -m "Initial commit: Revisor de LRCO implementation"

echo.
echo 🔗 Adicionando repositório remoto...
git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git 2>nul
if errorlevel 1 (
    git remote set-url origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
)

echo.
echo 📤 Fazendo push para GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ Concluído!
echo.
echo 🌐 Seu repositório está em: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo.
echo 📋 Próximos passos:
echo 1. Acesse https://render.com e faça login
echo 2. Crie um novo Static Site
echo 3. Conecte seu repositório: %GITHUB_USERNAME%/%REPO_NAME%
echo 4. Configure:
echo    - Build Command: npm install ^&^& npm run build
echo    - Publish Directory: dist
echo 5. Clique em 'Create Static Site'
echo.
echo Para mais detalhes, consulte DEPLOY.md
echo.
pause
