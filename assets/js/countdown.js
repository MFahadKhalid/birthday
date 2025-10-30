// ===== COUNTDOWN TIMER MODULE =====

class CountdownTimer {
  constructor(targetDate, displayElement) {
    this.targetDate = new Date(targetDate);
    this.displayElement = displayElement;
    this.interval = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.isRunning = false;
    }
  }

  update() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.stop();
      if (this.displayElement) {
        this.displayElement.innerHTML = "🎉 HAPPY BIRTHDAY! 🎉";
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (this.displayElement) {
      this.displayElement.innerHTML = `
        <div class="countdown-timer">
          <div class="countdown-item">
            <span class="countdown-number">${days}</span>
            <span class="countdown-label">Days</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">${hours}</span>
            <span class="countdown-label">Hours</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">${minutes}</span>
            <span class="countdown-label">Minutes</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">${seconds}</span>
            <span class="countdown-label">Seconds</span>
          </div>
        </div>
      `;
    }
  }

  destroy() {
    this.stop();
    if (this.displayElement) {
      this.displayElement.innerHTML = '';
    }
  }
}

// Initialize countdown when DOM is loaded
function initCountdown() {
  const countdownContainer = document.getElementById('countdownContainer');
  if (!countdownContainer) return;

  // Get birthday date from config or use default
  const birthdayDate = typeof CONFIG !== 'undefined' && CONFIG.birthday
    ? `${CONFIG.birthday.date} ${CONFIG.birthday.year}`
    : 'August 21, 2025';

  const countdown = new CountdownTimer(birthdayDate, countdownContainer);
  countdown.start();

  // Store countdown instance for cleanup
  window.birthdayCountdown = countdown;
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CountdownTimer, initCountdown };
}
