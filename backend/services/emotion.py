import os

import cv2
import numpy as np
import onnxruntime as ort
from utils.preprocessing import (
    crop_face,
    decode_image,
    detect_faces,
    prepare_face,
)

# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "best_model.onnx",
)

HAAR_PATH = (
    cv2.data.haarcascades
    + "haarcascade_frontalface_default.xml"
)


# --------------------------------------------------
# LOAD MODEL
# --------------------------------------------------

session = ort.InferenceSession(MODEL_PATH)

input_name = session.get_inputs()[0].name


# --------------------------------------------------
# EMOTIONS
# --------------------------------------------------

EMOTIONS = [
    "Angry",
    "Fear",
    "Happy",
    "Sad",
    "Surprise",
]

MOOD_MAP = {
    "Angry": "angry",
    "Fear": "fear",
    "Happy": "happy",
    "Sad": "sad",
    "Surprise": "surprise",
}


# --------------------------------------------------
# FACE DETECTOR
# --------------------------------------------------

face_cascade = cv2.CascadeClassifier(HAAR_PATH)


# --------------------------------------------------
# PREDICT EMOTION
# --------------------------------------------------

def predict_emotion(face):
    logits = session.run(
        None,
        {input_name: face},
    )[0][0]

    # Stable softmax
    logits = logits - np.max(logits)

    probabilities = (
        np.exp(logits)
        / np.sum(np.exp(logits))
    )

    index = int(np.argmax(probabilities))

    emotion = EMOTIONS[index]
    confidence = float(probabilities[index])
    mood = MOOD_MAP[emotion]

    return {
        "emotion": emotion,
        "mood": mood,
        "confidence": round(confidence, 4),
        "confidence_percent": round(
            confidence * 100,
            2,
        ),
    }


# --------------------------------------------------
# MAIN DETECTION
# --------------------------------------------------

def detect_emotion(image_bytes):
    image = decode_image(image_bytes)

    faces = detect_faces(
        image,
        face_cascade,
    )

    if len(faces) == 0:
        raise ValueError(
            "No face detected. "
            "Please use a clear image."
        )

    face = crop_face(
        image,
        faces[0],
    )

    face = prepare_face(
        face,
        image_size=224,
    )

    return predict_emotion(face)