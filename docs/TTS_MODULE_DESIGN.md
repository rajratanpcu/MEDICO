# Text-to-Speech (TTS) Module Design
> **Component**: AI Voice Assistant  
> **Module**: TTS Service (Speaking)  
> **Author**: Antigravity (Voice Synthesis Engineer)

## 1. Technology Choice

### Recommendation: `edge-tts` (Python Library)
This library uses Microsoft Edge's online text-to-speech service.

#### Justification:
1.  **Quality**: It uses Microsoft's **Neural** voices, which are barely distinguishable from human speech. Far superior to robotic `pyttsx3` or standard `gTTS`.
2.  **Cost**: Free. No API key required (uses the browser API endpoint).
3.  **Performance**: Very fast generation.
4.  **Tone**: "Neural" voices have excellent prosody (rhythm/intonation) for reading medical summaries calmly.

*Alternative*: If strictly offline is required, we use `pyttsx3` or `Coqui TTS` (Heavy). For this project, `edge-tts` is the "Best in Class" for zero cost.

---

## 2. API Design

The Frontend expects an audio file to play. We stream it to reduce latency.

### Endpoint
**File**: `ai-service/app/routers/voice.py`

```python
from fastapi import APIRouter
from fastapi.responses import FileResponse, StreamingResponse
import edge_tts
import tempfile

router = APIRouter()

@router.post("/speak")
async def generate_speech(text: str, voice: str = "en-US-AriaNeural"):
    """
    Converts text to speech using Microsoft Neural voices.
    Returns: Audio stream (mp3)
    """
    communicate = edge_tts.Communicate(text, voice)
    
    # Create a temporary file to store the audio
    # (In production we might stream bytes directly, but tempfile is safer for MVP)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
        await communicate.save(fp.name)
        return FileResponse(fp.name, media_type="audio/mpeg", filename="response.mp3")
```

---

## 3. Voice Style Guidelines (Medical Context)

A medical assistant must sound **Competent, Calm, and Empathetic**.

### Recommended Voice: `en-US-AriaNeural`
*   **Attributes**: Clear, professional, slightly warm.
*   **Pitch/Rate**:
    *   **Rate**: `-5%` (Slightly slower than normal to ensure clarity of medical terms).
    *   **Pitch**: `Default`.

### Style Rules for Text Generation
Before sending text to TTS, the LLM should format it:
1.  **No Markdown**: Strip `**`, `##` before sending to TTS.
2.  **Numbers**: Convert "BP is 120/80" to "Blood pressure is one twenty over eighty".
3.  **Abbreviations**: Expand "mg" to "milligrams", "Dr." to "Doctor".

---

## 4. Error Handling

| Issue | Strategy |
| :--- | :--- |
| **Network Failure** | `edge-tts` needs internet. **Fallback**: If it fails, use `pyttsx3` (offline robotic voice) so the system isn't mute. |
| **Long Text** | If text > 500 chars, split into sentences. Generate audio for the first sentence immediately (low latency) and queue the rest. |
| **Invalid Char** | Sanitize input. Remove emojis (TTS often tries to read "Smiling Face with..." which disrupts flow). |

---

## 5. Accessibility Considerations

1.  **Visual Subtitles**: ALWAYS display the text on screen while speaking.
2.  **Playback Controls**: Frontend must have Stop/Replay buttons.
3.  **Volume Normalization**: Ensure the TTS output loudness matches the system alerts.

---

## 6. Frontend Integration (React)

```javascript
const playAudioResponse = async (text) => {
  const response = await fetch(`${API_URL}/ai/speak`, {
    method: 'POST',
    body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' }
  });
  
  const blob = await response.blob();
  const audio = new Audio(URL.createObjectURL(blob));
  audio.play();
  
  // Show wave animation
  setIsSpeaking(true);
  audio.onended = () => setIsSpeaking(false);
};
```
