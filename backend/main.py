from typing import Annotated

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from services.emotion import detect_emotion
from services.recommender import get_recommendations


app = FastAPI(
    title="Mood AI API",
    description="AI Mood-Based Music Recommendation API",
    version="3.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Mood AI API is running",
        "status": "success",
        "version": "3.0.0",
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


# ============================================================
# MOOD DETECTION
# ============================================================

@app.post("/api/detect-mood")
async def detect_mood(
    file: Annotated[
        UploadFile,
        File(),
    ],
):
    try:
        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Empty image file.",
            )

        result = detect_emotion(
            image_bytes
        )

        return {
            "status": "success",
            **result,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Mood detection failed: {error}",
        ) from error


# ============================================================
# RECOMMENDATIONS
# ============================================================

@app.get(
    "/api/recommendations/{mood}"
)
def recommendations(
    mood: str,
):
    try:
        songs = get_recommendations(
            mood=mood,
            limit=10,
        )

        return {
            "status": "success",
            "mood": mood.lower(),
            "count": len(songs),
            "songs": songs,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "Recommendation failed: "
                f"{error}"
            ),
        ) from error