document.addEventListener("DOMContentLoaded", function () {
  const toggleImage = document.querySelector(".img1");
  const audio = document.getElementById("audio");

  if (!toggleImage || !audio) {
    return;
  }

  // Restore audio playback state from localStorage
  const savedTime = localStorage.getItem("audioTime");
  const wasPlaying = localStorage.getItem("audioPlaying") === "true";
  
  if (savedTime !== null) {
    audio.currentTime = parseFloat(savedTime);
  }
  
  if (wasPlaying) {
    audio.play().catch(err => console.log("Autoplay prevented:", err));
  }

  toggleImage.addEventListener("click", async function () {
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error("Audio toggle failed:", error);
    }
  });

  // Save audio state before leaving the page
  window.addEventListener("beforeunload", function () {
    localStorage.setItem("audioTime", audio.currentTime);
    localStorage.setItem("audioPlaying", !audio.paused);
  });
});