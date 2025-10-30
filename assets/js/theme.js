// ===== THEME MANAGER MODULE =====

class ThemeManager {
  constructor() {
    this.currentTheme = this.loadTheme();
    this.init();
  }

  // Load theme from localStorage or use system preference
  loadTheme() {
    const saved = localStorage.getItem('birthdayTheme');
    if (saved) {
      return saved;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  // Save theme to localStorage
  saveTheme(theme) {
    try {
      localStorage.setItem('birthdayTheme', theme);
      return true;
    } catch (error) {
      console.error('Error saving theme:', error);
      return false;
    }
  }

  // Initialize theme
  init() {
    this.applyTheme(this.currentTheme);
    this.watchSystemTheme();
  }

  // Apply theme to document
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.saveTheme(theme);
    this.updateToggleButton();
  }

  // Toggle between light and dark theme
  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    this.showThemeChangeAnimation();
  }

  // Update toggle button appearance
  updateToggleButton() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      if (this.currentTheme === 'dark') {
        toggleBtn.innerHTML = '☀️ Light Mode';
        toggleBtn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        toggleBtn.innerHTML = '🌙 Dark Mode';
        toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  }

  // Watch for system theme changes
  watchSystemTheme() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', (e) => {
          if (!localStorage.getItem('birthdayTheme')) {
            this.applyTheme(e.matches ? 'dark' : 'light');
          }
        });
      }
      // Older browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener((e) => {
          if (!localStorage.getItem('birthdayTheme')) {
            this.applyTheme(e.matches ? 'dark' : 'light');
          }
        });
      }
    }
  }

  // Show theme change animation
  showThemeChangeAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.classList.add('active');
    }, 10);

    setTimeout(() => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }, 400);
  }

  // Get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Render theme toggle button
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <button
        id="theme-toggle"
        class="theme-toggle-btn"
        onclick="themeManager.toggle()"
        aria-label="Toggle theme"
      >
        ${this.currentTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    `;
  }
}

// Initialize theme manager
function initThemeManager() {
  window.themeManager = new ThemeManager();

  // Render toggle button in theme container if exists
  const themeContainer = document.getElementById('themeToggleContainer');
  if (themeContainer) {
    window.themeManager.render('themeToggleContainer');
  }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThemeManager, initThemeManager };
}
