# CookChef

## Sobre o Projeto
O **CookChef** é uma plataforma para explorar, favoritar e organizar receitas culinárias. 
Permite que os usuários façam login, busquem receitas internas e externas (de uma API pública), salvem receitas e organizem suas favoritas( não concluido).

 A aplicação tem as seguintes funcionalidades, algumas totalmente implementadas e outras parcialmente:

* Registo e autenticação de utilizadores:
- Os utilizadores poderão registar-se (com nome, email e senha) e logo em seguida iniciar sessão.
- A autenticação será feita com email e senha (armazenados de forma segura no BD, usando hash).
- Login via Google (OAuth) (parcialmente implementada*)

* Consulta de Receitas internas da Base de Dados Local por categorias (carne, frango, peixe, massas, saladas, sobremesas e bebidas).

* Pesquisa de Receitas por nome de uma API externa API TheMealDB.

* Marcação de Receitas como favoritas(parcialmente implementada*)

* Importação de receitas de uma API externa(parcialmente implementada)

---

## Tecnologias Utilizadas
O projeto foi desenvolvido utilizando as seguintes tecnologias:

### **Frontend**
- HTML5, CSS3, JavaScript
- Fetch API para consumo de APIs externas
- LocalStorage para gerenciamento do login do usuário

### **Backend**
- Node.js com Express.js
- MySQL como banco de dados
- JWT para autenticação
- Passport.js para login com Google
- Axios para chamadas de API

---

## Como Executar o Projeto

### ** 1 Clonar o Repositório**
```sh
 git clone https://github.com/teu-repo/cookchef.git
 cd cookchef
```

### ** 2️ Instalar Dependências**
```sh
 npm install
```
* Explicação das Dependências:
 - express → Framework para criar o servidor web
 - mysql2 → Biblioteca para conectar ao MySQL
 - dotenv → Permite usar variáveis de ambiente
 - cors → Permite requisições entre domínios (necessário para o front-end)
 - jsonwebtoken → Para autenticação com JWT
 - bcryptjs → Para encriptar as senhas dos utilizadores
 - multer → Para upload de imagens (será usado para receitas)
 - "passport-google-oauth2": "^0.2.0" ->
 - "passport-google-oauth20"-> "^2.0.0"


### ** 3️ Criar e Configurar o Banco de Dados**
1. Criar um banco MySQL chamado `cookchef`
2. Executar o script SQL para criar as tabelas
3. Configurar as variáveis de ambiente no arquivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=cookchef
JWT_SECRET=seu_segredo
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
```

### ** 4️ Iniciar o Servidor**
```sh
 npm run dev
```
O servidor será iniciado em `http://localhost:3000`

---

## Autenticação

### **Login Manual**
- Registro e login de usuários via API (`/users/register` e `/users/login`)
- JWT gerado e salvo no LocalStorage
- Exibe nome do usuário no canto superior direito
- Botão de logout para remover token

### **Login com Google** (Não funcional)
- Autenticação usando Passport.js
- Redirecionamento para o Google OAuth
- Retorno de token JWT para uso no frontend

---

# Como este projeto foi desenvolvido:
# Fase 1 - Passos iniciais
Configurar projeto no Github
Inicializar o projeto (npm init -y)
Instalar as dependências principais, inclusive o nodemon
Criação do gitignore
Criação do .env
Criação da estrutura de diretórios
Configurar os scripts no package.json("start" e "dev")
Iniciar o servidor em server.js em ES6
Adicionar o type->module no package.json

## Fase 2 - Implementação do Back-end (API REST)

* Configurar as Rotas no Express
- Criação dos ficheiros (userRoutes.js, recipeRoutes.js, categoryRoutes.js) em src/routes.
* Criar as rotas CRUD para users, recipe e category;

## Fase 3 - Autenticação Google

- Instalar Dependências
passport → Biblioteca de autenticação.
passport-google-oauth20 → Estratégia OAuth2 para autenticar com Google.
express-session → Para gerir sessões do utilizador no Express.
dotenv → Para carregar as credenciais do .env.

- Criar credenciais na Google Cloud
- Configurar o Passport.js

## Fase 4 - Autenticação Manual
- Registo do utilizador (POST /auth/register) → Guarda e-mail e senha encriptada no banco de dados.
- Login manual (POST /auth/login) → Valida credenciais e criar sessão.
- Logout (GET /auth/logout) → Finaliza sessão do utilizador.
- Manter compatibilidade com a autenticação via Google.

Usado bcryptjs para encriptar as senhas e passport-local para autenticação.

* 1 - Instalado as dependencias 
bcryptjs → Para encriptar senhas.
passport-local → Para autenticar utilizadores manualmente com e-mail e senha.
jsonwebtoken para criar tokens de autenticação.

* 2 - Atualizado o User.js (src/models/User.js)
 - em password aceitar o null

* 3- Criado as Rotas para registo e login (routes/authRoutes.js)

* 4 - Criado Middleware de autenticação JWT


## Fase 5 - Proteger Rotas para utilizadores autenticados
- Qualquer pessoa pode visualizar as receitas com o GET
- 
* Criar um Middleware de Autenticação
- criar o ficheiro authmiddleware.js (src/middleware/)

* Aplicar o Middleware nas rotas
- Apenas utilizadores autenticados podem criar, editar e apagar receitas (POST, PUT e DELETE).
- Garantimos que o utilizador so pode modificar suas proprias receitas.

## Fase 6 - Melhorar a nossa API antes de integrar com a API externa( não implementada)

- Upload de Imagens para Receitas
 - Melhoria na Pesquisa e Filtros
 - Relacionamento entre receitas e categorias

 * Upload de Imagens para receitas
  - Instalar a biblioteca Multer ( nos permite fazer upload de arquivos).
  - Criar uma pasta para armazenar imagens no servidor (uploads)
  - Criar a configuração do MULTER

## Fase 7 - Melhorias nas pesquisas e Filtros
Criado um endpoint para pesquisa avançada (GET/ recipes/search).
* Permitido filtros dinâmicos
- Buscar por nome (?name=pizza)
  
* Criado a rota de pesquisa:
- em routes/recipeRoutes.js

## Fase 8 - Desenvolvimento do Frontend

## Fase 9 - Melhorias da Aplicação



# Contato
Desenvolvido por: Raisa Andrade
Email: raisavbp@gmail.com


