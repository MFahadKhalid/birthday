// ===== STATE MANAGEMENT =====
let currentPage = "welcome";
let musicPlaying = false;
let bgMusicElement = null;
let heartsInterval;
let petalsInterval;
let currentImageIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let eventListeners = [];

// Use config from config.js (fallback if not loaded)
const cuteMessages = typeof CONFIG !== 'undefined' ? CONFIG.cuteMessages : [];
const constellationWishes = typeof CONFIG !== 'undefined' ? CONFIG.constellationWishes : [];
const photos = typeof CONFIG !== 'undefined' ? CONFIG.photos : [];

// ===== UTILITY FUNCTIONS =====

// Error Handler
function handleError(error, context = 'Unknown') {
  console.error(`Error in ${context}:`, error);
  // Could add user notification here if needed
}

// Safe Element Query
function safeQuery(selector) {
  try {
    return document.querySelector(selector) || document.getElementById(selector);
  } catch (error) {
    handleError(error, `safeQuery(${selector})`);
    return null;
  }
}

// Add Event Listener with Tracking (for cleanup)
function addTrackedListener(element, event, handler, options) {
  if (!element) return;
  element.addEventListener(event, handler, options);
  eventListeners.push({ element, event, handler, options });
}

// Cleanup All Event Listeners
function cleanupEventListeners() {
  eventListeners.forEach(({ element, event, handler, options }) => {
    if (element) {
      element.removeEventListener(event, handler, options);
    }
  });
  eventListeners = [];
}

// Debounce Function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check for Reduced Motion Preference
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Lazy Load Images
function lazyLoadImage(img) {
  if (!img.dataset.src) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        image.src = image.dataset.src;
        image.classList.add('loaded');
        observer.unobserve(image);
      }
    });
  });

  observer.observe(img);
}

// ===== LIGHTBOX FUNCTIONS =====
function openLightbox(index) {
  try {
    currentImageIndex = index;
    const lightbox = safeQuery("lightbox");
    const lightboxImage = safeQuery("lightbox-image");
    const lightboxCaption = safeQuery("lightbox-caption");
    const lightboxCounter = safeQuery("lightbox-counter");

    if (!lightbox || !lightboxImage || !photos[index]) return;

    // Add loading state
    lightboxImage.classList.add('loading');

    const img = new Image();
    img.onload = () => {
      lightboxImage.src = photos[index].src;
      lightboxImage.alt = photos[index].alt;
      lightboxImage.classList.remove('loading');

      if (lightboxCaption) {
        lightboxCaption.textContent = photos[index].caption;
      }
      if (lightboxCounter) {
        lightboxCounter.textContent = `${index + 1} / ${photos.length}`;
      }

      lightbox.classList.add("show");
      addSparkles();
      document.body.style.overflow = "hidden";
    };

    img.onerror = () => {
      handleError(new Error('Failed to load image'), 'openLightbox');
      lightboxImage.classList.remove('loading');
      // Show placeholder or error message
      lightboxImage.alt = "Image failed to load";
    };

    img.src = photos[index].src;
  } catch (error) {
    handleError(error, 'openLightbox');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("show");

  document.body.style.overflow = "auto";
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % photos.length;
  updateLightboxImage();
}

function previousImage() {
  currentImageIndex = (currentImageIndex - 1 + photos.length) % photos.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCounter = document.getElementById("lightbox-counter");

  lightboxImage.src = photos[currentImageIndex].src;
  lightboxImage.alt = photos[currentImageIndex].alt;
  lightboxCaption.textContent = photos[currentImageIndex].caption;
  lightboxCounter.textContent = `${currentImageIndex + 1} / ${photos.length}`;

  lightboxImage.style.opacity = "0";
  setTimeout(() => {
    lightboxImage.style.opacity = "1";
  }, 150);
}

function initAnimations() {
  createFloatingHearts();
  createCherryBlossoms();
  createStars();
  initGlitterTrail();
  initLightboxKeyboard();
}

function initLightboxKeyboard() {
  document.addEventListener("keydown", function (e) {
    const lightbox = document.getElementById("lightbox");
    if (lightbox.classList.contains("show")) {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        previousImage();
      }
    }
  });

  document.getElementById("lightbox").addEventListener("click", function (e) {
    if (e.target === this) {
      closeLightbox();
    }
  });
}

function initGlitterTrail() {
  document.addEventListener("mousemove", function (e) {
    if (Math.random() > 0.8) {
      const glitter = document.createElement("div");
      glitter.className = "glitter";
      glitter.innerHTML = ["✨", "⭐", "🌟", "💫"][
        Math.floor(Math.random() * 4)
      ];
      glitter.style.left = e.pageX + "px";
      glitter.style.top = e.pageY + "px";
      document.body.appendChild(glitter);

      setTimeout(() => {
        if (document.body.contains(glitter)) {
          document.body.removeChild(glitter);
        }
      }, 1000);
    }
  });
}

function createFloatingHearts() {
  const heartsContainer = document.getElementById("floatingHearts");

  heartsInterval = setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = ["💕", "💖", "💗", "💝", "💓"][
      Math.floor(Math.random() * 5)
    ];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = Math.random() * 3 + 12 + "s";
    heart.style.animationDelay = Math.random() * 2 + "s";
    heartsContainer.appendChild(heart);

    setTimeout(() => {
      if (heartsContainer.contains(heart)) {
        heartsContainer.removeChild(heart);
      }
    }, 15000);
  }, 3000);
}

function createCherryBlossoms() {
  const petalsContainer = document.getElementById("petalsContainer");

  petalsInterval = setInterval(() => {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.innerHTML = ["🌸", "🌺", "🌼", "🌻"][Math.floor(Math.random() * 4)];
    petal.style.left = Math.random() * 100 + "%";
    petal.style.animationDuration = Math.random() * 3 + 10 + "s";
    petal.style.animationDelay = Math.random() * 2 + "s";
    petalsContainer.appendChild(petal);

    setTimeout(() => {
      if (petalsContainer.contains(petal)) {
        petalsContainer.removeChild(petal);
      }
    }, 12000);
  }, 2000);
}

function createStars() {
  const starsContainer = document.getElementById("starsContainer");

  for (let i = 0; i < 20; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.innerHTML = "⭐";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 2 + "s";
    star.onclick = () => showConstellationWish((i % 5) + 1);
    starsContainer.appendChild(star);
  }
}

function showConstellationWish(wishNumber) {
  for (let i = 1; i <= 5; i++) {
    document.getElementById("wish" + i).style.display = "none";
  }

  const wishElement = document.getElementById("wish" + wishNumber);
  wishElement.style.display = "block";

  addSparkles();

  setTimeout(() => {
    wishElement.style.display = "none";
  }, 5000);
}

function handleVideoUpload(input, videoId) {
  const file = input.files[0];
  if (file) {
    const videoElement = document.getElementById(videoId);
    const url = URL.createObjectURL(file);
    videoElement.src = url;
    videoElement.style.display = "block";

    input.parentElement.style.display = "none";

    addSparkles();
  }
}

function handlePhotoUpload(input, photoId) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const photoContainer = document.getElementById(photoId);
      photoContainer.innerHTML = `<img src="${e.target.result}" class="uploaded-photo" alt="Uploaded photo">`;

      addSparkles();
    };
    reader.readAsDataURL(file);
  }
}

function openGift(giftBox, giftNumber) {
  const giftIcon = giftBox.querySelector(".gift-icon");
  const giftTitle = giftBox.querySelector(".gift-title");
  const giftMessage = giftBox.querySelector(".gift-message");

  giftIcon.style.transform = "scale(1.5) rotate(360deg)";
  giftTitle.style.display = "none";

  setTimeout(() => {
    giftMessage.style.display = "block";
    giftIcon.innerHTML = "🎉";
    addSparkles();
  }, 500);

  setTimeout(() => {
    giftIcon.style.transform = "scale(1) rotate(0deg)";
    giftIcon.innerHTML = ["🎁", "💝", "🌟", "🎈", "🌸", "💫"][giftNumber - 1];
    giftTitle.style.display = "block";
    giftMessage.style.display = "none";
  }, 5000);
}

function animateReason(reasonCard) {
  reasonCard.style.transform = "scale(1.1) rotate(2deg)";
  reasonCard.style.boxShadow = "0 25px 50px rgba(0,0,0,0.3)";

  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.innerHTML = "💕";
      heart.style.position = "absolute";
      heart.style.left = Math.random() * 100 + "%";
      heart.style.top = Math.random() * 100 + "%";
      heart.style.fontSize = "1.5rem";
      heart.style.zIndex = "10";
      heart.style.pointerEvents = "none";
      heart.style.animation = "sparkle 2s ease-out forwards";

      document.body.appendChild(heart);

      setTimeout(() => {
        if (document.body.contains(heart)) {
          document.body.removeChild(heart);
        }
      }, 2000);
    }, i * 100);
  }

  setTimeout(() => {
    reasonCard.style.transform = "translateY(-10px) scale(1.02)";
    reasonCard.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
  }, 1000);
}

function blowCandles() {
  const candles = document.getElementById("candles");
  const cakeMessage = document.getElementById("cakeMessage");

  candles.style.opacity = "0";
  candles.style.transform = "scale(0.5)";

  setTimeout(() => {
    candles.innerHTML = "💨💨💨💨💨";
    candles.style.opacity = "1";
    candles.style.transform = "scale(1)";
    cakeMessage.innerHTML =
      "🌟 Your wish has been sent to the universe! May all your dreams come true! ✨";
    cakeMessage.style.fontSize = "1.8rem";
    cakeMessage.style.color = "#ffd700";

    launchFireworks();
    addSparkles();
  }, 1000);

  setTimeout(() => {
    candles.innerHTML = "🕯️🕯️🕯️🕯️🕯️";
    candles.style.opacity = "1";
    candles.style.transform = "scale(1)";
    cakeMessage.innerHTML =
      "Click the cake to blow out the candles and make a wish! ✨";
    cakeMessage.style.fontSize = "1.5rem";
    cakeMessage.style.color = "white";
  }, 8000);
}

function showHearts() {
  const hearts = ["💕", "💖", "💗", "💝", "💓", "🥰", "😍", "💘"];

  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.position = "fixed";
      heart.style.left = Math.random() * 100 + "%";
      heart.style.top = Math.random() * 100 + "%";
      heart.style.fontSize = "2rem";
      heart.style.zIndex = "10";
      heart.style.pointerEvents = "none";
      heart.style.animation = "sparkle 3s ease-out forwards";

      document.body.appendChild(heart);

      setTimeout(() => {
        if (document.body.contains(heart)) {
          document.body.removeChild(heart);
        }
      }, 3000);
    }, i * 100);
  }
}

function showPetals() {
  const petals = ["🌸", "🌺", "🌼", "🌻", "🌷", "🌹"];

  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      const petal = document.createElement("div");
      petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];
      petal.style.position = "fixed";
      petal.style.left = Math.random() * 100 + "%";
      petal.style.top = "-50px";
      petal.style.fontSize = "1.8rem";
      petal.style.zIndex = "10";
      petal.style.pointerEvents = "none";
      petal.style.animation = "fallPetal 4s linear forwards";

      document.body.appendChild(petal);

      setTimeout(() => {
        if (document.body.contains(petal)) {
          document.body.removeChild(petal);
        }
      }, 4000);
    }, i * 80);
  }
}

function popBalloon(balloon) {
  balloon.classList.add("balloon-popped");

  const randomMessage =
    cuteMessages[Math.floor(Math.random() * cuteMessages.length)];
  showBalloonMessage(randomMessage);

  setTimeout(() => {
    balloon.style.display = "none";
    setTimeout(() => {
      balloon.style.display = "block";
      balloon.classList.remove("balloon-popped");
    }, 5000);
  }, 500);
}

function showBalloonMessage(message) {
  const modal = document.getElementById("balloonMessageModal");
  const messageText = document.getElementById("balloonMessageText");

  messageText.textContent = message;
  modal.classList.add("show");

  addSparklesAroundModal();
}

function closeBalloonMessage() {
  const modal = document.getElementById("balloonMessageModal");
  modal.classList.remove("show");
}

function addSparklesAroundModal() {
  const sparkles = ["✨", "⭐", "💫", "🌟", "💖", "🌸"];

  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
      sparkle.style.position = "fixed";
      sparkle.style.left = 50 + (Math.random() - 0.5) * 60 + "%";
      sparkle.style.top = 50 + (Math.random() - 0.5) * 60 + "%";
      sparkle.style.fontSize = "1.5rem";
      sparkle.style.zIndex = "1002";
      sparkle.style.pointerEvents = "none";
      sparkle.style.animation = "sparkle 2s ease-out forwards";

      document.body.appendChild(sparkle);

      setTimeout(() => {
        if (document.body.contains(sparkle)) {
          document.body.removeChild(sparkle);
        }
      }, 2000);
    }, i * 100);
  }
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  event.target.classList.add("active");

  currentPage = pageId;

  if (pageId === "celebration") {
    setTimeout(() => {
      launchFireworks();
    }, 500);
  }
}

function toggleMusic() {
    const musicBtn = event.target;
    
    if (!musicPlaying) {
        if (!bgMusicElement.src || bgMusicElement.src === window.location.href) {
            bgMusicElement.src = 'assets/audio/Yiruma_ _____ _ River Flows in You.mp3';
        }
        
        bgMusicElement.play().then(() => {
            musicPlaying = true;
            musicBtn.textContent = '🎵 Music OFF';
            musicBtn.style.background = 'linear-gradient(45deg, #4ecdc4, #45b7d1)';
        }).catch(error => {
            console.log('Audio play failed:', error);
        });
    } else {
        bgMusicElement.pause();
        musicPlaying = false;
        musicBtn.textContent = '🎵 Music ON';
        musicBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
    }
}

function changeSong() {
  const fileInput = document.getElementById("musicFile");
  const file = fileInput.files[0];

  if (file) {
    const url = URL.createObjectURL(file);
    bgMusicElement.src = url;
    bgMusicElement.volume = 0.3;

    bgMusicElement
      .play()
      .then(() => {
        musicPlaying = true;
        const musicBtn = document.querySelector(".music-controls .music-btn");
        musicBtn.textContent = "🎵 Music OFF";
        musicBtn.style.background = "linear-gradient(45deg, #4ecdc4, #45b7d1)";
      })
      .catch((error) => {
        console.log("Audio play failed:", error);
      });
  }
}

function changeVolume() {
  const volumeSlider = document.getElementById("volumeSlider");
  bgMusicElement.volume = volumeSlider.value / 100;
}

function launchFireworks() {
  const container = document.getElementById("fireworksContainer");
  const colors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#f9ca24",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
  ];

  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const firework = document.createElement("div");
      firework.style.position = "absolute";
      firework.style.width = "4px";
      firework.style.height = "4px";
      firework.style.borderRadius = "50%";
      firework.style.left = Math.random() * 100 + "%";
      firework.style.top = Math.random() * 100 + "%";
      firework.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      firework.style.boxShadow = `0 0 20px ${firework.style.backgroundColor}`;
      firework.style.animation = "explode 2s ease-out forwards";

      container.appendChild(firework);

      setTimeout(() => {
        if (container.contains(firework)) {
          container.removeChild(firework);
        }
      }, 2000);
    }, i * 100);
  }
}

function addSparkles() {
  const sparkles = ["✨", "⭐", "💫", "🌟"];

  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
      sparkle.style.position = "fixed";
      sparkle.style.left = Math.random() * 100 + "%";
      sparkle.style.top = Math.random() * 100 + "%";
      sparkle.style.fontSize = "2rem";
      sparkle.style.zIndex = "10";
      sparkle.style.pointerEvents = "none";
      sparkle.style.animation = "sparkle 2s ease-out forwards";

      document.body.appendChild(sparkle);

      setTimeout(() => {
        if (document.body.contains(sparkle)) {
          document.body.removeChild(sparkle);
        }
      }, 2000);
    }, i * 80);
  }
}

function celebrateAll() {
  launchFireworks();
  setTimeout(() => addSparkles(), 500);
  setTimeout(() => showHearts(), 1000);
  setTimeout(() => showPetals(), 1500);
  setTimeout(() => launchFireworks(), 2000);
  setTimeout(() => addSparkles(), 3000);
}

window.addEventListener("load", function () {
  initAnimations();
bgMusicElement.src = 'assets/audio/Yiruma_ _____ _ River Flows in You.mp3';
  bgMusicElement.volume = 0.3;

  setInterval(() => {
    if (currentPage === "celebration") {
      launchFireworks();
    }
  }, 8000);
});

function playSound(type) {
  console.log("Playing sound:", type);
}
