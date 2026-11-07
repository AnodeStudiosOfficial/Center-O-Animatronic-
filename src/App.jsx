import React, { useState } from 'react';
import './App.css';

// Oyun verileri listesi (Test iframe linkleriyle)
const INITIAL_GAMES = [
  { 
    id: 'fnaf1', 
    title: "Five Nights at Freddy's 1", 
    image: '/assets/fnaf1.png',
    // Test amaçlı çalışan web/embed linkleri
    gameUrl: 'https://scratch.mit.edu/projects/40439498/embed' 
  },
  { 
    id: 'fnaf2', 
    title: "Five Nights at Freddy's 2", 
    image: '/assets/fnaf2.png',
    gameUrl: 'https://scratch.mit.edu/projects/42525492/embed' 
  },
  { 
    id: 'fnaf3', 
    title: "Five Nights at Freddy's 3", 
    image: '/assets/fnaf3.png',
    gameUrl: 'https://scratch.mit.edu/projects/54228968/embed' 
  },
  { 
    id: 'fnaf4', 
    title: "Five Nights at Freddy's 4", 
    image: '/assets/fnaf4.png',
    gameUrl: 'https://scratch.mit.edu/projects/76435062/embed' 
  },
  { 
    id: 'fnaf-sl', 
    title: 'FNAF: Sister Location', 
    image: '/assets/fnafsl.png',
    gameUrl: 'https://scratch.mit.edu/projects/130190114/embed' 
  },
];

export default function App() {
  const [downloadState, setDownloadState] = useState({});
  const [progress, setProgress] = useState({});
  const [notification, setNotification] = useState(null);
  
  // Şu an oynanan oyunun URL'sini tutan state
  const [activeGameUrl, setActiveGameUrl] = useState(null);

  const startDownload = (gameId, gameTitle) => {
    setDownloadState(prev => ({ ...prev, [gameId]: 'downloading' }));
    setProgress(prev => ({ ...prev, [gameId]: 0 }));

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(prev => ({ ...prev, [gameId]: currentProgress }));

      if (currentProgress >= 100) {
        clearInterval(interval);
        setDownloadState(prev => ({ ...prev, [gameId]: 'installed' }));
        showNotification(`${gameTitle} kütüphanene eklendi!`);
      }
    }, 300);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="app-container">
      {/* Steam Bildirimi */}
      {notification && (
        <div className="steam-notification">
          <div className="notification-icon">🎮</div>
          <div className="notification-text">
            <strong>İndirme Tamamlandı</strong>
            <p>{notification}</p>
          </div>
        </div>
      )}

      {/* Oyun Oynatma Penceresi (Modal) */}
      {activeGameUrl && (
        <div className="game-modal-overlay">
          <div className="game-modal-container">
            <div className="game-modal-header">
              <span>Oyun Ekranı</span>
              <button className="btn-close" onClick={() => setActiveGameUrl(null)}>
                ✖ Kapat
              </button>
            </div>
            <iframe 
              src={activeGameUrl} 
              title="FNAF Game Player"
              className="game-iframe"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Header & Logo */}
      <header className="header">
        <img src="/assets/logo.png" alt="Center O' Animatronic" className="main-logo" />
        <h1>Center O' Animatronic</h1>
      </header>

      {/* Oyun Kartları Grid */}
      <main className="games-grid">
        {INITIAL_GAMES.map(game => {
          const status = downloadState[game.id] || 'idle';
          const currentPercent = progress[game.id] || 0;

          return (
            <div key={game.id} className="game-card">
              <div className="game-thumb">
                <img src={game.image} alt={game.title} />
              </div>
              <h3>{game.title}</h3>

              <div className="action-area">
                {status === 'idle' && (
                  <button className="btn-download" onClick={() => startDownload(game.id, game.title)}>
                    İndir
                  </button>
                )}

                {status === 'downloading' && (
                  <div className="download-progress-container">
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${currentPercent}%` }}></div>
                    </div>
                    <span className="progress-text">%{currentPercent} İndiriliyor...</span>
                  </div>
                )}

                {status === 'installed' && (
                  <button className="btn-play" onClick={() => setActiveGameUrl(game.gameUrl)}>
                    ▶ Oyna (Kütüphanede)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
