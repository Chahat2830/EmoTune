import {
  ExternalLink,
  Heart,
  Play,
} from "lucide-react";

import "./SongCard.css";

function SongCard({
  song,
  isFavorite = false,
  onFavorite,
}) {
  if (!song) {
    return null;
  }

  const songName =
    song.song_name ||
    song["Song name"] ||
    "Unknown Song";

  const artist =
    song.artist ||
    song.singer ||
    song["Artist"] ||
    "Unknown Artist";

  const mood =
    song.mood ||
    song.Mood ||
    "";

  const youtubeUrl =
    song.youtube_url ||
    song.Youtube_URL ||
    "";

  const spotifyUrl =
    song.spotify_url ||
    "";

  const confidence =
    song.confidence;

  const classificationMethod =
    song.classification_method ||
    song["Classification Method"] ||
    "";

  // ========================================================
  // EXTRACT YOUTUBE VIDEO ID
  // ========================================================

  const getYouTubeId = (url) => {
    if (!url) {
      return null;
    }

    try {
      const parsedUrl = new URL(url);

      // youtube.com/watch?v=XXXX
      if (
        parsedUrl.hostname.includes(
          "youtube.com"
        )
      ) {
        return parsedUrl.searchParams.get(
          "v"
        );
      }

      // youtu.be/XXXX
      if (
        parsedUrl.hostname.includes(
          "youtu.be"
        )
      ) {
        return parsedUrl.pathname
          .replace("/", "")
          .split("?")[0];
      }

      return null;
    } catch {
      return null;
    }
  };

  const youtubeId =
    getYouTubeId(youtubeUrl);

  // ========================================================
  // THUMBNAIL
  // ========================================================

  const thumbnailUrl = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : null;

  // ========================================================
  // PLAY
  // ========================================================

  const handlePlay = () => {
    const url =
      youtubeUrl || spotifyUrl;

    if (!url) {
      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <article className="song-card soft-card">

      {/* ====================================================
          SONG IMAGE
      ==================================================== */}

      <div className="song-cover">

        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`${songName} cover`}
            className="song-cover-image"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";

              event.currentTarget.nextElementSibling.style.display =
                "flex";
            }}
          />
        ) : null}

        {/* Fallback */}

        <div
          className="song-cover-placeholder"
          style={{
            display: thumbnailUrl
              ? "none"
              : "flex",
          }}
        >
          <span>♫</span>
        </div>

        {/* PLAY */}

        {(youtubeUrl ||
          spotifyUrl) && (
          <button
            type="button"
            className="song-play-button"
            onClick={handlePlay}
            aria-label={`Play ${songName}`}
          >
            <Play
              size={18}
              fill="currentColor"
            />
          </button>
        )}

      </div>

      {/* ====================================================
          SONG INFO
      ==================================================== */}

      <div className="song-info">

        <div className="song-title-row">

          <div className="song-text">

            <h3 title={songName}>
              {songName}
            </h3>

            <p title={artist}>
              {artist}
            </p>

          </div>

          {/* FAVORITE */}

          <button
            type="button"
            className={`favorite-button ${
              isFavorite
                ? "active"
                : ""
            }`}
            onClick={() =>
              onFavorite?.(song)
            }
            aria-label={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            <Heart
              size={18}
              fill={
                isFavorite
                  ? "currentColor"
                  : "none"
              }
            />
          </button>

        </div>

        {/* META */}

        <div className="song-meta">

          {mood && (
            <span className="song-mood">
              {mood}
            </span>
          )}

          {confidence !==
            undefined &&
            confidence !== null && (
              <span>
                {Number(
                  confidence
                ).toFixed(2)}
                % confidence
              </span>
          )}

        </div>

        {/* LINKS */}

        <div className="song-links">

          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              YouTube
              <ExternalLink
                size={13}
              />
            </a>
          )}

          {spotifyUrl && (
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              Spotify
              <ExternalLink
                size={13}
              />
            </a>
          )}

        </div>

        {classificationMethod && (
          <div className="song-classification">
            {classificationMethod}
          </div>
        )}

      </div>

    </article>
  );
}

export default SongCard;