from flask import Flask, render_template, request
from googleapiclient.discovery import build

app = Flask(__name__)

# Your YouTube API Key
API_KEY = "AIzaSyDHMsuCdvsFNoe54tyETK8NGle712sh3lk"

def search_youtube(query, max_results=5):
    if not query.strip():
        return None  

    try:
        youtube = build("youtube", "v3", developerKey=API_KEY)
        
        request = youtube.search().list(
            part="snippet",
            q=query,
            maxResults=max_results + 3,
            type="video,playlist",
            safeSearch="strict",
            order="relevance"
        )
        response = request.execute()

        videos = []

        for item in response.get("items", []):
            kind = item["id"]["kind"]
            video_id = item["id"].get("videoId")
            playlist_id = item["id"].get("playlistId")
            title = item["snippet"]["title"]
            channel = item["snippet"]["channelTitle"]
            thumbnail = item["snippet"]["thumbnails"]["high"]["url"]

            if video_id:
                url = f"https://www.youtube.com/watch?v={video_id}"
                video_type = "video"
                thumbnail_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"
            elif playlist_id:
                url = f"https://www.youtube.com/playlist?list={playlist_id}"
                video_type = "playlist"
                thumbnail_url = thumbnail  # Use YouTube’s API thumbnail for playlists
            else:
                continue

            videos.append({
                "title": title, 
                "url": url, 
                "channel": channel, 
                "video_id": video_id if video_id else playlist_id,
                "type": video_type,
                "thumbnail": thumbnail_url
            })  

            if len(videos) >= max_results:
                break

        return videos if videos else None  
    except Exception as e:
        print("Error:", e)
        return None  
 
 


@app.route("/", methods=["GET", "POST"])
def index():
    videos = []
    error_message = None 

    if request.method == "POST":
        query = request.form.get("query")
        videos = search_youtube(query)
        if videos is None:
            error_message = "❌ No results found. Try again with a different search!"

    return render_template("index.html", videos=videos, error_message=error_message)

@app.route("/api/search", methods=["POST"])
def api_search():
    query = request.json.get("query")
    videos = search_youtube(query)
    return jsonify(videos)

if __name__ == "__main__":
    app.run(debug=True)
