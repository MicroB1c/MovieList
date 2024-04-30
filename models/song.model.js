const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"], 
    trim: true, // Удаление лишних пробелов в начале и конце строки
    maxlength: [100, "Title must be no more than 100 characters"] 
  },
  artist: {
    type: String,
    required: [true, "Artist is required"],
    trim: true,
    maxlength: [100, "Artist must be no more than 100 characters"]
  },
  year: {
    type: Number,
    min: [1900, "Year must be after 1900"], // Установка минимального значения года
    max: [new Date().getFullYear(), `Year must be no later than ${new Date().getFullYear()}`] 
  }
});

// Добавление индекса по полю title для улучшения производительности поиска
SongSchema.index({ title: 1 });

const Song = mongoose.model('Song', SongSchema);
module.exports = Song;
