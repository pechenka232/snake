const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());  // Добавляем JSON-парсинг
app.use(express.static("../client"));

app.post("/save-score", (req, res) => {
    let { score } = req.body;
    console.log(`Сохранён: ${score}`);
    res.send({ success: true });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
