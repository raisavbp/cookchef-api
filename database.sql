-- Usar a base de dados
USE gestao_receitas;

-- Criar tabela de Utilizadores
CREATE TABLE IF NOT EXISTS Utilizadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, 
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de Categorias de Receitas
CREATE TABLE IF NOT EXISTS Categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Criar tabela de Ingredientes
CREATE TABLE IF NOT EXISTS Ingredientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- Criar tabela de Receitas
CREATE TABLE IF NOT EXISTS Receitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    autor_id INT NOT NULL,
    descricao TEXT NOT NULL,
    dificuldade ENUM('Fácil', 'Médio', 'Difícil') NOT NULL,
    categoria_id INT NOT NULL,
    tempo INT NOT NULL, -- em minutos
    custo DECIMAL(5,2) NOT NULL, -- valor em euros
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autor_id) REFERENCES Utilizadores(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id) ON DELETE CASCADE
);

-- Criar tabela de relação entre Receitas e Ingredientes (N:N)
CREATE TABLE IF NOT EXISTS Receita_Ingredientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receita_id INT NOT NULL,
    ingrediente_id INT NOT NULL,
    quantidade VARCHAR(50) NOT NULL,
    FOREIGN KEY (receita_id) REFERENCES Receitas(id) ON DELETE CASCADE,
    FOREIGN KEY (ingrediente_id) REFERENCES Ingredientes(id) ON DELETE CASCADE
);
