document.addEventListener("DOMContentLoaded", function () {
  const toggleImage = document.querySelector(".img1");
  const audio = document.getElementById("audio");

  if (!toggleImage || !audio) {
    return;
  }

  const savedTime = localStorage.getItem("audioTime");
  const wasPlaying = localStorage.getItem("audioPlaying") === "true";
  
  if (savedTime !== null && !isNaN(parseFloat(savedTime))) {
    try {
      audio.currentTime = parseFloat(savedTime);
    } catch (e) {
      console.log('Failed to set audio.currentTime:', e);
    }
  }

  function tryPlay() {
    return audio.play().catch(err => {
      console.log("Autoplay failed:", err);
      throw err;
    });
  }

  if (wasPlaying) {
    tryPlay().catch(() => {
      function onFirstGesture() {
        audio.play().catch(err => console.log("Play after gesture failed:", err));
        window.removeEventListener('touchstart', onFirstGesture, {passive: true});
        window.removeEventListener('click', onFirstGesture);
      }

      window.addEventListener('touchstart', onFirstGesture, {passive: true});
      window.addEventListener('click', onFirstGesture);
    });
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

  function saveState() {
    try {
      localStorage.setItem("audioTime", audio.currentTime);
      localStorage.setItem("audioPlaying", !audio.paused);
    } catch (e) {
    }
  }

  const saveInterval = setInterval(saveState, 1000);

  window.addEventListener('pagehide', function () {
    saveState();
  });

  window.addEventListener('beforeunload', function () {
    saveState();
    clearInterval(saveInterval);
  });
});
