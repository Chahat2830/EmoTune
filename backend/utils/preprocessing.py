import cv2
import numpy as np


def decode_image(image_bytes):
    """
    Convert uploaded image bytes into an OpenCV image.
    """

    arr = np.frombuffer(
        image_bytes,
        dtype=np.uint8
    )

    image = cv2.imdecode(
        arr,
        cv2.IMREAD_COLOR
    )

    if image is None:
        raise ValueError("Could not decode image")

    return image


def detect_faces(image, face_cascade):
    """
    Detect faces in an OpenCV image.
    """

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5
    )

    return faces


def crop_face(image, face):
    """
    Crop a detected face from the image.
    """

    x, y, w, h = face

    return image[
        y:y + h,
        x:x + w
    ]


def prepare_face(face, image_size=224):
    """
    Resize and normalize face for ONNX inference.
    """

    face = cv2.resize(
        face,
        (image_size, image_size)
    )

    face = face.astype(
        np.float32
    ) / 255.0

    # HWC → CHW
    face = face.transpose(
        2,
        0,
        1
    )

    # Add batch dimension
    face = face.reshape(
        1,
        3,
        image_size,
        image_size
    )

    return face