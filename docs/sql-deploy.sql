CREATE DATABASE IF NOT EXISTS technova_distribuidora;
USE technova_distribuidora;

CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT NOT NULL AUTO_INCREMENT,
    nome_categoria VARCHAR(100) NOT NULL,
    descricao_categoria VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (id_categoria)
);

CREATE TABLE IF NOT EXISTS produtos (
    id_produto INT NOT NULL AUTO_INCREMENT,
    nome_produto VARCHAR(100) NOT NULL,
    descricao_produto TEXT,
    preco_produto DECIMAL(10,2) NOT NULL,
    imagem_produto VARCHAR(255) DEFAULT NULL,
    estoque_produto INT NOT NULL DEFAULT 0,
    id_categoria INT NOT NULL,

    PRIMARY KEY (id_produto),

    INDEX fk_produtos_categoria (id_categoria),

    CONSTRAINT fk_produtos_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INT NOT NULL AUTO_INCREMENT,
    data_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status_pedido ENUM(
        'PENDENTE',
        'PAGO',
        'ENVIADO',
        'ENTREGUE',
        'CANCELADO'
    ) NOT NULL DEFAULT 'PENDENTE',
    valor_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    PRIMARY KEY (id_pedido)
);

CREATE TABLE IF NOT EXISTS itens_pedido (
    id_item_pedido INT NOT NULL AUTO_INCREMENT,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    id_produto INT NOT NULL,
    id_pedido INT NOT NULL,

    PRIMARY KEY (id_item_pedido),

    INDEX fk_itens_produto (id_produto),
    INDEX fk_itens_pedido (id_pedido),

    CONSTRAINT fk_itens_produto
        FOREIGN KEY (id_produto)
        REFERENCES produtos(id_produto)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_itens_pedido
        FOREIGN KEY (id_pedido)
        REFERENCES pedidos(id_pedido)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);