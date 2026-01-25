FROM python:3.10-slim-bookworm
WORKDIR /app
# Disable bytecode, ensure unbuffered output, and turn off pip hash enforcement if present
ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1 \
	PIP_REQUIRE_HASHES=0

# Install system dependencies for building Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
	build-essential \
	gcc \
	pkg-config \
	libavformat-dev libavcodec-dev libavdevice-dev libavutil-dev libswscale-dev libswresample-dev libavfilter-dev \
	&& rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir --progress-bar off --timeout 120 --retries 5 -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
