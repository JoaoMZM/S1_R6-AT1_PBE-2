import e from "express";
import 'dotenv/config';
import routes from './routes/routes.js';
import cors from "cors";
import { initializeDatabase } from "./configs/database.js";

const app = e();

app.use(cors());
app.use(e.json());
app.use('/', routes);

app.use(
    "/uploads/images",
    e.static("uploads/images")
);

const SERVER_PORT = process.env.SERVER_PORT;

initializeDatabase().then(() => {
    app.listen(SERVER_PORT, () => {
        console.log(`Servidor rodando na porta ${SERVER_PORT}`);
    });
}).catch(err => {
    console.error("Erro ao inicializar o banco de dados:", err);
});