const express = require('express');
const path = require("path");
const app = express();
const port = 8080;

app.use(
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))
);

// Раздача статических файлов (HTML, CSS, JS)
app.use(express.static('public'));

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/store.html');
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
