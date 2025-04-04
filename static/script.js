document.getElementById("reset-btn").addEventListener("click", function () {
    document.getElementById("search-input").value = ""; // Clear input box
  
    let videoContainer = document.querySelector(".video-container");
    if (videoContainer) {
      videoContainer.innerHTML = ""; // Clear search results only
    }
  
    // DO NOT clear saved videos here! 🔥
  });
  
// Save video to localStorage
function attachSaveButtons() {
    const saveButtons = document.querySelectorAll(".save-btn");
    saveButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const video = {
          title: btn.dataset.title,
          url: btn.dataset.url,
          thumbnail: btn.dataset.thumbnail,
          channel: btn.dataset.channel,
        };
  
        // Get existing saved videos or initialize empty array
        const saved = JSON.parse(localStorage.getItem("savedVideos")) || [];
  
        // Avoid duplicate saves
        if (!saved.find((v) => v.url === video.url)) {
          saved.push(video);
          localStorage.setItem("savedVideos", JSON.stringify(saved));
          renderSavedVideos(); // Refresh UI
        }
      });
    });
  }
  
  // Display saved videos in a dedicated section
  function renderSavedVideos() {
    let savedSection = document.querySelector(".saved-videos");
  
    if (!savedSection) {
      savedSection = document.createElement("div");
      savedSection.className = "saved-videos";
      savedSection.innerHTML = "<h3>⭐ Saved Videos</h3><div class='video-slider' id='saved-container'></div>";
      document.body.appendChild(savedSection);
    }
  
    const savedContainer = savedSection.querySelector("#saved-container");
    savedContainer.innerHTML = "";
  
    const saved = JSON.parse(localStorage.getItem("savedVideos")) || [];
  
    saved.forEach((video) => {
      const card = document.createElement("div");
      card.className = "video-card";
      card.innerHTML = `
        <button class="delete-btn" data-url="${video.url}">✖</button>
        <img src="${video.thumbnail}" alt="Thumbnail" onerror="this.src='/static/defaultlogo.jpg'">
        <h4>${video.title}</h4>
        <hr />
        <p class="channel-name">${video.channel}</p>
        <a href="${video.url}" target="_blank">Watch</a>
      `;
  
      // Delete button functionality
      card.querySelector(".delete-btn").addEventListener("click", () => {
        const updated = saved.filter((v) => v.url !== video.url);
        localStorage.setItem("savedVideos", JSON.stringify(updated));
        renderSavedVideos(); // Refresh UI after deletion
      });
  
      savedContainer.appendChild(card);
    });
}
  
