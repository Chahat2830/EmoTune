# backend/services/recommender.py

import os
import pandas as pd


# ============================================================
# 1. DATASET PATH
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "data",
    "songs_with_moods.csv"
)


# ============================================================
# 2. LOAD DATASET
# ============================================================

if not os.path.exists(DATASET_PATH):
    raise FileNotFoundError(
        f"Dataset not found:\n{DATASET_PATH}"
    )

df = pd.read_csv(DATASET_PATH)


print("=" * 60)
print("SONG DATASET")
print("=" * 60)

print("Path:", DATASET_PATH)
print("Shape:", df.shape)
print("Columns:", df.columns.tolist())


# ============================================================
# 3. CHECK REQUIRED COLUMNS
# ============================================================

required_columns = [
    "song_name",
    "artist",
    "mood",
]

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        "\nMissing required columns:\n"
        f"{missing_columns}\n\n"
        f"Available columns:\n"
        f"{df.columns.tolist()}"
    )


# ============================================================
# 4. CLEAN DATA
# ============================================================

df["song_name"] = (
    df["song_name"]
    .fillna("Unknown Song")
    .astype(str)
    .str.strip()
)

df["artist"] = (
    df["artist"]
    .fillna("Unknown Artist")
    .astype(str)
    .str.strip()
)

df["mood"] = (
    df["mood"]
    .fillna("")
    .astype(str)
    .str.strip()
)


# ============================================================
# 5. VALID MOODS
# ============================================================

VALID_MOODS = [
    "Happy",
    "Sad",
    "Energetic",
    "Calm",
    "Party",
]


# ============================================================
# 6. NORMALIZE MOOD
# ============================================================

df["mood"] = (
    df["mood"]
    .str.strip()
    .str.capitalize()
)


# Keep only valid moods
df = df[
    df["mood"].isin(VALID_MOODS)
].copy()


# ============================================================
# 7. RECOMMENDATION FUNCTION
# ============================================================

def get_recommendations(
    mood: str,
    limit: int = 10,
):
    """
    Get random song recommendations
    for a specific mood.

    Returns frontend-friendly JSON:

    {
        "song_name": "...",
        "artist": "...",
        "mood": "...",
        "youtube_url": "...",
        "confidence": "...",
        "classification_method": "..."
    }
    """

    # --------------------------------------------------------
    # Validate mood
    # --------------------------------------------------------

    if not mood:
        raise ValueError(
            "Mood cannot be empty."
        )

    mood = (
        mood
        .strip()
        .capitalize()
    )

    if mood not in VALID_MOODS:
        raise ValueError(
            f"Invalid mood: '{mood}'. "
            f"Available moods: {VALID_MOODS}"
        )

    # --------------------------------------------------------
    # Validate limit
    # --------------------------------------------------------

    try:
        limit = int(limit)
    except (TypeError, ValueError):
        limit = 10

    # Keep limit between 1 and 100
    limit = max(
        1,
        min(limit, 100)
    )

    # --------------------------------------------------------
    # Filter songs by mood
    # --------------------------------------------------------

    songs = df[
        df["mood"].str.lower()
        == mood.lower()
    ].copy()

    # --------------------------------------------------------
    # Check results
    # --------------------------------------------------------

    if songs.empty:
        return []

    # --------------------------------------------------------
    # Random recommendations
    # --------------------------------------------------------

    songs = songs.sample(
        n=min(
            limit,
            len(songs)
        ),
        random_state=None,
    )

    # --------------------------------------------------------
    # Select columns
    # --------------------------------------------------------

    result_columns = [
        "song_name",
        "artist",
        "mood",
    ]

    # Add YouTube URL if available
    if "youtube_url" in songs.columns:
        result_columns.append(
            "youtube_url"
        )

    # Add confidence if available
    if "confidence" in songs.columns:
        result_columns.append(
            "confidence"
        )

    # Add classification method
    if (
        "classification_method"
        in songs.columns
    ):
        result_columns.append(
            "classification_method"
        )

    # Keep only columns that exist
    result_columns = [
        column
        for column in result_columns
        if column in songs.columns
    ]

    songs = songs[
        result_columns
    ].copy()

    # --------------------------------------------------------
    # IMPORTANT:
    # DO NOT rename song_name/artist/mood.
    #
    # React expects:
    # song.song_name
    # song.artist
    # song.mood
    # --------------------------------------------------------

    # Convert NaN -> None
    songs = songs.where(
        pd.notna(songs),
        None,
    )

    # --------------------------------------------------------
    # Convert confidence to normal number
    # --------------------------------------------------------

    if "confidence" in songs.columns:
        def clean_confidence(value):
            if value is None:
                return None

            try:
                value = float(value)

                # If dataset stores confidence
                # as 0.7447 -> convert to 74.47
                if 0 <= value <= 1:
                    value *= 100

                return round(value, 2)

            except (
                TypeError,
                ValueError,
            ):
                return None

        songs["confidence"] = (
            songs["confidence"]
            .apply(clean_confidence)
        )

    # --------------------------------------------------------
    # Return JSON-compatible records
    # --------------------------------------------------------

    return songs.to_dict(
        orient="records"
    )


# ============================================================
# 8. GET AVAILABLE MOODS
# ============================================================

def get_available_moods():
    """
    Return all supported recommendation moods.
    """

    return VALID_MOODS.copy()


# ============================================================
# 9. GET MOOD COUNT
# ============================================================

def get_mood_count(
    mood: str,
):
    """
    Return number of songs available
    for a specific mood.
    """

    if not mood:
        return 0

    mood = (
        mood
        .strip()
        .capitalize()
    )

    if mood not in VALID_MOODS:
        return 0

    return int(
        (
            df["mood"].str.lower()
            == mood.lower()
        ).sum()
    )


# ============================================================
# 10. DATASET INFORMATION
# ============================================================

def get_dataset_info():
    """
    Return basic information about
    the recommendation dataset.
    """

    return {
        "total_songs": int(
            len(df)
        ),

        "total_columns": int(
            len(df.columns)
        ),

        "moods": {
            mood: int(
                (
                    df["mood"].str.lower()
                    == mood.lower()
                ).sum()
            )
            for mood in VALID_MOODS
        },
    }


# ============================================================
# 11. STARTUP INFORMATION
# ============================================================

print("=" * 60)
print("RECOMMENDER LOADED")
print("=" * 60)

print(
    "Total valid songs:",
    len(df),
)

print("\nMood distribution:")

print(
    df["mood"].value_counts()
)

print("=" * 60)