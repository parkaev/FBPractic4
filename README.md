# Инструкция

## 1️⃣ Установка зависимостей

### Для Windows (PowerShell/CMD)
Выполнить установку зависимостей:
```powershell
cd .\backend\;  npm install; cd ..; cd .\frontend\;  npm install; cd ..
```

### Для Linux/macOS (Bash)
```bash
cd ./backend && npm install && cd .. && cd ./frontend && npm install && cd ..
```

## 2️⃣ Запуск

### Для Windows (PowerShell/CMD)
1. Запустить админку (backend) сервер:
   ```powershell
   cd .\backend\; node server.js
   ```
2. Вернуться в домашнюю директорию:
   ```powershell
   cd ..
   ```
3. Запустить клиентскую часть (frontend) сервер:
   ```powershell
   cd .\frontend\; node server.js;
   ```

### Для Linux/macOS (Bash)
1. Запустить админку (backend) сервер:
   ```bash
   cd ./backend && node server.js
   ```
2. Вернуться в корневую папку:
   ```bash
   cd ..
   ```
3. Запустить клиентскую часть (frontend) сервер:
   ```bash
   cd ./frontend && node server.js
   ```

Для повторного запуска необходимо снова вернуться в корневую папку:
```bash
cd ..
```

## 3️⃣ Подключение
### Клиентская часть (frontend)
Находится по адресу: [http://localhost:8080/](http://localhost:8080/)

### Админка (backend)
Находится по адресу: [http://localhost:3000/](http://localhost:3000/)  
Документация к API (swagger): [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

