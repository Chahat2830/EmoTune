from typing import Annotated

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from backend.services.emotion import detect_emotion
from backend.services.recommender import get_recommendations


app = FastAPI(
    title="Mood AI API",
    description="AI Mood-Based Music Recommendation API",
    version="3.0.0",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://emo-tune-omega.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
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
# HEALTH CHECK
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
    file: Annotated[UploadFile, File()],
):
    try:
        if file.content_type and not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Please upload a valid image file.",
            )

        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Empty image file.",
            )

        result = detect_emotion(image_bytes)

        return {
            "status": "success",
            **result,
        }

    except HTTPException:
        raise

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Mood detection failed: {error}",
        ) from error

    finally:
        await file.close()


# ============================================================
# SONG RECOMMENDATIONS
# ============================================================

@app.get("/api/recommendations/{mood}")
def recommendations(mood: str):
    try:
        normalized_mood = mood.strip().lower()

        if not normalized_mood:
            raise HTTPException(
                status_code=400,
                detail="Mood cannot be empty.",
            )

        songs = get_recommendations(
            mood=normalized_mood,
            limit=10,
        )

        return {
            "status": "success",
            "mood": normalized_mood,
            "count": len(songs),
            "songs": songs,
        }

    except HTTPException:
        raise

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Recommendation failed: {error}",
        ) from error
