
import { useEffect, useState } from "react";

import {
  ArrowRight,
  Music2,
  Play,
  Sparkles,
} from "lucide-react";

import SongCard from "../components/SongCard";
import { getRecommendations } from "../services/api";

import "./Home.css";

export default function Home({ setActivePage }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load recommended songs
  useEffect(() => {
    let isMounted = true;

    const loadRecommendedSongs = async () => {
      try {
        setLoading(true);

        const result = await getRecommendations("happy");

        if (isMounted) {
          setSongs(result?.songs || []);
        }
      } catch (error) {
        console.error(
          "Failed to load recommended songs:",
          error
        );

        if (isMounted) {
          setSongs([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRecommendedSongs();

    return () => {
      isMounted = false;
    };
  }, []);

  // Explore Music -> My Mood
  const handleExploreMusic = () => {
    setActivePage("mood");
  };

  // Explore all -> Explore page
  const handleExplore = () => {
    setActivePage("explore");
  };

  return (
    <main className="home-page">
      {/* HERO SECTION */}
      <section className="home-hero soft-card">
        <div className="hero-content">
          <p className="eyebrow">
            MUSIC THAT UNDERSTANDS YOU
          </p>

          <h1>
            Your mood.
            <br />
            <span>Your music.</span>
          </h1>

          <p className="hero-description">
            Discover music that matches how you feel.
            Let AI understand your mood and create a
            personalized listening experience just for you.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button"
              onClick={handleExploreMusic}
            >
              <Sparkles size={17} />
              Explore Music
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* MOOD ILLUSTRATION */}
        <div className="hero-image">
          <div className="hero-artwork">
            <img
              src="mood-music-hero.png.png"
              alt="A dreamy music illustration with headphones, musical notes, hearts, and colorful mood emojis"
              className="hero-artwork-image"
              onError={(event) => {
                console.error(
                  "Hero image not found. Check public/images/mood-music-hero.png"
                );
                event.currentTarget.style.visibility = "hidden";
              }}
            />
          </div>
        </div>
      </section>

      {/* RECOMMENDED SONGS */}
      <section className="home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              CURATED FOR YOU
            </p>

            <h2>
              Songs to match your mood
            </h2>
          </div>

          <button
            type="button"
            className="section-link"
            onClick={handleExplore}
          >
            Explore all
            <ArrowRight size={15} />
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="home-loading soft-card">
            <div className="loading-spinner" />

            <span>
              Finding songs for you...
            </span>
          </div>
        )}

        {/* SONGS */}
        {!loading && songs.length > 0 && (
          <div className="recommendation-grid">
            {songs.slice(0, 4).map((song, index) => (
              <SongCard
                key={`${song.song_name}-${song.artist || song.singer || ""}-${index}`}
                song={song}
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && songs.length === 0 && (
          <div className="home-loading soft-card">
            <Music2
              size={30}
              strokeWidth={1.5}
            />

            <span>
              No recommendations available right now.
            </span>
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              HOW IT WORKS
            </p>

            <h2>
              Music follows how you feel.
            </h2>
          </div>
        </div>

        <div className="recommendation-grid">
          {/* STEP 1 */}
          <article className="music-card soft-card">
            <div className="album-placeholder">
              <span>📸</span>
            </div>

            <h3>
              Show your mood
            </h3>

            <p>
              Upload a clear photo and let AI
              understand your facial expression.
            </p>
          </article>

          {/* STEP 2 */}
          <article className="music-card soft-card">
            <div className="album-placeholder">
              <Sparkles
                size={42}
                strokeWidth={1.4}
              />
            </div>

            <h3>
              AI detects your mood
            </h3>

            <p>
              Our emotion recognition model analyzes
              your expression and identifies your mood.
            </p>
          </article>

          {/* STEP 3 */}
          <article className="music-card soft-card">
            <div className="album-placeholder">
              <Music2
                size={42}
                strokeWidth={1.4}
              />
            </div>

            <h3>
              Get your playlist
            </h3>

            <p>
              Receive songs selected specifically
              for your detected emotional state.
            </p>
          </article>

          {/* STEP 4 */}
          <article className="music-card soft-card">
            <div className="album-placeholder">
              <Play
                size={42}
                strokeWidth={1.4}
              />
            </div>

            <h3>
              Press play
            </h3>

            <p>
              Start listening and enjoy music that
              fits the moment.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
