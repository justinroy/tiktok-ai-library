#!/usr/bin/env python3
"""
ai_categorize_transcripts.py
Reads transcript JSONs from a GCS bucket, summarizes & tags with GPT, and writes categorized_videos.json back to the bucket.
"""
import json
import os
from typing import List, Dict, Any
from google.cloud import storage
from openai import OpenAI

# ----------- EDIT THESE IF NEEDED -----------
GCP_PROJECT_ID = os.getenv("GCP_PROJECT_ID", "tiktoks-475100")
BUCKET_NAME = os.getenv("BUCKET_NAME", "toktiks")
TRANSCRIPTS_PREFIX = os.getenv("TRANSCRIPTS_PREFIX", "")   # e.g., "transcripts/"
OUTPUT_FILE = os.getenv("OUTPUT_FILE", "categorized_videos.json")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
# --------------------------------------------

def extract_transcript(data: Dict[str, Any]) -> str:
    texts: List[str] = []
    for result in data.get("annotation_results", []):
        for transcription in result.get("speech_transcriptions", []):
            for alt in transcription.get("alternatives", []):
                t = (alt.get("transcript") or "").strip()
                if t:
                    texts.append(t)
    return " ".join(texts).strip()

def categorize_text(client: OpenAI, text: str) -> Dict[str, Any]:
    if not text:
        return {"summary": "No transcript text found.", "tags": []}
    prompt = f"""
Analyze this TikTok transcript.
1) Provide a short 1–2 sentence summary (plain English).
2) Suggest 3–5 descriptive, lowercase tags (single words or short phrases).
Return valid JSON with keys "summary" and "tags".
Transcript:
{text}
"""
    resp = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )
    content = resp.choices[0].message.content.strip()
    try:
        parsed = json.loads(content)
        summary = str(parsed.get("summary", "")).strip()
        tags = parsed.get("tags", [])
        if not isinstance(tags, list):
            tags = []
        tags = [str(t).strip().lower() for t in tags if str(t).strip()]
        return {"summary": summary, "tags": tags[:8]}
    except Exception:
        return {"summary": content[:280], "tags": []}

def main():
    storage_client = storage.Client(project=GCP_PROJECT_ID)
    bucket = storage_client.bucket(BUCKET_NAME)
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("Missing OPENAI_API_KEY environment variable.")
    oa_client = OpenAI()
    results: List[Dict[str, Any]] = []
    print(f"Listing JSON files in gs://{BUCKET_NAME}/{TRANSCRIPTS_PREFIX or ''} ...")
    blobs = bucket.list_blobs(prefix=TRANSCRIPTS_PREFIX or "")
    count = 0
    for blob in blobs:
        name = blob.name
        if not name.lower().endswith(".json"):
            continue
        if name.endswith(os.path.basename(OUTPUT_FILE)):
            continue
        try:
            count += 1
            print(f"[{count}] Processing: {name}")
            data = json.loads(blob.download_as_text())
            transcript_text = extract_transcript(data)
            video_uri = data.get("annotation_results", [{}])[0].get("input_uri", name)
            cat = categorize_text(oa_client, transcript_text)
            results.append({
                "source_json_path": name,
                "video_uri": video_uri,
                "summary": cat.get("summary", ""),
                "tags": cat.get("tags", []),
                "char_count": len(transcript_text),
            })
        except Exception as e:
            print(f"!! Skipping {name} due to error: {e}")
    out_blob = bucket.blob(OUTPUT_FILE)
    out_blob.upload_from_string(json.dumps(results, indent=2))
    print(f"\n✅ Wrote {len(results)} items to gs://{BUCKET_NAME}/{OUTPUT_FILE}")

if __name__ == "__main__":
    main()
