require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Устанавливаем движок представлений, если вы используете EJS для серверного рендеринга
app.set('view engine', 'ejs');
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5000' 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Подключение маршрутов песен
app.use('/api/songs', require('./routes/song.routes'));

// Простое сообщение или рендер главной страницы
app.get('/', (req, res) => {
    res.send('Welcome to the Movie App API!');
});

// Подключение к MongoDB и запуск сервера
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => {
    console.error("MongoDB connection error:", err);
});

