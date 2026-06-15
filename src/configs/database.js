import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


// Singleton para a conexão com o banco de dados
class Database {
    static #instance = null;
    #pool = null;


    #createPool() {
        this.#pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }


    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
            Database.#instance.#createPool();
        }
        return Database.#instance;
    }


    getPool() {
        return this.#pool;
    }
}


export const db = Database.getInstance().getPool();


export async function initializeDatabase() {
    console.log("Inicializando o banco de dados e tabelas...");
    try {
        const tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });


        const dbName = process.env.DB_DATABASE || 'technova_distribuidora';


        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await tempConnection.query(`USE \`${dbName}\`;`);


        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS categorias (
                id_categoria int NOT NULL AUTO_INCREMENT,
                nome_categoria varchar(100) NOT NULL,
                descricao_categoria varchar(255) DEFAULT NULL,
                PRIMARY KEY (id_categoria)
            ) 
        `);
        
        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id_produto int NOT NULL AUTO_INCREMENT,
                nome_produto varchar(100) NOT NULL,
                descricao_produto text,
                preco_produto decimal(10,2) NOT NULL,
                imagem_produto varchar(255) DEFAULT NULL,
                estoque_produto int NOT NULL DEFAULT '0',
                id_categoria int NOT NULL,
                PRIMARY KEY (id_produto),
                KEY fk_produtos_categoria (id_categoria),
                CONSTRAINT fk_produtos_categoria FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria) ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);

        await tempConnection.query(`
            CREATE TABLE pedidos IF NOT EXISTS (
                id_pedido int NOT NULL AUTO_INCREMENT,
                data_pedido datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                status_pedido enum('PENDENTE','PAGO','ENVIADO','ENTREGUE','CANCELADO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDENTE',
                valor_total decimal(10,2) NOT NULL DEFAULT '0.00',
                PRIMARY KEY (id_pedido)
            );
        `);

        await tempConnection.query(`
            CREATE TABLE itens_pedido IF NOT EXISTS (
                id_item_pedido int NOT NULL AUTO_INCREMENT,
                quantidade int NOT NULL,
                preco_unitario decimal(10,2) NOT NULL,
                subtotal decimal(10,2) DEFAULT NULL,
                id_produto int NOT NULL,
                id_pedido int NOT NULL,
                PRIMARY KEY (id_item_pedido),
                KEY fk_itens_produto (id_produto),
                KEY fk_itens_pedido (id_pedido),
                CONSTRAINT fk_itens_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT fk_itens_produto FOREIGN KEY (id_produto) REFERENCES produtos (id_produto) ON DELETE RESTRICT ON UPDATE CASCADE
            );
        `);


        await tempConnection.end();
        console.log("Banco de dados e tabelas verificados/criados com sucesso.");
    } catch (error) {
        console.error("Erro ao criar o banco ou as tabelas:", error);
        throw error;
    }
}
