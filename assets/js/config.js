// Configuration file for Birthday Website
// All constants, messages, and settings are stored here

const CONFIG = {
  // Birthday Information
  birthday: {
    name: "Jaan-e-Jahan",
    date: "August 21st",
    year: new Date().getFullYear()
  },

  // Theme Settings
  theme: {
    defaultTheme: 'light',
    enableAnimations: true,
    animationIntensity: 'medium' // low, medium, high
  },

  // Audio Settings
  audio: {
    defaultVolume: 0.3,
    defaultSong: 'assets/audio/Yiruma_ _____ _ River Flows in You.mp3',
    autoPlay: false
  },

  // Animation Timings (in milliseconds)
  timings: {
    heartsInterval: 3000,
    petalsInterval: 2000,
    glitterLifetime: 1000,
    sparkleLifetime: 2000,
    fireworksInterval: 100,
    fireworkLifetime: 2000,
    giftMessageDuration: 5000,
    wishDisplayDuration: 5000,
    candleResetTime: 8000,
    celebrationFireworksInterval: 8000
  },

  // Color Schemes
  colors: {
    fireworks: [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#f9ca24",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd"
    ],
    hearts: ["💕", "💖", "💗", "💝", "💓"],
    petals: ["🌸", "🌺", "🌼", "🌻"],
    sparkles: ["✨", "⭐", "💫", "🌟"]
  },

  // Cute Messages for Balloons
  cuteMessages: [
    "🌟 You light up every room with your amazing smile! 🌟",
    "💖 Your kindness makes the world a better place! 💖",
    "🦋 You're as beautiful inside as you are outside! 🦋",
    "🌸 Your laughter is the most beautiful sound in the world! 🌸",
    "✨ You have a heart of pure gold! ✨",
    "🌺 Every day is brighter because you exist! 🌺",
    "💫 You're absolutely wonderful in every way! 💫",
    "🌈 Your friendship is a precious gift! 🌈",
    "🎀 You make ordinary moments feel magical! 🎀",
    "🌻 Your positive energy is contagious! 🌻",
    "💕 You deserve all the happiness in the world! 💕",
    "🌙 You're a shining star in everyone's life! 🌙",
    "🎈 Your spirit is absolutely beautiful! 🎈",
    "🌷 You bring joy wherever you go! 🌷",
    "💝 You're truly one of a kind and amazing! 💝",
    "🦄 You make dreams come true just by being you! 🦄",
    "🌟 You're perfectly imperfect and that's what makes you special! 🌟",
    "💐 Your soul is as beautiful as a blooming garden! 💐",
    "🎭 You have the most wonderful personality! 🎭",
    "🌊 Your calm presence brings peace to everyone! 🌊"
  ],

  // Constellation Wishes
  constellationWishes: [
    "May the stars align to bring you everything your heart desires this year!",
    "Like the brightest star in the sky, you illuminate everyone's life with your presence!",
    "Your dreams are written in the stars, and this year they're all coming true!",
    "You shine brighter than any constellation in the universe!",
    "May your birthday be as magical as a shooting star crossing the night sky!"
  ],

  // Photo Gallery Configuration
  photos: [
    {
      src: "assets/img/1.jpg",
      alt: "Beautiful Smile",
      caption: "Precious Moments"
    },
    {
      src: "assets/img/2.jpg",
      alt: "Happy Times",
      caption: "Joyful Memories"
    },
    {
      src: "assets/img/3.jpg",
      alt: "Special Day",
      caption: "Unforgettable"
    },
    {
      src: "assets/img/4.jpg",
      alt: "Sweet Moment",
      caption: "Cherished Times"
    },
    {
      src: "assets/img/5.jpg",
      alt: "Favorite Memory",
      caption: "Heart Warming"
    },
    {
      src: "assets/img/6.jpg",
      alt: "Wonderful You",
      caption: "Simply Amazing"
    }
  ],

  // Gift Icons
  giftIcons: ["🎁", "💝", "🌟", "🎈", "🌸", "💫"],

  // Performance Settings
  performance: {
    maxHearts: 50,
    maxPetals: 40,
    maxSparkles: 25,
    maxFireworks: 20,
    enableLazyLoading: true,
    imageQuality: 'high' // low, medium, high
  },

  // Accessibility Settings
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    screenReaderMode: false
  },

  // Feature Flags
  features: {
    enableGuestBook: true,
    enableShareButtons: true,
    enablePhotoUpload: true,
    enableCountdown: true,
    enableNotifications: true
  }
};

// Export config for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
