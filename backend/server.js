const path = require('path');
const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // Добавляем модуль для работы с файлами
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const WebSocket = require('ws')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cors())

app.use(
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))
);

// Инициализация массива задач
let tasks = [];

// Функция загрузки задач из файла
function loadGoods() {
    try {
        const data = fs.readFileSync('products.json', 'utf8');
        tasks = JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Файл не существует, создаем новый
            saveGoodsToFile();
        } else {
            console.error('Ошибка загрузки задач:', error);
        }
    }
}

// Функция сохранения задач в файл
function saveGoodsToFile() {
    try {
        fs.writeFileSync('products.json', JSON.stringify(tasks, null, 2), 'utf8');
    } catch (error) {
        console.error('Ошибка сохранения задач:', error);
    }
}

// Загружаем задачи при старте сервера
loadGoods();

// Маршруты

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

app.get('/products', (req, res) => {
    res.json(tasks);
});

app.post('/products', (req, res) => {
    const { name, price, description, categories } = req.body;
    const newGood = {
        id: tasks.length + 1,
        name,
        price,
        description,
        categories,
    };
    tasks.push(newGood);
    saveGoodsToFile(); // Сохраняем изменения в файл
    res.status(201).json(newGood);
});

app.put('/products/:id', (req, res) => {
    const goodId = parseInt(req.params.id);
    const good = tasks.find(t => t.id === goodId);
    if (good) {
        const { name, price, description, categories } = req.body;
        good.name = name !== undefined ? name : good.name;
        good.price = price !== undefined ? price : good.description;
        good.description = description !== undefined ? description : good.description;
        good.categories = categories !== undefined ? categories : good.categories;
        saveGoodsToFile(); // Сохраняем изменения в файл
        res.json(good);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.delete('/products/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== taskId);
    saveGoodsToFile(); // Сохраняем изменения в файл
    res.status(204).send();
});

// Swagger документация
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'API для управления товарами',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },
    apis: [path.join(__dirname, 'swagger.yaml')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Grapghql
const { createHandler } = require('graphql-http/lib/use/express');
const { buildSchema } = require('graphql');

// GraphQL-схема
const schema = buildSchema(`
    type Product {
        id: ID!
        name: String!
        price: Float!
        description: String
        categories: [String]
    }

    type Query {
        products(fields: [String]): [Product]
        product(id: ID!): Product
    }
`);

// Функции для обработки GraphQL-запросов (resolvers)
const root = {
    products: ({ fields }) => {
        return tasks.map(product => {
            if (!fields) return product; // Если fields не переданы, вернуть весь объект
            let filteredProduct = {};
            fields.forEach(field => {
                if (product[field] !== undefined) {
                    filteredProduct[field] = product[field];
                }
            });
            return filteredProduct;
        });
    },
    product: ({ id }) => tasks.find((product) => product.id == id),
};

// Добавляем GraphQL эндпоинт
app.use('/graphql', createHandler({
    schema,
    rootValue: root
}));

// WEB socet
const wss = new WebSocket.Server({port: 8000});
let a = []

wss.on('connection', (ws) => {
    console.log('Новое подключение');
    a.forEach(message => {
        ws.send(message);
    });

    ws.on('message', (message) => {
        console.log('Получено сообщение:', message.toString());
        a.push(message.toString());
        // Рассылка сообщения всем клиентам
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});