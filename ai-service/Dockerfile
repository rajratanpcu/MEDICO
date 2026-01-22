FROM python:3.11-slim
WORKDIR /app
# Disable bytecode, ensure unbuffered output, and turn off pip hash enforcement if present
ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1 \
	PIP_REQUIRE_HASHES=0
COPY requirements.txt .
RUN pip install --no-cache-dir --progress-bar off --timeout 120 --retries 5 -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
