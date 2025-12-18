from gtts import gTTS
import os
import textwrap
from pydub import AudioSegment
from pydub.utils import which

# ✅ Tell pydub where ffmpeg is (if not already in PATH)
AudioSegment.converter = which("ffmpeg")

class TTSClient:
    def text_to_speech(self, text: str, output_path: str, lang: str = "en"):
        """
        Convert text to real speech and save as MP3.
        Handles long text by splitting into chunks.
        """
        try:
            safe_text = (text or "").strip()
            if not safe_text:
                safe_text = "This is a placeholder audio. The text content was empty."

            # ✅ Ensure output directory exists (if provided)
            out_dir = os.path.dirname(output_path)
            if out_dir:
                os.makedirs(out_dir, exist_ok=True)

            print(f"--- TTS Call ---")
            print(f"Generating audio for: '{safe_text[:60]}...'")
            print(f"Saving to: {output_path}")

            # ✅ gTTS max length ~5000 chars → split into 4000
            chunks = textwrap.wrap(safe_text, 4000)

            if len(chunks) == 1:
                # Single chunk → direct save
                tts = gTTS(text=safe_text, lang=lang)
                tts.save(output_path)
            else:
                # Multiple chunks → merge with pydub
                combined = AudioSegment.empty()
                for i, chunk in enumerate(chunks, start=1):
                    temp_file = f"{output_path}.part{i}.mp3"
                    tts = gTTS(text=chunk, lang=lang)
                    tts.save(temp_file)
                    combined += AudioSegment.from_file(temp_file, format="mp3")
                    os.remove(temp_file)

                # ✅ Export final mp3 properly
                combined.export(output_path, format="mp3")

        except Exception as e:
            raise Exception(f"TTS generation failed: {str(e)}")

tts_client = TTSClient()
