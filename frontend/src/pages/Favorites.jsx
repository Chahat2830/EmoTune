import { useEffect, useState } from "react";
import {
  Heart,
  Trash2,
  Music2,
  Sparkles,
} from "lucide-react";

import SongCard from "../components/SongCard";

import "./Favorites.css";


const STORAGE_KEY = "mood-ai-favorites";


function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const [showClearConfirm, setShowClearConfirm] =
    useState(false);


  /* ========================================================
     LOAD FAVORITES
  ======================================================== */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setFavorites(parsed);
      }
    } catch (error) {
      console.error(
        "Failed to load favorites:",
        error
      );

      setFavorites([]);
    }
  }, []);


  /* ========================================================
     SAVE FAVORITES
  ======================================================== */

  const saveFavorites = (songs) => {
    setFavorites(songs);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(songs)
    );
  };


  /* ========================================================
     REMOVE FAVORITE
  ======================================================== */

  const removeFavorite = (song) => {
    const updatedFavorites =
      favorites.filter(
        (item) =>
          !(
            item.song_name === song.song_name &&
            item.singer === song.singer
          )
      );

    saveFavorites(updatedFavorites);
  };


  /* ========================================================
     CLEAR ALL
  ======================================================== */

  const clearFavorites = () => {
    saveFavorites([]);

    setShowClearConfirm(false);
  };


  return (
    <main className="favorites-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <section className="favorites-header">

        <div className="favorites-header-content">

          <p className="eyebrow">
            YOUR COLLECTION
          </p>

          <h1 className="display-font">
            Songs you
            <br />
            <span>love.</span>
          </h1>

          <p className="favorites-description">
            Keep your favorite discoveries
            all in one cozy place.
          </p>

        </div>


        <div className="favorites-icon">
          <Heart
            size={32}
            fill="currentColor"
          />
        </div>

      </section>


      {/* ====================================================
          FAVORITES AVAILABLE
      ==================================================== */}

      {favorites.length > 0 ? (
        <>

          <section className="favorites-toolbar">

            <div className="favorites-count">

              <div className="count-icon">
                <Music2 size={15} />
              </div>

              <div>
                <strong>
                  {favorites.length}
                </strong>

                <span>
                  {favorites.length === 1
                    ? "favorite song"
                    : "favorite songs"}
                </span>
              </div>

            </div>


            <button
              type="button"
              className="clear-favorites"
              onClick={() =>
                setShowClearConfirm(true)
              }
            >
              <Trash2 size={15} />
              Clear all
            </button>

          </section>


          {/* ==================================================
              CLEAR CONFIRMATION
          ================================================== */}

          {showClearConfirm && (
            <div className="clear-confirm soft-card">

              <div className="confirm-icon">
                <Trash2 size={20} />
              </div>

              <div className="confirm-content">

                <strong>
                  Clear your favorites?
                </strong>

                <span>
                  This will remove all
                  {` ${favorites.length}`} saved songs.
                </span>

              </div>


              <div className="confirm-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowClearConfirm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="confirm-button"
                  onClick={clearFavorites}
                >
                  Clear all
                </button>

              </div>

            </div>
          )}


          {/* ==================================================
              SONG GRID
          ================================================== */}

          <section className="favorites-grid">

            {favorites.map(
              (song, index) => (

                <SongCard
                  key={`${song.song_name}-${song.singer}-${index}`}
                  song={song}
                  isFavorite={true}
                  onFavorite={removeFavorite}
                />

              )
            )}

          </section>

        </>
      ) : (

        /* ==================================================
           EMPTY STATE
        ================================================== */

        <section className="soft-card favorites-empty">

          <div className="empty-heart">
            <Heart size={32} />
          </div>

          <p className="empty-eyebrow">
            YOUR COLLECTION IS EMPTY
          </p>

          <h2 className="display-font">
            Your favorites
            <br />
            are waiting.
          </h2>

          <p className="empty-description">
            Explore different moods, discover
            songs you love, and tap the heart
            to save them here.
          </p>

          <div className="empty-decoration">
            <Sparkles size={17} />
            <span>
              Find your next favorite song
            </span>
            <Music2 size={17} />
          </div>

        </section>

      )}

    </main>
  );
}


export default Favorites;