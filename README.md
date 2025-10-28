# Momentum 💪

Um dashboard de fitness pessoal e interativo para acompanhar treinos, progresso e nutrição, com gamificação e um assistente IA.

![Momentum Dashboard Screenshot](https://placehold.co/1200x800/7c3aed/ffffff?text=Momentum%0ADashboard)

## ✨ Funcionalidades Principais

- **🏠 Dashboard Principal:** Vista geral do progresso, resumo semanal, próximo treino, dicas de nutrição e desafios.
- **🏋️‍♂️ Plano de Treino Personalizável:** Crie, edite e elimine planos de treino completos com gestão de carga, séries e repetições.
- **🏃‍♀️ Treino ao Vivo:** Um modo de ecrã inteiro para o guiar durante o treino, com cronómetro de descanso e feedback de IA.
- **📅 Agenda Interativa:** Planeie os seus treinos com uma interface de arrastar e soltar (drag & drop).
- **📈 Acompanhamento de Progresso:**
  - Registo de peso e medidas corporais com gráficos de evolução.
  - Galeria de fotos de progresso com funcionalidade de comparação.
- **🤖 Assistente Nutricional IA:** Converse com uma IA especializada para obter dicas sobre dietas, alimentos e suplementos.
- **🏆 Gamificação:** Ganhe XP, suba de nível e desbloqueie conquistas para se manter motivado(a).
- **📚 Biblioteca de Exercícios:** Consulte a execução correta de dezenas de exercícios com descrições e GIFs.
- **📊 Relatórios Detalhados:** Analise o seu desempenho e partilhe relatórios visuais do seu progresso.
- **⚙️ Personalização:**
  - Modo claro e escuro.
  - Múltiplos temas de cores para personalizar a aparência.
  - Gestão de dados (importar/exportar).

## 💡 Principais Alterações Recentes

- **Remoção da Função Serverless:** A comunicação com a API do Gemini foi refatorada para ser feita diretamente no lado do cliente (client-side) utilizando o SDK oficial `@google/genai`. Isto simplifica a arquitetura, melhora a fiabilidade e remove a necessidade de um passo intermédio no servidor.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

- **Frontend:** React, TypeScript, Tailwind CSS
- **API de IA:** Google Gemini API (`@google/genai`)
- **Gráficos:** Recharts
- **Ícones:** Font Awesome

## 🚀 Como Executar Localmente

Como este projeto utiliza módulos ES6 (`import`), ele precisa de ser servido por um servidor web local para funcionar corretamente.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/SEU_NOME_DE_USUARIO/momentum-fitness-dashboard.git
    cd momentum-fitness-dashboard
    ```
2.  **Configuração da API:**
    - A chave da API é gerida através de uma variável de ambiente (`process.env.API_KEY`). Não precisa de criar nenhum ficheiro. O ambiente de desenvolvimento ou a plataforma de deploy (como o AI Studio) injetará esta chave automaticamente.
3.  **Inicie um servidor local:**
    A forma mais fácil, sem necessidade de instalar dependências, é usar o `serve`:
    ```bash
    npx serve
    ```
4.  **Abra o projeto:**
    Abra o seu browser no endereço fornecido (geralmente `http://localhost:3000`).

## ⚠️ Aviso de Segurança: Chave da API

A sua chave da API do Google Gemini é um segredo e nunca deve ser exposta publicamente, especialmente em repositórios Git.

**Forma Correta (Como o projeto está configurado):**
Utilize variáveis de ambiente. O código acessa a chave com `process.env.API_KEY`. Durante o processo de build (compilação), a plataforma substitui esta variável pela sua chave real. Assim, a chave nunca fica visível no código-fonte que você envia para o GitHub.

```javascript
// ✅ CORRETO (em services/geminiService.ts)
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

**Forma Incorreta (NUNCA FAÇA ISTO):**
Nunca coloque a sua chave diretamente no código. Se o fizer, qualquer pessoa poderá vê-la e usá-la.

```javascript
// ❌ INCORRETO E INSEGURO!
const apiKey = "AIzaSy...SUA_CHAVE_AQUI"; // NÃO FAÇA ISTO!
const ai = new GoogleGenAI({ apiKey: apiKey });
```

- **Recomendação:** Ao fazer o deploy em plataformas como Vercel, Netlify ou GitHub Pages, configure a sua chave da API como um "Environment Variable" ou "Secret" nas configurações da plataforma.

## ✨ Agradecimentos

- A inteligência artificial da **Google (Gemini)** foi utilizada como uma ferramenta de assistência para a geração de código, refatoração e implementação de novas funcionalidades, acelerando o ciclo de desenvolvimento.

## 📝 Licença

Este projeto está licenciado sob a Licença MIT.
