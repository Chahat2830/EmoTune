import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  X,
} from "lucide-react";

import SongCard from "../components/SongCard";
import { getRecommendations } from "../services/api";

import "./Explore.css";


const STORAGE_KEY = "mood-ai-favorites";

const moods = [
  "happy",
  "sad",
  "angry",
  "fear",
  "surprise",
];


function Explore() {
  const [activeMood, setActiveMood] = useState("happy");

  const [songs, setSongs] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [favorites, setFavorites] = useState([]);


  /* ========================================================
     LOAD FAVORITES
  ======================================================== */

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error(
        "Failed to load favorites:",
        error
      );
    }
  }, []);


  /* ========================================================
     LOAD SONGS
  ======================================================== */

  useEffect(() => {
    loadSongs(activeMood);
  }, [activeMood]);


  const loadSongs = async (mood) => {
    try {
      setLoading(true);

      const result = await getRecommendations(mood);

      setSongs(result?.songs || []);
    } catch (error) {
      console.error(
        "Failed to load songs:",
        error
      );

      setSongs([]);
    } finally {
      setLoading(false);
    }
  };


  /* ========================================================
     FAVORITES
  ======================================================== */

  const isSongFavorite = (song) => {
    return favorites.some(
      (item) =>
        item.song_name === song.song_name &&
        item.singer === song.singer
    );
  };


  const handleFavorite = (song) => {
    const exists = isSongFavorite(song);

    let updatedFavorites;

    if (exists) {
      updatedFavorites = favorites.filter(
        (item) =>
          !(
            item.song_name === song.song_name &&
            item.singer === song.singer
          )
      );
    } else {
      updatedFavorites = [
        ...favorites,
        song,
      ];
    }

    setFavorites(updatedFavorites);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedFavorites)
    );
  };


  /* ========================================================
     SEARCH
  ======================================================== */

  const filteredSongs = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    if (!query) {
      return songs;
    }

    return songs.filter((song) => {
      const songName =
        song.song_name?.toLowerCase() || "";

      const singer =
        song.singer?.toLowerCase() || "";

      const artist =
        song.artist?.toLowerCase() || "";

      return (
        songName.includes(query) ||
        singer.includes(query) ||
        artist.includes(query)
      );
    });
  }, [songs, search]);


  /* ========================================================
     CLEAR SEARCH
  ======================================================== */

  const clearSearch = () => {
    setSearch("");
  };


  return (
    <main className="explore-page">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <section className="explore-header">

        <div className="explore-header-content">

          <p className="eyebrow">
            DISCOVER MUSIC
          </p>

          <h1 className="display-font">
            Find your
            <br />
            <span>next song.</span>
          </h1>

          <p className="explore-description">
            Explore songs curated around
            different moods and discover
            something that feels right.
          </p>

        </div>


        <div className="explore-icon">
          <Sparkles size={32} />
        </div>

      </section>


      {/* ====================================================
          SEARCH & FILTERS
      ==================================================== */}

      <section className="explore-controls soft-card">

        <div className="explore-search-wrapper">

          <Search
            className="search-icon"
            size={18}
          />

          <input
            type="text"
            placeholder="Search songs or artists..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

        </div>


        <div className="filter-header">

          <div>
            <SlidersHorizontal size={15} />
            <span>Browse by mood</span>
          </div>

          <span className="favorite-count">
            {favorites.length} saved
          </span>

        </div>


        <div className="mood-filters">

          {moods.map((mood) => (

            <button
              type="button"
              key={mood}
              className={
                activeMood === mood
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveMood(mood)
              }
            >
              {mood}
            </button>

          ))}

        </div>

      </section>


      {/* ====================================================
          RESULTS
      ==================================================== */}

      <section className="explore-results">

        <div className="section-heading">

          <div>

            <p className="eyebrow">
              {activeMood.toUpperCase()} MOOD
            </p>

            <h2 className="display-font">
              Songs for you
            </h2>

          </div>


          <div className="result-summary">

            <span>
              {filteredSongs.length}
              {" "}
              {filteredSongs.length === 1
                ? "song"
                : "songs"}
            </span>

          </div>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="explore-loading soft-card">

            <div className="loading-spinner" />

            <h3>
              Finding your songs
            </h3>

            <p>
              Curating music for your
              {` ${activeMood}`} mood...
            </p>

          </div>
        )}


        {/* SONGS */}

        {!loading &&
          filteredSongs.length > 0 && (

            <div className="explore-song-grid">

              {filteredSongs.map(
                (song, index) => (

                  <SongCard
                    key={`${song.song_name}-${song.singer}-${index}`}
                    song={song}
                    isFavorite={isSongFavorite(song)}
                    onFavorite={handleFavorite}
                  />

                )
              )}

            </div>
          )}


        {/* EMPTY SEARCH */}

        {!loading &&
          songs.length > 0 &&
          filteredSongs.length === 0 && (

            <div className="explore-empty soft-card">

              <div className="empty-search-icon">
                <Search size={30} />
              </div>

              <h3 className="display-font">
                No songs found
              </h3>

              <p>
                We couldn't find a song or artist
                matching "{search}".
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="empty-action"
              >
                Clear search
              </button>

            </div>
          )}


        {/* EMPTY API RESULT */}

        {!loading &&
          songs.length === 0 && (

            <div className="explore-empty soft-card">

              <div className="empty-search-icon">
                <Sparkles size={30} />
              </div>

              <h3 className="display-font">
                No songs available
              </h3>

              <p>
                We couldn't find recommendations
                for this mood right now.
              </p>

              <button
                type="button"
                onClick={() =>
                  loadSongs(activeMood)
                }
                className="empty-action"
              >
                Try again
              </button>

            </div>
          )}

      </section>

    </main>
  );
}


export default Explore;