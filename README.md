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

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

- **Frontend:** React, TypeScript, Tailwind CSS
- **API de IA:** Google Gemini API
- **Gráficos:** Recharts
- **Ícones:** Font Awesome

## 🚀 Como Executar e Fazer Deploy

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/SEU_NOME_DE_USUARIO/momentum-fitness-dashboard.git
    cd momentum-fitness-dashboard
    ```

2.  **Configuração da API (Obrigatório):**
    - Renomeie o ficheiro `config.js.example` para `config.js`.
    - Abra `config.js` e insira a sua chave da **API do Google Gemini** no local indicado.

3.  **Para Desenvolvimento Local:**
    Como este projeto utiliza módulos ES6 (`import`), ele precisa de um servidor local. A forma mais fácil é usando `serve`:
    ```bash
    npx serve
    ```
    Depois, abra o seu browser em `http://localhost:3000`.

4.  **Para Deploy (ex: GitHub Pages):**
    - Siga os passos de configuração da API acima.
    - Envie todos os ficheiros para o seu repositório no GitHub.
    - Ative o GitHub Pages nas configurações do seu repositório.

## ⚠️ Aviso de Segurança: Chave da API

O método utilizado para a chave da API (`config.js`) é simples para fins de demonstração, mas **NÃO É SEGURO para repositórios públicos**.

- **Risco:** Ao enviar o ficheiro `config.js` com a sua chave para um repositório público no GitHub, a sua chave ficará **visível para qualquer pessoa**, podendo ser usada indevidamente.
- **Recomendação:** Se o seu repositório for público, use-o apenas para demonstração. Para projetos sérios, utilize um repositório **privado** ou faça o deploy em plataformas como **Vercel** ou **Netlify**, que permitem configurar chaves de API de forma segura como "Environment Variables" (variáveis de ambiente).

## ✨ Agradecimentos

- A inteligência artificial da **Google (Gemini)** foi utilizada como uma ferramenta de assistência para a geração de código, refatoração e implementação de novas funcionalidades, acelerando o ciclo de desenvolvimento.

## 📝 Licença

Este projeto está licenciado sob a Licença MIT. Veja o ficheiro [LICENSE](LICENSE) para mais detalhes.