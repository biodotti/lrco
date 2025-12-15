#!/bin/bash

# Script para inicializar Git e fazer push para GitHub
# Execute este script no diretório do projeto

echo "🚀 Iniciando configuração do Git e push para GitHub..."
echo ""

# Verificar se Git está instalado
if ! command -v git &> /dev/null
then
    echo "❌ Git não está instalado. Por favor, instale o Git primeiro."
    echo "Download: https://git-scm.com/downloads"
    exit 1
fi

# Solicitar informações do usuário
read -p "Digite seu nome de usuário do GitHub: " GITHUB_USERNAME
read -p "Digite o nome do repositório (padrão: revisor-lrco): " REPO_NAME
REPO_NAME=${REPO_NAME:-revisor-lrco}

echo ""
echo "📝 Configurando Git..."

# Configurar Git (se ainda não configurado)
if [ -z "$(git config --global user.name)" ]; then
    read -p "Digite seu nome para commits: " GIT_NAME
    git config --global user.name "$GIT_NAME"
fi

if [ -z "$(git config --global user.email)" ]; then
    read -p "Digite seu email para commits: " GIT_EMAIL
    git config --global user.email "$GIT_EMAIL"
fi

echo ""
echo "📦 Inicializando repositório Git..."

# Inicializar Git (se ainda não inicializado)
if [ ! -d .git ]; then
    git init
    echo "✅ Repositório Git inicializado"
else
    echo "ℹ️  Repositório Git já existe"
fi

echo ""
echo "➕ Adicionando arquivos..."
git add .

echo ""
echo "💾 Fazendo commit inicial..."
git commit -m "Initial commit: Revisor de LRCO implementation"

echo ""
echo "🔗 Adicionando repositório remoto..."
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git" 2>/dev/null || \
git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "📤 Fazendo push para GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Concluído!"
echo ""
echo "🌐 Seu repositório está em: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse https://render.com e faça login"
echo "2. Crie um novo Static Site"
echo "3. Conecte seu repositório: $GITHUB_USERNAME/$REPO_NAME"
echo "4. Configure:"
echo "   - Build Command: npm install && npm run build"
echo "   - Publish Directory: dist"
echo "5. Clique em 'Create Static Site'"
echo ""
echo "Para mais detalhes, consulte DEPLOY.md"
