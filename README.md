# AgilePro - Sistema de Gestão Ágil

O **AgilePro** é uma plataforma completa de gerenciamento de projetos baseada na metodologia Scrum. O sistema permite que equipes organizem seus fluxos de trabalho através de quadros Kanban, gestão de sprints e um controle rigoroso de permissões de usuários, com foco em uma experiência de usuário fluida e moderna.

## 🚀 Funcionalidades Principais

*   **Autenticação e Segurança**: Sistema de login estrito validado contra base de dados dinâmica, garantindo que apenas usuários cadastrados acessem o sistema.
*   **Módulo de Registro**: Interface intuitiva para cadastro de novos usuários (Nome, Usuário e Senha), alimentando a lista de membros em tempo real.
*   **Quadro Kanban Interativo**: Gestão visual de tarefas com suporte total a *Drag and Drop* (Arrastar e Soltar) entre as colunas de status.
*   **Controle de Acesso (RBAC)**: Diferenciação funcional baseada em cargos; administradores (**Scrum Master/PO**) possuem permissões de edição e exclusão, enquanto membros (**Developers**) possuem acesso restrito.
*   **Gestão de Projetos e Sprints**: CRUD completo para organização de projetos e atribuição de tarefas a múltiplos responsáveis da equipe.
*   **Persistência de Dados**: Utilização de `localStorage` para garantir que as informações permaneçam salvas mesmo após o fechamento do navegador.

## 🛠️ Tecnologias Utilizadas

*   **Front-End**: React.js com Vite para um ambiente de desenvolvimento rápido e otimizado.
*   **Ícones**: Lucide React para uma interface visual limpa e profissional.
*   **Estado Global**: React Context API para gerenciamento centralizado de dados da aplicação.
*   **Navegação**: React Router para controle de rotas públicas e rotas protegidas por autenticação.
*   **Arrastar e Soltar**: Biblioteca `@dnd-kit` para a implementação da mecânica do Kanban.

## ⚙️ Como Executar o Projeto

Siga os passos abaixo para rodar o ambiente de desenvolvimento localmente:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/agilepro.git
    ```

2.  **Instale as dependências base:**
    ```bash
    npm install
    ```

3.  **Instale as bibliotecas de interface e funcionalidade:**
    *(Necessário para garantir o funcionamento dos ícones e do sistema de arraste)*
    ```bash
    npm install lucide-react @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

## 📁 Estrutura do Projeto
```text
src/
├── components/     # Componentes reutilizáveis (Layout, Modal, Navbar)
├── context/        # AppContext (Lógica de autenticação e estado global)
├── pages/          # Páginas (Dashboard, Projetos, Sprints, Login, Register)
├── data/           # MockData inicial para popular o sistema
└── styles/         # Arquivos de estilização via CSS Modules
```

---

### 👨‍💻 Desenvolvedor
**Giovanni Alvarenga Moretto**  
*Estudante de Análise e Desenvolvimento de Sistemas - Fatec São José dos Campos*
```
