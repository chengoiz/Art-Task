# 🎨 Art Talks

Full‑stack mini app: browse artworks and discuss each piece in real time.
Built with **React (Vite)**, **Express**, and **WebSockets**.

## Why this project

A small, clear home‑assignment that demonstrates end‑to‑end skills (frontend, backend, realtime).

## Features

- Gallery with search
- Picture details with metadata
- Real‑time per‑picture chat (WebSocket)
- In‑memory chat history (resets on restart)
- Responsive UI

## Quick Start (Local Dev)

**Prerequisites:** Node.js ≥ 18, npm ≥ 9

```bash
# Backend
cd backend && npm install && npm run dev  # http://localhost:3000 (REST + WS)

# Frontend (new terminal)
cd frontend && npm install && npm run dev # http://localhost:5173
```

- Frontend proxies `/api` → `http://localhost:3000`.
- WebSocket URL: `ws://localhost:3000`.

## Usage

1. Open `http://localhost:5173`
2. Browse/search artworks → open a picture
3. Chat live in that picture’s room

## Tech Stack

- **Frontend:** React, React Router, Vite
- **Backend:** Express, ws
- **Tooling:** nodemon, npm scripts

## Project Structure

```
backend/
  server.js        # Express + WebSocket
  pictures.js      # Static gallery data
frontend/
  src/
    pages/         # Gallery & Picture detail
    components/    # PictureCard, ChatBox
    styles/
  vite.config.js   # /api proxy → :3000
```
## Photos

<img width="1800" height="1148" alt="image" src="https://github.com/user-attachments/assets/edd1a8c6-56e4-4f26-8510-0f242c647645" />
\n\n
<img width="2880" height="1592" alt="image" src="https://github.com/user-attachments/assets/0154551b-3c5f-46ac-9148-bca6abf514d8" />



