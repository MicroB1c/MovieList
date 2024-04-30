const express = require('express');
const Song = require('../models/song.model');
const router = express.Router();

function handleErrors(res, error, status = 500, message = 'Internal Server Error') {
  console.error('Error:', error);  // Логируем ошибку для дальнейшего анализа
  res.status(status).json({ message: message || error.message });
}

function sendResponse(res, data, message = 'No data found') {
  if (data && data.length !== undefined) { // Проверяем, является ли ответ массивом
    res.json(data.length ? data : { message });
  } else {
    res.json(data || { message });
  }
}

// Поиск треков по названию, артисту или году
router.get('/search', async (req, res) => {
  const { title, artist, year } = req.query;
  let searchCriteria = {};

  if (title) searchCriteria.title = new RegExp(title, 'i');
  if (artist) searchCriteria.artist = new RegExp(artist, 'i');
  if (year && !isNaN(year)) searchCriteria.year = parseInt(year);

  try {
    const songs = await Song.find(searchCriteria);
    sendResponse(res, songs);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Получение всех треков
router.get('/getall', async (req, res) => {
  try {
    const songs = await Song.find({});
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
});

// Получение одного трека по ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    sendResponse(res, song, 'Song not found');
  } catch (error) {
    handleErrors(res, error, 500, 'Song not found');
  }
});

// Создание нового трека
router.post('/add', async (req, res) => {
  const { title, artist, year } = req.body;
  if (!title || !artist || !year) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const newSong = new Song({ title, artist, year });
    await newSong.save();
    sendResponse(res, newSong);
  } catch (error) {
    handleErrors(res, error, 400, 'Error adding song');
  }
});

// Обновление трека по ID
router.put('/update/:id', async (req, res) => {
  const { title, artist, year } = req.body;
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, { title, artist, year }, { new: true });
    sendResponse(res, song, 'Song not found');
  } catch (error) {
    handleErrors(res, error, 400, 'Error updating song');
  }
});

// Удаление трека по ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.status(204).json({ message: 'Song deleted' });
  } catch (error) {
    handleErrors(res, error, 500, 'Error deleting song');
  }
});

module.exports = router;
