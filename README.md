# 📋 Revisor de LRCO - Estágio Probatório

Ferramenta de validação automatizada de Livros de Registro de Classe Online (LRCO) para o Estágio Probatório, utilizando Inteligência Artificial (Gemini 2.0 Flash API).

## 🎯 Funcionalidades

A ferramenta valida automaticamente três critérios essenciais em até 10 PDFs:

1. **Registro de Avaliação**: Verifica conformidade com texto padrão, incluindo:
   - Citação obrigatória das Resoluções nº 3.037/2024 e 7.342/2024
   - Menção à progressão de ano (1º→2º ou 2º→3º)
   - Referências a matrícula, frequência e estágio probatório

2. **Objetivos de Conteúdo**: Confirma presença de objetivos nos registros de encontros formativos

3. **Frequências**: Valida que o total de frequências é:
   - Número par
   - Entre 42 e 50
   - Lançadas de 2 em 2

## 🚀 Decisões Automatizadas

Com base nos critérios validados, a ferramenta retorna:

- ✅ **Enviar para SERE**: Todos os critérios atendidos
- ⚠️ **Enviar para SERE com ressalvas**: 1 critério não atendido (especifica qual)
- ❌ **Devolver para tutora**: 2 ou mais critérios não atendidos

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Chave API do Google Gemini ([obter aqui](https://aistudio.google.com/app/apikey))

## 🔧 Instalação

1. Clone ou baixe este repositório

2. Instale as dependências:
```bash
npm install
```

## ▶️ Como Usar

1. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

2. **Acesse a aplicação:**
   - Abra o navegador em `http://localhost:3000`

3. **Configure sua chave API:**
   - Insira sua chave API Gemini no campo indicado
   - A chave é armazenada apenas na sessão do navegador (não é salva permanentemente)

4. **Faça upload dos PDFs:**
   - Arraste e solte até 10 PDFs na zona de upload, ou
   - Clique para selecionar arquivos
   - Apenas PDFs de até 50MB são aceitos

5. **Valide os documentos:**
   - Clique em "Validar PDFs"
   - Aguarde o processamento (pode levar alguns segundos por PDF)

6. **Revise os resultados:**
   - Cada PDF terá uma decisão individual
   - Veja detalhes de cada critério validado
   - Ressalvas são listadas quando aplicável

## 🏗️ Estrutura do Projeto

```
revisor-lrco/
├── src/
│   ├── components/
│   │   ├── ApiKeyInput.jsx       # Input para chave API
│   │   ├── FileUploader.jsx      # Upload de PDFs
│   │   ├── ProgressIndicator.jsx # Indicador de progresso
│   │   └── ValidationResults.jsx # Exibição de resultados
│   ├── services/
│   │   ├── geminiService.js      # Integração com Gemini API
│   │   └── validationService.js  # Lógica de validação
│   ├── App.jsx                   # Componente principal
│   ├── App.css                   # Estilos
│   └── main.jsx                  # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Tecnologias Utilizadas

- **React 18** - Framework UI
- **Vite** - Build tool
- **Google Generative AI SDK** - Integração com Gemini API
- **Lucide React** - Ícones
- **Vanilla CSS** - Estilização

## 🔒 Segurança e Privacidade

- A chave API é armazenada apenas em `sessionStorage` (apagada ao fechar a aba)
- PDFs são processados diretamente no navegador e enviados para a API Gemini
- Nenhum dado é armazenado em servidor
- Recomenda-se usar PDFs anonimizados para testes

## ⚙️ Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`.

Para testar a build de produção localmente:

```bash
npm run preview
```

## 🐛 Troubleshooting

### Erro: "Chave API inválida"
- Verifique se copiou a chave completa do [Google AI Studio](https://aistudio.google.com/app/apikey)
- Certifique-se de que a chave está ativa

### Erro: "Falha ao processar PDF"
- Verifique se o arquivo é um PDF válido
- Confirme que o arquivo tem menos de 50MB
- PDFs escaneados podem ter menor precisão na extração

### Validações incorretas
- A precisão depende da qualidade e formatação do PDF
- PDFs com estrutura muito diferente do padrão podem gerar falsos positivos/negativos
- Revise manualmente casos duvidosos

## 📝 Notas Importantes

- **Custos**: A API Gemini tem custos por token processado. Monitore seu uso no [Google AI Studio](https://aistudio.google.com/)
- **Limites**: Respeite os limites de taxa da API (rate limits)
- **Precisão**: A validação é automatizada mas não substitui revisão humana em casos críticos

## 📄 Licença

Este projeto é de uso interno para o Estágio Probatório - SEED/PR.

## 🤝 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

Desenvolvido com ❤️ usando Gemini 2.0 Flash API
