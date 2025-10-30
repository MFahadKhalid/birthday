// ===== SOCIAL SHARE MODULE =====

class ShareManager {
  constructor(config = {}) {
    this.title = config.title || "Happy Birthday!";
    this.text = config.text || "Join me in celebrating this special day! 🎉";
    this.url = config.url || window.location.href;
  }

  // Check if Web Share API is supported
  isWebShareSupported() {
    return 'share' in navigator;
  }

  // Share using Web Share API
  async webShare() {
    if (!this.isWebShareSupported()) {
      return { success: false, error: 'Web Share API not supported' };
    }

    try {
      await navigator.share({
        title: this.title,
        text: this.text,
        url: this.url
      });
      return { success: true };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Share cancelled' };
      }
      return { success: false, error: error.message };
    }
  }

  // Share on Facebook
  shareOnFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.url)}`;
    this.openShareWindow(url, 'Facebook');
  }

  // Share on Twitter
  shareOnTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.text)}&url=${encodeURIComponent(this.url)}`;
    this.openShareWindow(url, 'Twitter');
  }

  // Share on WhatsApp
  shareOnWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(this.text + ' ' + this.url)}`;
    this.openShareWindow(url, 'WhatsApp');
  }

  // Share on Telegram
  shareOnTelegram() {
    const url = `https://t.me/share/url?url=${encodeURIComponent(this.url)}&text=${encodeURIComponent(this.text)}`;
    this.openShareWindow(url, 'Telegram');
  }

  // Copy link to clipboard
  async copyLink() {
    try {
      await navigator.clipboard.writeText(this.url);
      return { success: true };
    } catch (error) {
      // Fallback for older browsers
      return this.fallbackCopyLink();
    }
  }

  // Fallback copy method
  fallbackCopyLink() {
    const textArea = document.createElement('textarea');
    textArea.value = this.url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return { success: true };
    } catch (error) {
      document.body.removeChild(textArea);
      return { success: false, error: 'Failed to copy link' };
    }
  }

  // Open share window
  openShareWindow(url, name) {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      url,
      name,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  }

  // Download as image (screenshot)
  async downloadAsImage(elementId = 'celebration') {
    const element = document.getElementById(elementId);
    if (!element) {
      return { success: false, error: 'Element not found' };
    }

    try {
      // Note: This would require html2canvas library
      // For now, we'll just show a message
      return {
        success: false,
        error: 'Screenshot feature requires additional library'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Render share buttons
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const webShareButton = this.isWebShareSupported()
      ? `<button class="share-btn share-native" onclick="shareManager.webShare()">
          📱 Share
        </button>`
      : '';

    container.innerHTML = `
      <div class="share-container">
        <h3 class="share-title">🎉 Share the Celebration!</h3>
        <div class="share-buttons">
          ${webShareButton}
          <button class="share-btn share-facebook" onclick="shareManager.shareOnFacebook()" aria-label="Share on Facebook">
            📘 Facebook
          </button>
          <button class="share-btn share-twitter" onclick="shareManager.shareOnTwitter()" aria-label="Share on Twitter">
            🐦 Twitter
          </button>
          <button class="share-btn share-whatsapp" onclick="shareManager.shareOnWhatsApp()" aria-label="Share on WhatsApp">
            💬 WhatsApp
          </button>
          <button class="share-btn share-telegram" onclick="shareManager.shareOnTelegram()" aria-label="Share on Telegram">
            ✈️ Telegram
          </button>
          <button class="share-btn share-copy" onclick="shareManager.handleCopyLink()" aria-label="Copy link">
            🔗 Copy Link
          </button>
        </div>
      </div>
    `;
  }

  // Handle copy link with feedback
  async handleCopyLink() {
    const result = await this.copyLink();
    if (result.success) {
      this.showNotification('✅ Link copied to clipboard!');
    } else {
      this.showNotification('❌ Failed to copy link');
    }
  }

  // Show notification
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'share-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize share manager
function initShareManager() {
  const shareContainer = document.getElementById('shareContainer');
  if (!shareContainer) return;

  const config = typeof CONFIG !== 'undefined' && CONFIG.birthday
    ? {
        title: `Happy Birthday ${CONFIG.birthday.name}!`,
        text: `Join me in celebrating ${CONFIG.birthday.name}'s special day on ${CONFIG.birthday.date}! 🎉`,
        url: window.location.href
      }
    : {};

  window.shareManager = new ShareManager(config);
  window.shareManager.render('shareContainer');
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ShareManager, initShareManager };
}
