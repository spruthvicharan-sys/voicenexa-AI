# Voicenexa AI 🎙️
### Speak. Think. Respond — in Real Time.

A production-grade, real-time AI voice assistant web application built with a clean white & blue SaaS design. Powered by OpenAI Whisper (STT), Anthropic Claude (LLM), and ElevenLabs (TTS).

---

## ✨ Features

- 🎙️ **Wake Word Detection** — say "Hey Nexa" for hands-free activation
- ⚡ **Real-Time WebSocket Pipeline** — sub-2-second end-to-end latency
- 🧠 **Multi-Turn Memory** — keeps last 10 conversation turns per session
- 🗣️ **Whisper STT** — accurate speech-to-text across accents and noise
- 🤖 **Claude LLM** — Anthropic's Claude for intelligent, natural responses
- 🔊 **ElevenLabs TTS** — lifelike voice synthesis with style controls
- 🌐 **3D Voice Orb** — animated React Three Fiber orb with state-based effects
- 📱 **Fully Responsive** — works on desktop, tablet, and mobile
- 📜 **Conversation History** — browse and replay past sessions
- ⚙️ **Settings Panel** — control speed, voice, memory, and autoplay

---

## 🗂️ Project Structure

```
voicenexa/
├── backend/
│   ├── main.py                  # FastAPI app, routes, WebSocket handler
│   ├── config.py                # Environment variable settings
│   ├── requirements.txt
│   ├── Dockerfile
│   └── services/
│       ├── stt_service.py       # Whisper speech-to-text
│       ├── llm_service.py       # Claude LLM integration
│       ├── tts_service.py       # ElevenLabs text-to-speech
│       ├── memory_service.py    # Per-session conversation memory
│       └── websocket_manager.py # WebSocket connection manager
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── nginx.conf               # Nginx config for Docker/production
│   ├── Dockerfile
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles/
│       │   └── globals.css
│       ├── hooks/
│       │   ├── useVoiceSession.js   # Core WebSocket + recording hook
│       │   └── useSettings.js      # Persisted settings hook
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── VoiceOrb.jsx         # 3D Three.js orb
│       │   ├── WaveformVisualizer.jsx
│       │   ├── MicButton.jsx
│       │   ├── ChatPanel.jsx
│       │   ├── PipelineFlow.jsx
│       │   ├── FeatureCard.jsx
│       │   ├── DashboardCard.jsx
│       │   └── SettingsPanel.jsx
│       └── pages/
│           ├── LandingPage.jsx
│           ├── AssistantPage.jsx
│           ├── PipelinePage.jsx
│           ├── HistoryPage.jsx
│           └── SettingsPage.jsx
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Local Development

### Prerequisites

- Node.js 20+
- Python 3.11+
- ffmpeg (required by Whisper)

### 1. Clone the repo

```bash
git clone https://github.com/youruser/voicenexa.git
cd voicenexa
```

### 2. Backend setup

```bash
cd backend

# Install ffmpeg (macOS)
brew install ffmpeg
# Ubuntu/Debian
sudo apt-get install ffmpeg libsndfile1

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and fill in environment variables
cp ../.env.example .env
# Edit .env with your API keys

# Start the backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: http://localhost:8000  
API docs: http://localhost:8000/docs

### 3. Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Create frontend env (optional — proxies to localhost:8000 by default)
echo "VITE_API_URL=http://localhost:8000" > .env.local
echo "VITE_WS_URL=ws://localhost:8000" >> .env.local

# Start dev server
npm run dev
```

Frontend runs at: http://localhost:3000

---

## 🐳 Docker Deployment

### 1. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your real API keys
```

### 2. Build and run

```bash
docker compose up --build
```

- Frontend: http://localhost (port 80)
- Backend: http://localhost:8000
- API docs: http://localhost:8000/docs

### 3. Stop

```bash
docker compose down
```

---

## ☁️ AWS EC2 Deployment

### Step 1 — Launch EC2 instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose **Ubuntu Server 24.04 LTS**
3. Instance type: **t3.medium** (2 vCPU, 4GB RAM — minimum for Whisper)
4. Storage: **20GB** gp3
5. Create or select a key pair

### Step 2 — Configure Security Group

Add these inbound rules:

| Type  | Port | Source    |
|-------|------|-----------|
| SSH   | 22   | Your IP   |
| HTTP  | 80   | 0.0.0.0/0 |
| HTTPS | 443  | 0.0.0.0/0 |
| Custom TCP | 8000 | 0.0.0.0/0 (optional, for direct API access) |

### Step 3 — Connect and install Docker

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose
sudo apt-get install -y docker-compose-plugin

# Verify
docker --version
docker compose version
```

### Step 4 — Deploy Voicenexa

```bash
# Clone the repo
git clone https://github.com/youruser/voicenexa.git
cd voicenexa

# Set up environment variables
cp .env.example .env
nano .env  # Add your real API keys

# Build and launch
docker compose up -d --build

# Check logs
docker compose logs -f
```

### Step 5 — Optional: Nginx Reverse Proxy with SSL

For a custom domain with HTTPS:

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/voicenexa
```

Paste this config (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
    }

    location /ws/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/voicenexa /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Enable SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔌 API Reference

### REST Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/sessions` | Create new session |
| GET | `/api/sessions` | List all sessions |
| GET | `/api/sessions/{id}` | Get session messages |
| DELETE | `/api/sessions/{id}` | Clear session |
| POST | `/api/transcribe` | Transcribe audio file |
| POST | `/api/chat` | Text chat with Claude |
| POST | `/api/tts` | Text-to-speech synthesis |
| GET | `/api/voices` | List ElevenLabs voices |

### WebSocket

**Endpoint:** `ws://host/ws/voice/{session_id}`

**Client → Server (binary):** Raw audio bytes (WebM format)

**Client → Server (JSON):**
```json
{ "type": "ping" }
```

**Server → Client (JSON):**
```json
// Status update
{ "type": "status", "state": "listening|thinking|speaking|idle" }

// Transcription result
{ "type": "transcript", "text": "...", "wake_word": true|false }

// AI response text
{ "type": "response", "text": "..." }

// Audio response
{ "type": "audio", "audio_base64": "...", "format": "mp3" }

// Error
{ "type": "error", "message": "..." }

// Keepalive
{ "type": "pong" }
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ | Anthropic API key — [console.anthropic.com](https://console.anthropic.com) |
| `ELEVENLABS_API_KEY` | ✅ | ElevenLabs API key — [elevenlabs.io](https://elevenlabs.io) |
| `ELEVENLABS_VOICE_ID` | ✅ | Voice ID from ElevenLabs dashboard |
| `WHISPER_MODEL` | ⬜ | Model size: `tiny`, `base`, `small`, `medium`, `large` (default: `base`) |
| `FRONTEND_URL` | ⬜ | CORS allowed origin (default: `http://localhost:3000`) |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| 3D Graphics | React Three Fiber, Three.js, @react-three/drei |
| Animations | Framer Motion |
| Backend | Python, FastAPI, Uvicorn |
| Real-Time | WebSockets |
| STT | OpenAI Whisper |
| LLM | Anthropic Claude (claude-sonnet-4-20250514) |
| TTS | ElevenLabs |
| Deployment | Docker, Docker Compose, AWS EC2, Nginx |

---

## 🛠️ Customization

### Change the Whisper model

Edit `.env`:
```
WHISPER_MODEL=small   # Better accuracy, slower
WHISPER_MODEL=medium  # Even better, needs ~5GB RAM
```

### Add a custom wake word

Edit `backend/services/stt_service.py`:
```python
wake_word_variants = ["hey nexa", "hello nexa", "ok nexa"]
```

### Change the AI persona

Edit `backend/services/llm_service.py` — update the `SYSTEM_PROMPT` constant.

---

## 🐛 Troubleshooting

**Microphone not working?**
- Check browser permissions (camera icon in address bar)
- Must be served over HTTPS in production (or localhost for dev)

**Whisper model download slow?**
- First run downloads the model weights (~150MB for `base`)
- Docker volume `whisper_cache` persists this between restarts

**Backend connection refused?**
- Make sure `uvicorn` or `docker compose up` is running
- Check CORS: `FRONTEND_URL` must match your frontend origin exactly

**ElevenLabs voice quality low?**
- Try `eleven_multilingual_v2` model in `tts_service.py`
- Increase `stability` and `similarity_boost` in voice settings

---

## 📄 License

MIT License — free to use, modify, and deploy.

---

*Built with ❤️ using Whisper · Claude · ElevenLabs · FastAPI · React*
