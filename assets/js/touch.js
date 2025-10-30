// ===== TOUCH GESTURE HANDLER MODULE =====

class TouchGestureHandler {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 50;
    this.handlers = {
      swipeLeft: [],
      swipeRight: [],
      swipeUp: [],
      swipeDown: []
    };
  }

  // Initialize touch event listeners
  init(element = document) {
    element.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    element.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
    element.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
  }

  // Handle touch start
  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
  }

  // Handle touch move
  handleTouchMove(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.touchEndY = e.changedTouches[0].screenY;
  }

  // Handle touch end
  handleTouchEnd(e) {
    this.handleGesture();
  }

  // Determine gesture direction
  handleGesture() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    // Determine if horizontal or vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > this.minSwipeDistance) {
        if (deltaX > 0) {
          this.trigger('swipeRight');
        } else {
          this.trigger('swipeLeft');
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > this.minSwipeDistance) {
        if (deltaY > 0) {
          this.trigger('swipeDown');
        } else {
          this.trigger('swipeUp');
        }
      }
    }
  }

  // Register gesture handler
  on(gesture, callback) {
    if (this.handlers[gesture]) {
      this.handlers[gesture].push(callback);
    }
  }

  // Trigger gesture handlers
  trigger(gesture) {
    if (this.handlers[gesture]) {
      this.handlers[gesture].forEach(callback => callback());
    }
  }

  // Remove gesture handler
  off(gesture, callback) {
    if (this.handlers[gesture]) {
      this.handlers[gesture] = this.handlers[gesture].filter(cb => cb !== callback);
    }
  }
}

// Page Navigation with Touch Gestures
class TouchPageNavigator {
  constructor(pages) {
    this.pages = pages || [
      'welcome', 'messages', 'videos', 'photos', 'gifts',
      'reasons', 'cake', 'constellation', 'wishes', 'celebration'
    ];
    this.currentIndex = 0;
    this.touchHandler = new TouchGestureHandler();
  }

  init() {
    // Setup swipe navigation
    this.touchHandler.on('swipeLeft', () => this.nextPage());
    this.touchHandler.on('swipeRight', () => this.previousPage());

    this.touchHandler.init();
  }

  getCurrentPageIndex() {
    const currentPage = document.querySelector('.page.active');
    if (!currentPage) return 0;

    const pageId = currentPage.id;
    return this.pages.indexOf(pageId);
  }

  nextPage() {
    const currentIndex = this.getCurrentPageIndex();
    if (currentIndex < this.pages.length - 1) {
      const nextPageId = this.pages[currentIndex + 1];
      if (typeof showPage === 'function') {
        showPage(nextPageId);
        this.showSwipeIndicator('left');
      }
    }
  }

  previousPage() {
    const currentIndex = this.getCurrentPageIndex();
    if (currentIndex > 0) {
      const prevPageId = this.pages[currentIndex - 1];
      if (typeof showPage === 'function') {
        showPage(prevPageId);
        this.showSwipeIndicator('right');
      }
    }
  }

  showSwipeIndicator(direction) {
    const indicator = document.createElement('div');
    indicator.className = `swipe-indicator swipe-${direction}`;
    indicator.innerHTML = direction === 'left' ? '👉' : '👈';
    document.body.appendChild(indicator);

    setTimeout(() => indicator.classList.add('show'), 10);
    setTimeout(() => {
      indicator.classList.remove('show');
      setTimeout(() => indicator.remove(), 300);
    }, 800);
  }
}

// Lightbox Touch Navigation
class TouchLightboxNavigator {
  constructor() {
    this.touchHandler = new TouchGestureHandler();
  }

  init() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const touchHandler = new TouchGestureHandler();
    touchHandler.on('swipeLeft', () => {
      if (typeof nextImage === 'function') {
        nextImage();
      }
    });
    touchHandler.on('swipeRight', () => {
      if (typeof previousImage === 'function') {
        previousImage();
      }
    });
    touchHandler.on('swipeDown', () => {
      if (typeof closeLightbox === 'function') {
        closeLightbox();
      }
    });

    touchHandler.init(lightbox);
  }
}

// Initialize all touch handlers
function initTouchGestures() {
  // Page navigation
  const pageNavigator = new TouchPageNavigator();
  pageNavigator.init();
  window.touchPageNavigator = pageNavigator;

  // Lightbox navigation
  const lightboxNavigator = new TouchLightboxNavigator();
  lightboxNavigator.init();
  window.touchLightboxNavigator = lightboxNavigator;
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TouchGestureHandler,
    TouchPageNavigator,
    TouchLightboxNavigator,
    initTouchGestures
  };
}
