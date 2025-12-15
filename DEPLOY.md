# 🚀 Deploy no Render - Revisor de LRCO

## Pré-requisitos

1. Conta no GitHub (gratuita)
2. Conta no Render (gratuita) - https://render.com
3. Código do projeto já implementado

## Passo 1: Preparar Repositório no GitHub

### 1.1. Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Configure o repositório:
   - **Nome**: `revisor-lrco`
   - **Descrição**: "Ferramenta de validação automatizada de PDFs de LRCO - Estágio Probatório"
   - **Visibilidade**: Privado (recomendado) ou Público
   - **NÃO** marque "Add a README file" (já temos)
   - **NÃO** adicione .gitignore (já temos)
3. Clique em "Create repository"

### 1.2. Inicializar Git e Fazer Push

Abra o terminal no diretório do projeto e execute:

```bash
# Navegar para o diretório do projeto
cd "C:\Users\pseudocelomado\Documents\Programação\SEED\Revisor de LRCO"

# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: Revisor de LRCO implementation"

# Adicionar repositório remoto (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/revisor-lrco.git

# Fazer push para o GitHub
git branch -M main
git push -u origin main
```

> **Nota**: Se for a primeira vez usando Git no Windows, você pode precisar configurar:
> ```bash
> git config --global user.name "Seu Nome"
> git config --global user.email "seu.email@exemplo.com"
> ```

## Passo 2: Deploy no Render

### 2.1. Criar Conta no Render

1. Acesse https://render.com
2. Clique em "Get Started for Free"
3. Faça login com sua conta do GitHub (recomendado)

### 2.2. Criar Novo Static Site

1. No dashboard do Render, clique em **"New +"** → **"Static Site"**

2. **Conectar Repositório:**
   - Se for a primeira vez, clique em "Connect account" para autorizar o Render a acessar seus repositórios
   - Selecione o repositório `revisor-lrco`
   - Clique em "Connect"

3. **Configurar o Deploy:**

   Preencha os campos:

   - **Name**: `revisor-lrco` (ou nome de sua preferência)
   - **Branch**: `main`
   - **Root Directory**: (deixe em branco)
   - **Build Command**: 
     ```
     npm install && npm run build
     ```
   - **Publish Directory**: 
     ```
     dist
     ```

4. **Configurações Avançadas** (opcional):
   - Clique em "Advanced" se quiser configurar variáveis de ambiente
   - Para este projeto, não é necessário

5. **Criar Static Site:**
   - Clique em "Create Static Site"
   - O Render começará a fazer o build automaticamente

### 2.3. Aguardar Deploy

- O processo de build leva 2-5 minutos
- Você verá os logs em tempo real
- Quando concluído, aparecerá "Deploy live" com um ✅

### 2.4. Acessar Aplicação

Após o deploy bem-sucedido:

1. O Render fornecerá uma URL pública, algo como:
   ```
   https://revisor-lrco.onrender.com
   ```

2. Clique na URL para acessar sua aplicação online!

## Passo 3: Configurar Domínio Personalizado (Opcional)

Se você tiver um domínio próprio:

1. No dashboard do Render, vá em "Settings" do seu site
2. Role até "Custom Domain"
3. Clique em "Add Custom Domain"
4. Siga as instruções para configurar DNS

## Passo 4: Atualizações Futuras

Sempre que você fizer alterações no código:

```bash
# Fazer alterações no código...

# Adicionar arquivos modificados
git add .

# Fazer commit
git commit -m "Descrição das alterações"

# Fazer push para o GitHub
git push origin main
```

**O Render fará deploy automático** sempre que você fizer push para a branch `main`! 🎉

## Troubleshooting

### Erro: "Build failed"

**Solução**: Verifique os logs no Render. Erros comuns:
- Dependências faltando: certifique-se que `package.json` está correto
- Comando de build errado: deve ser `npm run build`
- Diretório de publicação errado: deve ser `dist`

### Erro: "Page not found" após deploy

**Solução**: 
1. Verifique se o "Publish Directory" está configurado como `dist`
2. Confirme que o build gerou arquivos na pasta `dist/`

### Aplicação não carrega (tela branca)

**Solução**:
1. Abra o console do navegador (F12)
2. Verifique erros de JavaScript
3. Pode ser problema de caminho de assets - verifique `vite.config.js`

### Deploy muito lento

**Solução**:
- Plano gratuito do Render pode ser mais lento
- Primeira build sempre demora mais (instalando dependências)
- Builds subsequentes são mais rápidas (cache)

## Monitoramento

No dashboard do Render você pode:
- Ver logs de build e deploy
- Monitorar uso de recursos
- Ver histórico de deploys
- Fazer rollback para versões anteriores

## Custos

- **Render Free Tier**: Gratuito para static sites
- Limitações do plano gratuito:
  - 100 GB de bandwidth por mês
  - Builds podem ser mais lentas
  - Site pode "dormir" após inatividade (reinicia ao acessar)

Para remover limitações, considere upgrade para plano pago ($7/mês).

## Segurança

⚠️ **IMPORTANTE**: 
- Nunca faça commit de chaves API no código
- Use variáveis de ambiente para dados sensíveis
- Mantenha repositório privado se contiver dados sensíveis
- A chave API Gemini deve ser inserida pelo usuário na interface

## Próximos Passos

Após deploy bem-sucedido:

1. ✅ Teste a aplicação online
2. ✅ Compartilhe a URL com usuários
3. ✅ Configure domínio personalizado (opcional)
4. ✅ Configure analytics (Google Analytics, etc.) se necessário

---

**Pronto!** Sua aplicação está online e acessível de qualquer lugar! 🚀
