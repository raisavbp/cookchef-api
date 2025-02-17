-- MySQL Script para criar a base de dados "gestao_receitas"

CREATE DATABASE IF NOT EXISTS gestao_receitas;
USE gestao_receitas;

-- Tabela Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela Coleções
CREATE TABLE IF NOT EXISTS colecoes (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    CONSTRAINT fk_colecoes_user FOREIGN KEY (user_id) REFERENCES utilizadores (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela Coleção_Receitas
CREATE TABLE IF NOT EXISTS colecao_receitas (
    id INT NOT NULL AUTO_INCREMENT,
    colecao_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY (id),
    KEY colecao_id (colecao_id),
    KEY recipe_id (recipe_id),
    CONSTRAINT fk_colecao_receitas_colecao FOREIGN KEY (colecao_id) REFERENCES colecoes (id) ON DELETE CASCADE,
    CONSTRAINT fk_colecao_receitas_receita FOREIGN KEY (recipe_id) REFERENCES receitas (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela Favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    KEY recipe_id (recipe_id),
    CONSTRAINT fk_favoritos_user FOREIGN KEY (user_id) REFERENCES utilizadores (id) ON DELETE CASCADE,
    CONSTRAINT fk_favoritos_receita FOREIGN KEY (recipe_id) REFERENCES receitas (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela Ingredientes
CREATE TABLE IF NOT EXISTS ingredientes (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela Receita_Ingredientes
CREATE TABLE IF NOT EXISTS receita_ingredientes (
    id INT NOT NULL AUTO_INCREMENT,
    receita_id INT NOT NULL,
    ingrediente_id INT NOT NULL,
    quantidade VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    KEY receita_id (receita_id),
    KEY ingrediente_id (ingrediente_id),
    CONSTRAINT fk_receita_ingredientes_receita FOREIGN KEY (receita_id) REFERENCES receitas (id) ON DELETE CASCADE,
    CONSTRAINT fk_receita_ingredientes_ingrediente FOREIGN KEY (ingrediente_id) REFERENCES ingredientes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela Receitas
CREATE TABLE IF NOT EXISTS receitas (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    autor_id INT NOT NULL,
    descricao TEXT NOT NULL,
    dificuldade ENUM('Fácil','Médio','Difícil') NOT NULL,
    categoria_id INT NOT NULL,
    tempo INT NOT NULL,
    custo DECIMAL(5,2) NOT NULL,
    criado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY autor_id (autor_id),
    KEY categoria_id (categoria_id),
    CONSTRAINT fk_receitas_autor FOREIGN KEY (autor_id) REFERENCES utilizadores (id) ON DELETE CASCADE,
    CONSTRAINT fk_receitas_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela RefreshTokens
CREATE TABLE IF NOT EXISTS refreshtokens (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    CONSTRAINT fk_refreshtokens_user FOREIGN KEY (user_id) REFERENCES utilizadores (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela Utilizadores
CREATE TABLE IF NOT EXISTS utilizadores (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
