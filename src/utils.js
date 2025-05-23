// Phantom Claw - utils.js
// Common utility functions used throughout the extension

/**
 * Wait for a specific amount of milliseconds (async/await friendly)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a random delay between min and max milliseconds
 * @param {number} min - Minimum milliseconds
 * @param {number} max - Maximum milliseconds
 * @returns {Promise}
 */
export async function randomDelay(min = 800, max = 1800) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  await delay(ms);
}

/**
 * Wait for a selector to appear in the DOM (with timeout)
 * @param {string} selector - CSS selector to wait for
 * @param {number} timeout - ms to wait before giving up (default: 8000ms)
 * @returns {Promise<Element|null>}
 */
export async function waitForSelector(selector, timeout = 8000) {
  const pollInterval = 300;
  const maxAttempts = Math.ceil(timeout / pollInterval);
  let attempts = 0;
  while (attempts < maxAttempts) {
    const el = document.querySelector(selector);
    if (el) return el;
    await delay(pollInterval + Math.random() * 300);
    attempts++;
  }
  return null;
}

/**
 * Simple polyfill for :contains() in querySelector (for Facebook/React UIs)
 * @param {string} tag - HTML tag (e.g. 'span', 'div')
 * @param {string} text - Text content to match
 * @returns {Element|null}
 */
export function querySelectorContains(tag, text) {
  const elements = Array.from(document.querySelectorAll(tag));
  return elements.find(el => el.textContent && el.textContent.trim().includes(text));
}

// Add more helper functions as your extension grows!
