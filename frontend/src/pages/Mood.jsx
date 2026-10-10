import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Camera,
  ImagePlus,
  Loader2,
  Music2,
  Heart,
  Play,
  Sparkles,
  RotateCcw,
  X,
  Check,
} from "lucide-react";

import {
  detectMood,
  getRecommendations,
} from "../services/api";

import "./Mood.css";


// ============================================================
// FAVORITES
// ============================================================

const FAVORITES_KEY =
  "mood-ai-favorites";


// ============================================================
// MOOD DESCRIPTIONS
// ============================================================

const MOOD_DESCRIPTIONS = {
  happy:
    "Bright songs for a joyful moment.",

  sad:
    "Soft songs for an emotional moment.",

  energetic:
    "High-energy songs to lift you up.",

  calm:
    "Peaceful songs for a quiet moment.",

  party:
    "Fun songs for a lively moment.",

  angry:
    "Powerful songs to match your energy.",

  fear:
    "Songs to help you slow down and reset.",

  surprise:
    "Unexpected songs for an unexpected mood.",
};


// ============================================================
// COMPONENT
// ============================================================

export default function Mood() {

  // ==========================================================
  // FILE INPUT
  // ==========================================================

  const fileInputRef =
    useRef(null);


  // ==========================================================
  // CAMERA REFS
  // ==========================================================

  const videoRef =
    useRef(null);

  const canvasRef =
    useRef(null);

  const streamRef =
    useRef(null);


  // ==========================================================
  // IMAGE STATE
  // ==========================================================

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [preview, setPreview] =
    useState(null);


  // ==========================================================
  // MOOD STATE
  // ==========================================================

  const [mood, setMood] =
    useState(null);

  const [confidence, setConfidence] =
    useState(null);


  // ==========================================================
  // RECOMMENDATIONS
  // ==========================================================

  const [songs, setSongs] =
    useState([]);


  // ==========================================================
  // LOADING / ERROR
  // ==========================================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================================
  // CAMERA STATE
  // ==========================================================

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

  const [capturedPhoto, setCapturedPhoto] =
    useState(null);


  // ==========================================================
  // FAVORITES
  // ==========================================================

  const [favorites, setFavorites] =
    useState([]);


  // ==========================================================
  // LOAD FAVORITES
  // ==========================================================

  useEffect(() => {

    try {

      const saved =
        localStorage.getItem(
          FAVORITES_KEY
        );

      if (!saved) {
        return;
      }

      const parsed =
        JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setFavorites(parsed);
      }

    } catch (err) {

      console.error(
        "Unable to load favorites:",
        err
      );

    }

  }, []);


  // ==========================================================
  // SAVE FAVORITES
  // ==========================================================

  const saveFavorites = (
    updatedFavorites
  ) => {

    setFavorites(
      updatedFavorites
    );

    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(
        updatedFavorites
      )
    );

  };


  // ==========================================================
  // CHECK FAVORITE
  // ==========================================================

  const isFavorite = (
    song
  ) => {

    return favorites.some(
      (item) =>
        item.song_name ===
          song.song_name &&
        item.artist ===
          song.artist
    );

  };


  // ==========================================================
  // TOGGLE FAVORITE
  // ==========================================================

  const handleFavorite = (
    song
  ) => {

    if (isFavorite(song)) {

      const updated =
        favorites.filter(
          (item) =>
            !(
              item.song_name ===
                song.song_name &&
              item.artist ===
                song.artist
            )
        );

      saveFavorites(updated);

      return;
    }


    saveFavorites([
      song,
      ...favorites,
    ]);

  };


  // ==========================================================
  // CREATE PREVIEW
  // ==========================================================

  const applyFile = (
    file
  ) => {

    if (!file) {
      return;
    }


    // Release previous object URL
    if (preview) {
      URL.revokeObjectURL(
        preview
      );
    }


    const objectUrl =
      URL.createObjectURL(file);


    setSelectedFile(file);

    setPreview(objectUrl);

    setMood(null);

    setConfidence(null);

    setSongs([]);

    setError("");

  };


  // ==========================================================
  // SELECT PHOTO
  // ==========================================================

  const handleFileChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }


    // Only allow images
    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      setError(
        "Please select an image file."
      );

      return;
    }


    applyFile(file);

  };


  // ==========================================================
  // RESET
  // ==========================================================

  const handleReset = () => {

    stopCamera();


    if (preview) {

      URL.revokeObjectURL(
        preview
      );

    }


    if (
      capturedPhoto?.preview
    ) {

      URL.revokeObjectURL(
        capturedPhoto.preview
      );

    }


    setSelectedFile(null);

    setPreview(null);

    setMood(null);

    setConfidence(null);

    setSongs([]);

    setError("");

    setCapturedPhoto(null);

    setCameraError("");


    if (fileInputRef.current) {

      fileInputRef.current.value =
        "";

    }

  };


  // ==========================================================
  // START CAMERA
  // ==========================================================

  const startCamera =
    async () => {

      try {

        setCameraError("");


        // Browser support check

        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices
            .getUserMedia
        ) {

          setCameraError(
            "Camera access is not supported by this browser."
          );

          return;

        }


        // Stop any previous stream

        stopCamera();


        // Request camera

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                facingMode:
                  "user",

                width: {
                  ideal: 1280,
                },

                height: {
                  ideal: 720,
                },
              },

              audio: false,
            }
          );


        streamRef.current =
          stream;


        if (videoRef.current) {

          videoRef.current.srcObject =
            stream;


          await videoRef.current.play();

        }

      } catch (err) {

        console.error(
          "Camera error:",
          err
        );


        if (
          err?.name ===
          "NotAllowedError"
        ) {

          setCameraError(
            "Camera permission was denied. Please allow camera access in your browser."
          );

        } else if (
          err?.name ===
          "NotFoundError"
        ) {

          setCameraError(
            "No camera was found on this device."
          );

        } else {

          setCameraError(
            "Unable to access your camera."
          );

        }

      }

    };


  // ==========================================================
  // STOP CAMERA
  // ==========================================================

  const stopCamera = () => {

    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach(
          (track) => {
            track.stop();
          }
        );


      streamRef.current =
        null;

    }


    if (videoRef.current) {

      videoRef.current.srcObject =
        null;

    }

  };


  // ==========================================================
  // OPEN CAMERA
  // ==========================================================

  const openCamera = () => {

    setCameraError("");

    setCapturedPhoto(null);

    setCameraOpen(true);

  };


  // ==========================================================
  // CAMERA OPEN EFFECT
  // ==========================================================

  useEffect(() => {

    if (!cameraOpen) {

      stopCamera();

      return;

    }


    const timer =
      setTimeout(() => {

        startCamera();

      }, 150);


    return () => {

      clearTimeout(timer);

    };

  }, [cameraOpen]);


  // ==========================================================
  // CAPTURE PHOTO
  // ==========================================================

  const capturePhoto = () => {

    const video =
      videoRef.current;

    const canvas =
      canvasRef.current;


    if (!video || !canvas) {

      return;

    }


    if (
      !video.videoWidth ||
      !video.videoHeight
    ) {

      setCameraError(
        "Camera is not ready yet. Please wait a moment."
      );

      return;

    }


    // Set canvas dimensions

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;


    const context =
      canvas.getContext(
        "2d"
      );


    if (!context) {

      setCameraError(
        "Unable to capture the image."
      );

      return;

    }


    // Draw video frame

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );


    // Convert to JPEG

    canvas.toBlob(
      (blob) => {

        if (!blob) {

          setCameraError(
            "Unable to capture the photo."
          );

          return;

        }


        const file =
          new File(
            [blob],
            "mood-camera-photo.jpg",
            {
              type: "image/jpeg",
            }
          );


        const imageUrl =
          URL.createObjectURL(
            blob
          );


        setCapturedPhoto({
          file,
          preview:
            imageUrl,
        });


        // Stop live camera
        stopCamera();

      },
      "image/jpeg",
      0.92
    );

  };


  // ==========================================================
  // RETAKE PHOTO
  // ==========================================================

  const retakePhoto = () => {

    if (
      capturedPhoto?.preview
    ) {

      URL.revokeObjectURL(
        capturedPhoto.preview
      );

    }


    setCapturedPhoto(
      null
    );

    setCameraError("");


    // Start live camera again

    startCamera();

  };


  // ==========================================================
  // USE CAPTURED PHOTO
  // ==========================================================

  const useCapturedPhoto = () => {

    if (!capturedPhoto) {

      return;

    }


    // Remove previous preview

    if (preview) {

      URL.revokeObjectURL(
        preview
      );

    }


    setSelectedFile(
      capturedPhoto.file
    );


    setPreview(
      capturedPhoto.preview
    );


    setMood(null);

    setConfidence(null);

    setSongs([]);

    setError("");


    // Close camera

    setCapturedPhoto(
      null
    );

    setCameraOpen(
      false
    );

    setCameraError("");

  };


  // ==========================================================
  // CLOSE CAMERA
  // ==========================================================

  const closeCamera = () => {

    stopCamera();


    if (
      capturedPhoto?.preview
    ) {

      URL.revokeObjectURL(
        capturedPhoto.preview
      );

    }


    setCapturedPhoto(
      null
    );

    setCameraError("");

    setCameraOpen(
      false
    );

  };


  // ==========================================================
  // DETECT MOOD
  // ==========================================================

  const handleDetectMood =
    async () => {

      if (!selectedFile) {

        setError(
          "Please choose a photo first."
        );

        return;

      }


      try {

        setLoading(true);

        setError("");


        // ====================================================
        // SEND IMAGE TO FASTAPI
        // ====================================================

        const result =
          await detectMood(
            selectedFile
          );


        // ====================================================
        // GET DETECTED MOOD
        // ====================================================

        const detectedMood =
          result.mood;


        setMood(
          detectedMood
        );


        setConfidence(
          result.confidence_percent
        );


        // ====================================================
        // GET RECOMMENDATIONS
        // ====================================================

        const recommendation =
          await getRecommendations(
            detectedMood
          );


        setSongs(
          recommendation.songs ||
            []
        );

      } catch (err) {

        console.error(
          "Mood detection error:",
          err
        );


        setError(
          err?.response?.data
            ?.detail ||
            "Unable to detect your mood. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // YOUTUBE VIDEO ID
  // ==========================================================

  const getYouTubeId = (
    url
  ) => {

    if (!url) {

      return null;

    }


    try {

      const parsedUrl =
        new URL(url);


      // Example:
      // youtube.com/watch?v=ABC123

      if (
        parsedUrl.hostname.includes(
          "youtube.com"
        )
      ) {

        return parsedUrl
          .searchParams
          .get("v");

      }


      // Example:
      // youtu.be/ABC123

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


  // ==========================================================
  // SONG THUMBNAIL
  // ==========================================================

  const getSongThumbnail = (
    song
  ) => {

    // If backend eventually
    // provides cover_image,
    // use it first.

    if (
      song.cover_image
    ) {

      return song.cover_image;

    }


    // Otherwise use YouTube

    const videoId =
      getYouTubeId(
        song.youtube_url
      );


    if (!videoId) {

      return null;

    }


    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  };


  // ==========================================================
  // MOOD DESCRIPTION
  // ==========================================================

  const moodDescription =
    mood
      ? (
          MOOD_DESCRIPTIONS[
            String(
              mood
            ).toLowerCase()
          ] ||
          "Songs selected to match your current mood."
        )
      : "";


  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {

    return () => {

      stopCamera();

    };

  }, []);


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="mood-page">

      <div className="mood-container">


        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="mood-hero">

          <div>

            <p className="mood-hero-small">
              YOUR PERSONAL MUSIC EXPERIENCE
            </p>


            <h1>
              How are you
              <span>
                {" "}
                feeling today?
              </span>
            </h1>


            <p className="mood-hero-description">
              Upload a clear photo or use
              your camera and let AI
              understand your mood.
            </p>

          </div>


          <div className="mood-sparkle">

            <Sparkles size={20} />

          </div>

        </section>


        {/* ====================================================
            DETECTION AREA
        ==================================================== */}

        <section className="mood-detection-grid">


          {/* ==================================================
              PHOTO CARD
          ================================================== */}

          <div className="mood-photo-card">


            {/* HEADER */}

            <div className="mood-card-header">

              <div>

                <h2>
                  Show me your mood
                </h2>

                <p>
                  Use a photo with your
                  face clearly visible.
                </p>

              </div>


              <Camera size={17} />

            </div>


            {/* =================================================
                IMAGE PREVIEW
            ================================================= */}

            <div className="mood-photo-container">

              {preview ? (

                <img
                  src={preview}
                  alt="Selected face"
                  className="mood-photo"
                />

              ) : (

                <div className="mood-photo-placeholder">

                  <Camera size={34} />

                  <span>
                    Your photo will appear
                    here
                  </span>

                </div>

              )}

            </div>


            {/* =================================================
                FILE INPUT
            ================================================= */}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={
                handleFileChange
              }
              className="mood-file-input"
            />


            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="mood-actions">


              {/* CHOOSE PHOTO */}

              <button
                type="button"
                className="mood-primary-button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >

                <ImagePlus
                  size={15}
                />

                Choose Photo

              </button>


              {/* CAMERA */}

              <button
                type="button"
                className="mood-camera-button"
                onClick={
                  openCamera
                }
              >

                <Camera
                  size={15}
                />

                Camera

              </button>


              {/* RESET */}

              {selectedFile && (

                <button
                  type="button"
                  className="mood-secondary-button"
                  onClick={
                    handleReset
                  }
                >

                  <RotateCcw
                    size={14}
                  />

                  Reset

                </button>

              )}

            </div>


            {/* =================================================
                DETECT MOOD
            ================================================= */}

            <button
              type="button"
              className="mood-detect-button"
              onClick={
                handleDetectMood
              }
              disabled={
                !selectedFile ||
                loading
              }
            >

              {loading ? (

                <>

                  <Loader2
                    size={15}
                    className="spin"
                  />

                  Analyzing...

                </>

              ) : (

                <>

                  <Sparkles
                    size={15}
                  />

                  Detect My Mood

                </>

              )}

            </button>

          </div>


          {/* ==================================================
              CURRENT MOOD
          ================================================== */}

          <div className="mood-current-card">


            <div className="mood-current-top">

              <span>
                ♡ YOUR CURRENT MOOD
              </span>

            </div>


            {mood ? (

              <>

                <h2 className="mood-result-title">
                  {mood}
                </h2>


                <p className="mood-result-description">
                  {moodDescription}
                </p>


                <p className="mood-confidence-text">

                  Confidence{" "}

                  <strong>
                    {confidence}%
                  </strong>

                </p>

              </>

            ) : (

              <div className="mood-no-result">

                <Music2 size={30} />

                <h2>
                  Waiting for you
                </h2>

                <p>
                  Upload a photo or use
                  your camera to discover
                  your mood.
                </p>

              </div>

            )}

          </div>

        </section>


        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (

          <div className="mood-error">
            {error}
          </div>

        )}


        {/* ====================================================
            STATS
        ==================================================== */}

        {mood && (

          <section className="mood-stats">


            <div>

              <span>
                DETECTED EMOTION
              </span>

              <strong>
                {mood}
              </strong>

            </div>


            <div>

              <span>
                CONFIDENCE
              </span>

              <strong>
                {confidence}%
              </strong>

            </div>


            <div>

              <span>
                RECOMMENDATIONS
              </span>

              <strong>
                {songs.length}
              </strong>

            </div>


          </section>

        )}


        {/* ====================================================
            SONG RECOMMENDATIONS
        ==================================================== */}

        {songs.length > 0 && (

          <section className="mood-playlist">


            {/* PLAYLIST HEADER */}

            <div className="mood-playlist-heading">

              <div>

                <p>
                  MADE FOR YOUR MOOD
                </p>

                <h2>
                  Songs you'll love
                </h2>

              </div>


              <span>
                {songs.length} songs
              </span>

            </div>


            {/* SONG GRID */}

            <div className="mood-song-grid">


              {songs.map(
                (song, index) => {

                  const thumbnail =
                    getSongThumbnail(
                      song
                    );


                  const favorite =
                    isFavorite(
                      song
                    );


                  return (

                    <article
                      className="mood-song-card"
                      key={
                        `${song.song_name}-${song.artist}-${index}`
                      }
                    >


                      {/* =====================================
                          SONG COVER
                      ===================================== */}

                      <div className="mood-song-cover">


                        {thumbnail ? (

                          <img
                            src={thumbnail}
                            alt={`${song.song_name} cover`}
                            loading="lazy"
                            onError={(
                              event
                            ) => {

                              event.currentTarget.style.display =
                                "none";


                              const fallback =
                                event
                                  .currentTarget
                                  .nextElementSibling;


                              if (
                                fallback
                              ) {

                                fallback.style.display =
                                  "flex";

                              }

                            }}
                          />

                        ) : null}


                        {/* FALLBACK */}

                        <div
                          className="mood-song-cover-fallback"
                          style={{
                            display:
                              thumbnail
                                ? "none"
                                : "flex",
                          }}
                        >

                          <Music2
                            size={34}
                          />

                        </div>


                        {/* PLAY */}

                        {song.youtube_url && (

                          <button
                            type="button"
                            className="mood-play-button"
                            onClick={() =>
                              window.open(
                                song.youtube_url,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                            aria-label={
                              `Play ${song.song_name}`
                            }
                          >

                            <Play
                              size={13}
                              fill="currentColor"
                            />

                          </button>

                        )}

                      </div>


                      {/* =====================================
                          SONG INFORMATION
                      ===================================== */}

                      <div className="mood-song-info">


                        <div className="mood-song-text">

                          <h3
                            title={
                              song.song_name
                            }
                          >

                            {
                              song.song_name
                            }

                          </h3>


                          <p
                            title={
                              song.artist ||
                              song.singer ||
                              "Unknown Artist"
                            }
                          >

                            {song.artist ||
                              song.singer ||
                              "Unknown Artist"}

                          </p>

                        </div>


                        {/* FAVORITE */}

                        <button
                          type="button"
                          className={`mood-heart-button ${
                            favorite
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleFavorite(
                              song
                            )
                          }
                          aria-label={
                            favorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >

                          <Heart
                            size={15}
                            fill={
                              favorite
                                ? "currentColor"
                                : "none"
                            }
                          />

                        </button>

                      </div>

                    </article>

                  );

                }
              )}

            </div>

          </section>

        )}

      </div>


      {/* ======================================================
          CAMERA MODAL
      ====================================================== */}

      {cameraOpen && (

        <div className="camera-overlay">


          <div className="camera-modal">


            {/* CAMERA HEADER */}

            <div className="camera-modal-header">

              <div>

                <span>
                  CAMERA
                </span>

                <h2>
                  Take your mood photo
                </h2>

              </div>


              <button
                type="button"
                className="camera-close-button"
                onClick={
                  closeCamera
                }
                aria-label="Close camera"
              >

                <X size={18} />

              </button>

            </div>


            {/* CAMERA PREVIEW */}

            <div className="camera-preview">


              {capturedPhoto ? (

                <img
                  src={
                    capturedPhoto.preview
                  }
                  alt="Captured mood"
                />

              ) : (

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                />

              )}


              {/* FACE GUIDE */}

              {!capturedPhoto &&
                !cameraError && (

                  <div className="camera-guide">

                    <div className="face-frame" />

                    <span>
                      Position your face
                      inside the frame
                    </span>

                  </div>

                )}

            </div>


            {/* HIDDEN CANVAS */}

            <canvas
              ref={canvasRef}
              className="camera-canvas"
            />


            {/* CAMERA ERROR */}

            {cameraError && (

              <div className="camera-error">

                {cameraError}

              </div>

            )}


            {/* CAMERA BUTTONS */}

            <div className="camera-actions">


              {capturedPhoto ? (

                <>

                  {/* RETAKE */}

                  <button
                    type="button"
                    className="camera-retake-button"
                    onClick={
                      retakePhoto
                    }
                  >

                    <RotateCcw
                      size={15}
                    />

                    Retake

                  </button>


                  {/* USE PHOTO */}

                  <button
                    type="button"
                    className="camera-use-button"
                    onClick={
                      useCapturedPhoto
                    }
                  >

                    <Check
                      size={15}
                    />

                    Use Photo

                  </button>

                </>

              ) : (

                /* TAKE PHOTO */

                <button
                  type="button"
                  className="camera-capture-button"
                  onClick={
                    capturePhoto
                  }
                  disabled={
                    !!cameraError
                  }
                >

                  <Camera
                    size={17}
                  />

                  Take Photo

                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </main>
  );
}