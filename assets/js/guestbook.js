// ===== GUEST BOOK MODULE =====

class GuestBook {
  constructor(storageKey = 'birthdayGuestBook') {
    this.storageKey = storageKey;
    this.messages = this.loadMessages();
  }

  // Load messages from localStorage
  loadMessages() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading guest book messages:', error);
      return [];
    }
  }

  // Save messages to localStorage
  saveMessages() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.messages));
      return true;
    } catch (error) {
      console.error('Error saving guest book messages:', error);
      return false;
    }
  }

  // Add new message
  addMessage(name, message) {
    if (!name || !message) {
      return { success: false, error: 'Name and message are required' };
    }

    const newMessage = {
      id: Date.now(),
      name: this.sanitizeInput(name),
      message: this.sanitizeInput(message),
      timestamp: new Date().toISOString(),
      likes: 0
    };

    this.messages.unshift(newMessage);

    // Keep only last 100 messages
    if (this.messages.length > 100) {
      this.messages = this.messages.slice(0, 100);
    }

    const saved = this.saveMessages();
    return { success: saved, message: newMessage };
  }

  // Sanitize input to prevent XSS
  sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Get all messages
  getAllMessages() {
    return [...this.messages];
  }

  // Like a message
  likeMessage(messageId) {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.likes = (message.likes || 0) + 1;
      this.saveMessages();
      return true;
    }
    return false;
  }

  // Delete a message
  deleteMessage(messageId) {
    const index = this.messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      this.messages.splice(index, 1);
      this.saveMessages();
      return true;
    }
    return false;
  }

  // Clear all messages
  clearAll() {
    this.messages = [];
    this.saveMessages();
  }

  // Render guest book UI
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="guestbook-container">
        <h3 class="guestbook-title">💌 Guest Book - Leave Your Wishes!</h3>

        <div class="guestbook-form">
          <input
            type="text"
            id="guestbook-name"
            class="guestbook-input"
            placeholder="Your Name"
            maxlength="50"
            aria-label="Your name"
          >
          <textarea
            id="guestbook-message"
            class="guestbook-textarea"
            placeholder="Write your birthday wishes..."
            maxlength="500"
            rows="4"
            aria-label="Your birthday message"
          ></textarea>
          <button
            id="guestbook-submit"
            class="guestbook-submit"
            aria-label="Submit your message"
          >
            ✨ Send Wishes ✨
          </button>
        </div>

        <div id="guestbook-messages" class="guestbook-messages">
          ${this.renderMessages()}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  // Render all messages
  renderMessages() {
    if (this.messages.length === 0) {
      return '<p class="guestbook-empty">Be the first to leave a birthday wish! 🎉</p>';
    }

    return this.messages.map(msg => this.renderMessage(msg)).join('');
  }

  // Render single message
  renderMessage(msg) {
    const date = new Date(msg.timestamp);
    const timeAgo = this.getTimeAgo(date);

    return `
      <div class="guestbook-message" data-id="${msg.id}">
        <div class="guestbook-message-header">
          <span class="guestbook-message-name">💫 ${msg.name}</span>
          <span class="guestbook-message-time">${timeAgo}</span>
        </div>
        <div class="guestbook-message-text">${msg.message}</div>
        <div class="guestbook-message-footer">
          <button class="guestbook-like" data-id="${msg.id}">
            ❤️ ${msg.likes || 0}
          </button>
        </div>
      </div>
    `;
  }

  // Calculate time ago
  getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [key, value] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / value);
      if (interval >= 1) {
        return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
      }
    }

    return 'Just now';
  }

  // Attach event listeners
  attachEventListeners() {
    const submitBtn = document.getElementById('guestbook-submit');
    const nameInput = document.getElementById('guestbook-name');
    const messageInput = document.getElementById('guestbook-message');

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const name = nameInput?.value.trim();
        const message = messageInput?.value.trim();

        const result = this.addMessage(name, message);

        if (result.success) {
          // Clear inputs
          if (nameInput) nameInput.value = '';
          if (messageInput) messageInput.value = '';

          // Re-render messages
          const messagesContainer = document.getElementById('guestbook-messages');
          if (messagesContainer) {
            messagesContainer.innerHTML = this.renderMessages();
            this.attachLikeListeners();
          }

          // Show success animation
          this.showSuccessAnimation();
        } else {
          alert(result.error || 'Please fill in all fields');
        }
      });
    }

    this.attachLikeListeners();
  }

  // Attach like button listeners
  attachLikeListeners() {
    const likeButtons = document.querySelectorAll('.guestbook-like');
    likeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const messageId = parseInt(e.target.dataset.id);
        if (this.likeMessage(messageId)) {
          e.target.textContent = `❤️ ${this.messages.find(m => m.id === messageId).likes}`;
          this.animateHeart(e.target);
        }
      });
    });
  }

  // Animate heart on like
  animateHeart(button) {
    button.classList.add('liked');
    setTimeout(() => button.classList.remove('liked'), 300);
  }

  // Show success animation
  showSuccessAnimation() {
    // Could add sparkles or confetti here
    const sparkles = ['✨', '💫', '⭐', '🌟'];

    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'success-sparkle';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1000);
      }, i * 50);
    }
  }
}

// Initialize guest book
function initGuestBook() {
  const guestBookContainer = document.getElementById('guestBookContainer');
  if (!guestBookContainer) return;

  const guestBook = new GuestBook();
  guestBook.render('guestBookContainer');

  // Store instance globally for access
  window.guestBook = guestBook;
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GuestBook, initGuestBook };
}
