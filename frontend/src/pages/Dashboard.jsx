import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Music2,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Headphones,
  Disc3,
  ChevronRight,
} from "lucide-react";

import "./Dashboard.css";

const STORAGE_KEY = "mood-ai-favorites";

const moodData = [
  {
    name: "Happy",
    description: "Bright & joyful",
    percentage: 82,
    className: "happy",
  },
  {
    name: "Sad",
    description: "Soft & emotional",
    percentage: 58,
    className: "sad",
  },
  {
    name: "Calm",
    description: "Peaceful & gentle",
    percentage: 71,
    className: "calm",
  },
];

function Dashboard() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const storedFavorites =
        localStorage.getItem(STORAGE_KEY);

      const parsedFavorites = storedFavorites
        ? JSON.parse(storedFavorites)
        : [];

      setFavorites(
        Array.isArray(parsedFavorites)
          ? parsedFavorites
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load favorites:",
        error
      );

      setFavorites([]);
    }
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Favorite Songs",
        value: favorites.length,
        icon: Heart,
        description:
          favorites.length === 1
            ? "1 song saved"
            : `${favorites.length} songs saved`,
        className: "rose",
      },
      {
        label: "Moods Explored",
        value: 5,
        icon: Sparkles,
        description: "Across your music world",
        className: "gold",
      },
      {
        label: "Songs Discovered",
        value: 40,
        icon: Music2,
        description: "Recommendations explored",
        className: "blue",
      },
      {
        label: "Music Journey",
        value: "Growing",
        icon: TrendingUp,
        description: "Keep discovering",
        className: "green",
      },
    ],
    [favorites.length]
  );

  const recentFavorites = useMemo(
    () => favorites.slice(0, 3),
    [favorites]
  );

  return (
    <main className="dashboard-page">

      {/* HEADER */}
      <section className="dashboard-header">
        <div className="dashboard-heading">
          <p className="eyebrow">
            YOUR PERSONAL SPACE
          </p>

          <h1 className="display-font">
            Your music
            <br />
            <span>journey.</span>
          </h1>

          <p className="dashboard-subtitle">
            A little look at your Mood AI
            experience.
          </p>
        </div>

        <div className="dashboard-icon">
          <Music2 size={32} strokeWidth={1.7} />
        </div>
      </section>

      {/* STATS */}
      <section className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              className={`soft-card stat-card ${stat.className}`}
              key={stat.label}
            >
              <div className="stat-top">
                <div className="stat-icon">
                  <Icon size={21} />
                </div>

                <ArrowUpRight
                  className="stat-arrow"
                  size={17}
                />
              </div>

              <div className="stat-content">
                <span>{stat.label}</span>

                <strong>{stat.value}</strong>

                <small>
                  {stat.description}
                </small>
              </div>
            </article>
          );
        })}
      </section>

      {/* MAIN DASHBOARD */}
      <section className="dashboard-content">

        {/* MOOD JOURNEY */}
        <article className="soft-card journey-card">

          <div className="journey-heading">
            <div>
              <p className="eyebrow">
                MOOD JOURNEY
              </p>

              <h2 className="display-font">
                Music follows
                <br />
                how you feel.
              </h2>
            </div>

            <div className="section-icon">
              <Sparkles size={21} />
            </div>
          </div>

          <div className="mood-journey">
            {moodData.map((mood) => (
              <div
                className="journey-item"
                key={mood.name}
              >
                <div className="journey-main">
                  <span
                    className={`journey-dot ${mood.className}-dot`}
                  />

                  <div className="journey-label">
                    <strong>
                      {mood.name}
                    </strong>

                    <p>
                      {mood.description}
                    </p>
                  </div>
                </div>

                <div className="journey-progress">
                  <div className="progress-track">
                    <div
                      className={`progress-fill ${mood.className}-fill`}
                      style={{
                        width: `${mood.percentage}%`,
                      }}
                    />
                  </div>

                  <span>
                    {mood.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="journey-footer">
            <div>
              <Headphones size={16} />
              <span>
                Your mood shapes your soundtrack
              </span>
            </div>

            <span className="journey-status">
              Active
            </span>
          </div>
        </article>

        {/* NOTE */}
        <article className="soft-card dashboard-note">

          <div className="note-decoration">
            <Disc3 size={27} />
          </div>

          <p className="eyebrow">
            A LITTLE REMINDER
          </p>

          <h2 className="display-font">
            There is a song
            <br />
            for every feeling.
          </h2>

          <p>
            Keep exploring, discover new
            artists, and let your mood choose
            the soundtrack.
          </p>

          <div className="note-footer">
            <span>
              Keep listening
            </span>

            <ChevronRight size={17} />
          </div>
        </article>
      </section>

      {/* FAVORITES */}
      <section className="favorites-preview soft-card">

        <div className="favorites-heading">
          <div>
            <p className="eyebrow">
              YOUR COLLECTION
            </p>

            <h2 className="display-font">
              Recently saved
            </h2>
          </div>

          <div className="favorites-count">
            <Heart size={15} />
            <span>
              {favorites.length}
            </span>
          </div>
        </div>

        {recentFavorites.length > 0 ? (
          <div className="dashboard-favorites">
            {recentFavorites.map(
              (song, index) => (
                <div
                  className="dashboard-song"
                  key={
                    song.id ||
                    `${song.song_name}-${index}`
                  }
                >
                  <div className="dashboard-song-cover">
                    {song.cover_image ? (
                      <img
                        src={song.cover_image}
                        alt={
                          song.song_name ||
                          "Song cover"
                        }
                      />
                    ) : (
                      <Music2 size={20} />
                    )}
                  </div>

                  <div className="dashboard-song-info">
                    <strong>
                      {song.song_name ||
                        "Unknown Song"}
                    </strong>

                    <span>
                      {song.singer ||
                        song.artist ||
                        "Unknown Artist"}
                    </span>
                  </div>

                  <Heart
                    className="saved-heart"
                    size={17}
                    fill="currentColor"
                  />
                </div>
              )
            )}
          </div>
        ) : (
          <div className="favorites-empty">
            <div className="empty-icon">
              <Heart size={23} />
            </div>

            <div>
              <strong>
                Your collection is empty
              </strong>

              <p>
                Explore songs and save the ones
                that match your mood.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;