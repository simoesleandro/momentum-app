# Momentum 💪

Um dashboard de fitness pessoal e interativo para acompanhar treinos, progresso e nutrição, com gamificação e um assistente IA.

![Momentum Dashboard Screenshot](https://user-images.githubusercontent.com/8334033/120281119-995b0a80-c2a4-11eb-9871-330953832709.png)

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

## 🚀 Como Executar

Para executar este projeto localmente, siga estes passos:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/SEU_NOME_DE_USUARIO/momentum-fitness-dashboard.git
    ```

2.  **Navegue para a pasta do projeto:**
    ```bash
    cd momentum-fitness-dashboard
    ```

3.  **Inicie um servidor local:**
    Como este projeto utiliza módulos ES6 (`import`), não pode ser aberto diretamente como um ficheiro. É necessário um servidor local. A forma mais fácil é usando o `serve`:
    ```bash
    npx serve
    ```
    Se não tiver o `serve` instalado, pode usar o módulo `http.server` do Python:
    ```bash
    python -m http.server
    ```

4.  **Configuração da API:**
    Para que o Assistente Nutricional e o Coach de Treino funcionem, a sua chave da **API do Google Gemini** deve estar configurada como uma variável de ambiente chamada `API_KEY` no ambiente onde o servidor está a ser executado.

## ✨ Agradecimentos

- A inteligência artificial da **Google (Gemini)** foi utilizada como uma ferramenta de assistência para a geração de código, refatoração e implementação de novas funcionalidades, acelerando o ciclo de desenvolvimento.

## 📝 Licença

Este projeto está licenciado sob a Licença MIT. Veja o ficheiro [LICENSE](LICENSE) para mais detalhes.