document.getElementById("reset-btn").addEventListener("click", function() {
    document.getElementById("search-input").value = ""; // Clear input box
    
    let videoContainer = document.querySelector(".video-container");
    if (videoContainer) {
        videoContainer.innerHTML = ""; // Clear results safely
    }
});

fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: searchTerm })
})
.then(res => res.json())
.then(data => setVideos(data));
