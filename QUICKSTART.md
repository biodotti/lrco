# 🚀 Guia Rápido - Revisor de LRCO

## Comandos Essenciais

### Desenvolvimento Local
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
# Acesse: http://localhost:3000

# Build de produção
npm run build

# Preview da build
npm run preview
```

### Deploy GitHub + Render

#### Opção 1: Script Automatizado (Windows)
```bash
.\deploy-github.bat
```

#### Opção 2: Comandos Manuais
```bash
# 1. Git
git init
git add .
git commit -m "Initial commit: Revisor de LRCO implementation"
git remote add origin https://github.com/SEU_USUARIO/revisor-lrco.git
git push -u origin main

# 2. Render (via interface web)
# - Acesse: https://render.com
# - New + → Static Site
# - Conecte repositório
# - Build Command: npm install && npm run build
# - Publish Directory: dist
```

### Atualizações
```bash
# Após fazer alterações no código
git add .
git commit -m "Descrição das alterações"
git push origin main
# Deploy automático no Render!
```

---

## Checklist de Uso

### Primeira Vez
- [ ] Obter chave API Gemini: https://aistudio.google.com/app/apikey
- [ ] Instalar dependências: `npm install`
- [ ] Testar localmente: `npm run dev`
- [ ] Validar com 1-2 PDFs de teste
- [ ] Fazer deploy no Render

### Uso Diário
- [ ] Abrir aplicação (local ou online)
- [ ] Inserir chave API Gemini
- [ ] Upload de PDFs (até 10)
- [ ] Clicar "Validar PDFs"
- [ ] Revisar resultados

---

## Links Importantes

- **Chave API Gemini**: https://aistudio.google.com/app/apikey
- **Render Dashboard**: https://dashboard.render.com
- **GitHub**: https://github.com

---

## Estrutura de Arquivos

```
📁 Revisor de LRCO/
├── 📁 src/
│   ├── 📁 components/      # Componentes React
│   ├── 📁 services/        # Lógica de negócio
│   ├── App.jsx            # App principal
│   └── App.css            # Estilos
├── 📄 README.md           # Documentação completa
├── 📄 DEPLOY.md           # Guia de deploy
├── 📄 package.json        # Dependências
└── 🚀 deploy-github.bat   # Script de deploy
```

---

## Troubleshooting Rápido

### Erro: "Chave API inválida"
→ Verifique se copiou a chave completa do AI Studio

### Erro: "Falha ao processar PDF"
→ Verifique se o arquivo é PDF válido e < 50MB

### Build falha no Render
→ Verifique logs no Render
→ Confirme Build Command: `npm install && npm run build`
→ Confirme Publish Directory: `dist`

### Tela branca após deploy
→ Abra console do navegador (F12)
→ Verifique erros de JavaScript
→ Confirme que `dist/` foi gerado corretamente

---

## Contatos e Suporte

📖 **Documentação Completa**: README.md
🚀 **Guia de Deploy**: DEPLOY.md
💻 **Documentação Técnica**: walkthrough.md (artifact)

---

**Última atualização**: 2025-12-15
