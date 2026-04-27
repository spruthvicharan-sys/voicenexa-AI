FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    ffmpeg libsndfile1 libsndfile1-dev gcc g++ curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip setuptools wheel

RUN pip install --no-cache-dir \
    torch==2.2.2 torchaudio==2.2.2 \
    --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir faster-whisper==1.0.3

RUN pip install --no-cache-dir \
    fastapi==0.111.0 \
    "uvicorn[standard]==0.30.1" \
    python-multipart==0.0.9 \
    websockets==12.0 \
    groq==0.9.0 \
    httpx==0.27.0 \
    soundfile==0.12.1 \
    "numpy>=1.21.0,<2.0.0" \
    requests==2.31.0 \
    python-dotenv==1.0.1 \
    pydantic==2.7.1

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]