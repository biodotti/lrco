# 🔧 Troubleshooting - Revisor de LRCO

## Erro CORS ao Validar PDFs

### Sintoma
Ao clicar em "Validar PDFs", aparece erro vermelho:
```
Access to fetch at 'https://generativelanguage.googleapis.com/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

### Causa
Este erro pode ocorrer por alguns motivos:
1. Chave API inválida ou expirada
2. Modelo Gemini não disponível
3. Problemas de rede/proxy

### Soluções

#### Solução 1: Verificar Chave API (Mais Comum)

1. **Obtenha uma nova chave API:**
   - Acesse: https://aistudio.google.com/app/apikey
   - Clique em "Create API Key"
   - Copie a chave completa (começa com `AIza...`)

2. **Cole a chave corretamente:**
   - Certifique-se de copiar a chave INTEIRA
   - Não deve ter espaços no início ou fim
   - Cole no campo "Chave API Gemini" na aplicação

3. **Teste novamente**

#### Solução 2: Limpar Cache do Navegador

1. Pressione `Ctrl + Shift + Delete`
2. Selecione "Cached images and files"
3. Clique em "Clear data"
4. Recarregue a página (`F5`)

#### Solução 3: Testar em Navegador Diferente

- Tente usar Chrome, Firefox ou Edge
- Alguns navegadores têm configurações de segurança mais restritivas

#### Solução 4: Verificar Conexão com Internet

- Certifique-se de estar conectado à internet
- Desative VPN ou proxy temporariamente
- Tente em outra rede (ex: celular como hotspot)

#### Solução 5: Atualizar Código (Já Corrigido)

O código foi atualizado para usar `gemini-1.5-flash` (modelo estável) em vez de `gemini-2.0-flash-exp`.

Se você ainda tiver o código antigo:
1. Abra `src/services/geminiService.js`
2. Na linha 13, altere:
   ```javascript
   // DE:
   model: "gemini-2.0-flash-exp"
   
   // PARA:
   model: "gemini-1.5-flash"
   ```
3. Salve o arquivo
4. Reinicie o servidor (`Ctrl+C` e depois `npm run dev`)

---

## Outros Erros Comuns

### "Chave API Gemini é obrigatória"

**Causa**: Campo de chave API está vazio

**Solução**: Insira sua chave API no campo indicado

### "Falha ao processar PDF"

**Causa**: PDF corrompido, muito grande, ou formato inválido

**Soluções**:
- Verifique se o arquivo é realmente um PDF
- Confirme que o arquivo tem menos de 50MB
- Tente com outro PDF

### "Limite de requisições excedido"

**Causa**: Muitas requisições em pouco tempo (rate limit)

**Solução**: Aguarde 1-2 minutos e tente novamente

### Tela Branca

**Causa**: Erro de JavaScript

**Solução**:
1. Abra console do navegador (F12)
2. Veja o erro específico
3. Recarregue a página

---

## Verificar se Está Funcionando

### Teste Rápido

1. Abra a aplicação
2. Insira chave API válida
3. Faça upload de um PDF pequeno (< 5MB)
4. Clique em "Validar PDFs"
5. Deve mostrar barra de progresso
6. Após alguns segundos, deve mostrar resultados

### Console do Navegador

Abra o console (F12) e verifique:
- ✅ Sem erros vermelhos = Funcionando
- ❌ Erros CORS = Problema de API/rede
- ❌ Erros 401/403 = Chave API inválida
- ❌ Erros 429 = Rate limit excedido

---

## Suporte Adicional

Se nenhuma solução funcionar:

1. **Verifique documentação oficial:**
   - Gemini API: https://ai.google.dev/docs
   - Troubleshooting: https://ai.google.dev/docs/troubleshooting

2. **Teste a chave API diretamente:**
   - Use o AI Studio: https://aistudio.google.com
   - Teste se consegue gerar conteúdo lá

3. **Contate suporte:**
   - Descreva o erro exato
   - Inclua screenshot do console (F12)
   - Mencione navegador e sistema operacional

---

**Última atualização**: 2025-12-15
