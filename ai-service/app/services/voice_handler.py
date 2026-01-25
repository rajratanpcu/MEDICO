import os
from faster_whisper import WhisperModel
import edge_tts
import asyncio
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model instance
model = None

def get_stt_model():
    """Lazy load the Whisper model"""
    global model
    if model is None:
        logger.info("Loading Whisper STT model (tiny.en)...")
        # Run on CPU with INT8 for efficiency
        model = WhisperModel("tiny.en", device="cpu", compute_type="int8")
        logger.info("Whisper model loaded.")
    return model

def transcribe_audio(file_path: str) -> str:
    """
    Transcribe audio file to text using Whisper.
    """
    try:
        model = get_stt_model()
        segments, info = model.transcribe(file_path, beam_size=5)
        text = " ".join([segment.text for segment in segments])
        return text.strip()
    except Exception as e:
        logger.error(f"STT Error: {e}")
        return ""

async def generate_speech_file(text: str, output_path: str, voice: str = "en-US-AriaNeural"):
    """
    Generate TTS audio file using Edge TTS.
    """
    try:
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)
    except Exception as e:
        logger.error(f"TTS Error: {e}")
        raise e
