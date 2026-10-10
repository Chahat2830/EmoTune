# EmoTune — Music for Your Feelings

<p align="center">
  <strong>AI-powered mood-based music recommendation system</strong><br>
  Discover music that fits your mood.
</p>

<p align="center">
  <a href="https://emo-tune-omega.vercel.app/"><strong>🌐 Live Demo</strong></a>
  ·
  <a href="https://github.com/Chahat2830/EmoTune"><strong>💻 Source Code</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-646CFF?logo=react&logoColor=white" alt="React and Vite">
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/ML-ONNX-005CED?logo=onnx&logoColor=white" alt="ONNX">
  <img src="https://img.shields.io/badge/Status-Frontend%20Deployed-brightgreen" alt="Frontend deployed">
</p>

## Overview

**EmoTune** is a mood-based music recommendation project designed to connect facial emotion recognition with music discovery. Its goal is to help users explore songs that match how they feel through a web interface.

The frontend is deployed on Vercel. Full online mood detection and recommendations depend on the FastAPI backend and its required model/data assets being deployed and correctly configured.

## Live Demo

**Website:** https://emo-tune-omega.vercel.app/

> The frontend is deployed. Backend-dependent features may not work in the live demo until the API is hosted, configured, and connected to the frontend.

## Features

- **Mood detection interface** — designed for a facial-emotion-based music workflow.
- **Mood-based recommendations** — recommendation service backed by the project backend.
- **Explore music** — browse and discover recommended songs.
- **Favorites** — save songs in the interface.
- **Responsive web interface** — built with React and Vite.
- **Separate frontend and backend** — UI and API can be developed and deployed independently.

> Feature availability depends on the current implementation and backend configuration. Update this list as features are tested and verified.

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Python, FastAPI |
| Model inference | ONNX Runtime / ONNX model (where configured) |
| Recommendation data | CSV and pickle assets used by the backend |
| Deployment | Vercel for the frontend; backend hosting configured separately |
| Version control | Git and GitHub |

## Repository Structure

```text
EmoTune/
├── backend/
│   ├── data/
│   ├── services/
│   ├── utils/
│   └── main.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   └── package.json
├── requirements.txt
├── .gitignore
└── README.md
```

This is a high-level overview. The exact files may differ as the project evolves.

## Run Locally

### Prerequisites

- Python version compatible with the packages in `requirements.txt`
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Chahat2830/EmoTune.git
cd EmoTune
```

### 2. Set up the backend

Create and activate a virtual environment.

**Windows (Command Prompt):**

```bat
python -m venv .venv
.venv\Scripts\activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server using the application entry point:

```bash
uvicorn backend.main:app --reload
```

If this import path does not match your local package layout, check the FastAPI app variable and module path in `backend/main.py` and adjust the command accordingly.

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will print a local development URL in the terminal, commonly `http://localhost:5173`.

### 4. Connect frontend and backend

Check `frontend/src/services/api.js` for the API base URL. For local development, it should point to your local backend address and port. For production, configure it to use the deployed backend URL.

The backend must allow requests from the frontend origin through its CORS configuration.

## Deployment

### Frontend — Vercel

The frontend is deployed at:

https://emo-tune-omega.vercel.app/

The frontend project uses the `frontend` directory as its root, with the usual Vite build settings:

- Build command: `npm run build`
- Output directory: `dist`

### Backend — deploy separately

The FastAPI backend needs a Python-compatible host if you want backend-powered features to work for public visitors.

Before deploying, verify:

1. The correct start command and Python dependencies.
2. The ONNX model and recommendation data are available to the service.
3. CORS permits the deployed Vercel domain.
4. The frontend API base URL points to the deployed backend.
5. Any secrets are stored as host environment variables, not committed to Git.

The ONNX model may be too large for a normal GitHub file (GitHub blocks individual files larger than 100 MB). Keep it out of ordinary Git commits and arrange for the deployment environment to obtain it separately, or use an appropriate model artifact/storage solution.

## Configuration and Data

- Do not commit `.env` files, API keys, tokens, or credentials.
- If configuration variables are needed, document their names in an `.env.example` file with placeholder values only.
- Ensure required CSV, pickle, and model files are available before starting the backend.
- Avoid committing generated files such as `__pycache__`, virtual environments, and notebook checkpoints.

## Screenshots

Add screenshots from the actual running EmoTune app to a folder such as `docs/screenshots/`, then link them here. For example:

```md
![EmoTune homepage](docs/screenshots/homepage.png)
![Mood detection page](docs/screenshots/mood-detection.png)
![Song recommendations](docs/screenshots/recommendations.png)
```

Replace these example paths with the screenshots you add to the repository.

## Roadmap

- [ ] Deploy the FastAPI backend and connect it to the live frontend.
- [ ] Verify end-to-end mood detection and song recommendations in production.
- [ ] Add screenshots and a short demo video.
- [ ] Document the exact model and dataset setup steps.
- [ ] Add automated tests for core recommendation and API behavior.

## Contributing

Suggestions and bug reports are welcome. Open an issue to describe a problem or propose an improvement.

## Author

**Chahat**

- GitHub: [@Chahat2830](https://github.com/Chahat2830)
- Portfolio: [Portfolio Website](https://chahat2830.github.io/-Portfolio-website/)

## License

No license has been specified yet. If you intend others to reuse or modify this project, add a `LICENSE` file and choose a license that fits your goals.
