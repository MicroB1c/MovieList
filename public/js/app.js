async function addSong() {
  const title = document.getElementById('title').value;
  const artist = document.getElementById('artist').value;
  const year = document.getElementById('year').value;

  const response = await fetch('/api/songs/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, artist, year })
  });

  if (response.ok) {
    alert('Added!');
    document.getElementById('title').value = '';
    document.getElementById('artist').value = '';
    document.getElementById('year').value = '';
    showTab('songs-tab', document.getElementById('songs-list-tab')); // Обновить вкладку и показать список песен
  } else {
    const data = await response.json();
    alert('Ошибка: ' + data.message);
  }
}

async function loadSongs() {
  try {
    
const response = await fetch('/api/songs/getall');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const songs = await response.json();
    const songsList = document.getElementById('songs-list');
    if (!songs.length) {
      songsList.innerHTML = '<li class="list-group-item">No songs found.</li>';
      return;
    }
    songsList.innerHTML = songs.map(song => `
      <li class="list-group-item">
        ${song.title} - ${song.artist} (${song.year})
        <button onclick="deleteSong('${song._id}')" class="btn btn-danger">Delete</button>
      </li>
    `).join('');
  } catch (error) {
    console.error('Failed to fetch songs:', error);
    document.getElementById('songs-list').innerHTML = `<li class="list-group-item">Failed to load songs: ${error.message}</li>`;
  }
}


async function deleteSong(id) {
  try {
    const response = await fetch(`/api/songs/delete/${id}`, { method: 'DELETE' });
    if (response.ok) {
      alert('Deleted');
      loadSongs(); // Обновляем список песен
    } else {
      throw new Error('Failed to delete the song');
    }
  } catch (error) {
    alert('Ошибка при удалении песни: ' + error.message);
  }
}


async function searchSongs() {
  const title = document.getElementById('searchTitle').value;
  const artist = document.getElementById('searchArtist').value;
  const year = document.getElementById('searchYear').value;

  const queryString = [title ? `title=${encodeURIComponent(title)}` : '', artist ? `artist=${encodeURIComponent(artist)}` : '', year ? `year=${encodeURIComponent(year)}` : ''].filter(Boolean).join('&');
  const response = await fetch(`/api/songs/search?${queryString}`);

  if (response.ok) {
    const songs = await response.json();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = songs.map(song => `<li class="list-group-item">${song.title} - ${song.artist} (${song.year})</li>`).join('') || '<li class="list-group-item">Not found</li>';
  } else {
    alert('Ошибка при выполнении поиска');
  }
}

function showTab(tabId, element) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.querySelectorAll('.nav-link').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).style.display = 'block';
  element.classList.add('active');
  if (tabId === 'songs-tab') loadSongs();  // Автоматическая загрузка песен при переходе на вкладку
}

// Инициализация первой вкладки при загрузке
document.addEventListener('DOMContentLoaded', () => showTab('songs-tab', document.getElementById('songs-list-tab')));
