import os, json

# --- LOAD GOOGLE CLOUD CREDENTIALS FROM STREAMLIT SECRETS ---
if creds_json := os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON"):
    creds_dict = json.loads(creds_json)
    with open("/tmp/streamlit-key.json", "w") as f:
        json.dump(creds_dict, f)
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/tmp/streamlit-key.json"

# --- SET GCP PROJECT ---
if project_id := os.getenv("GCP_PROJECT_ID"):
    os.environ["GOOGLE_CLOUD_PROJECT"] = project_id
import streamlit as st
import pandas as pd
import json
from google.cloud import storage
from datetime import timedelta
from collections import Counter
import math

# -------- CONFIG --------
BUCKET_NAME = "toktiks"
JSON_FILE = "categorized_videos.json"
SIGNED_URL_EXPIRATION = timedelta(hours=1)
PAGE_SIZE = 20  # number of videos per page
# ------------------------

st.set_page_config(page_title="TikTok AI Library", layout="wide")
st.title("🎬 TikTok AI Library")

@st.cache_data
def load_data_from_gcs(bucket_name, file_name):
    """Download categorized_videos.json from GCS and return a DataFrame"""
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(file_name)
    data = json.loads(blob.download_as_text())
    df = pd.DataFrame(data)
    df["tags"] = df["tags"].apply(lambda x: x if isinstance(x, list) else [])
    return df

@st.cache_data
def get_signed_url(bucket_name, blob_name, expiration=SIGNED_URL_EXPIRATION):
    """Generate a temporary URL for private video playback"""
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    return blob.generate_signed_url(expiration=expiration)

try:
    df = load_data_from_gcs(BUCKET_NAME, JSON_FILE)
except Exception as e:
    st.error(f"❌ Could not load data from GCS: {e}")
    st.stop()

# --- SIDEBAR: Filters ---
st.sidebar.header("Filters & Search")

# Search box
query = st.sidebar.text_input("Search summaries or tags")

# Tag filter
all_tags = sorted({t for tags in df["tags"] for t in tags})
selected_tags = st.sidebar.multiselect("Filter by tag", all_tags)

# Top tags stats
st.sidebar.markdown("---")
st.sidebar.subheader("📊 Top Tags")
tag_counts = Counter([t for tags in df["tags"] for t in tags])
for tag, count in tag_counts.most_common(10):
    st.sidebar.write(f"{tag}: {count}")

# --- Filter logic ---
filtered_df = df.copy()

if query:
    query_lower = query.lower()
    filtered_df = filtered_df[
        filtered_df["summary"].str.lower().str.contains(query_lower)
        | filtered_df["tags"].apply(lambda tags: any(query_lower in t for t in tags))
    ]

if selected_tags:
    filtered_df = filtered_df[
        filtered_df["tags"].apply(lambda tags: any(tag in tags for tag in selected_tags))
    ]

# --- Pagination setup ---
num_pages = max(1, math.ceil(len(filtered_df) / PAGE_SIZE))
page = st.sidebar.number_input("Page", min_value=1, max_value=num_pages, value=1)
start = (page - 1) * PAGE_SIZE
end = start + PAGE_SIZE
page_df = filtered_df.iloc[start:end]

st.write(f"Showing {len(filtered_df)} videos total | Page {page}/{num_pages}")

# --- Display videos ---
for _, row in page_df.iterrows():
    blob_name = row.get("video_uri", "").replace(f"/{BUCKET_NAME}/", "").lstrip("/")
    with st.container(border=True):
        st.markdown(f"**Summary:** {row['summary']}")
        st.markdown(f"**Tags:** {', '.join(row['tags'])}")
        if blob_name.lower().endswith((".mp4", ".mov")):
            try:
                signed_url = get_signed_url(BUCKET_NAME, blob_name)
                st.video(signed_url)
            except Exception as e:
                st.warning(f"Could not load video: {e}")
        else:
            st.text(f"Video file: {blob_name}")
