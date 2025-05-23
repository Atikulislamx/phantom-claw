// Phantom Claw - content.js
// Runs in the context of Facebook profile pages to automate the report flow

// Utility: Wait for a specific time (milliseconds)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Utility: Wait for a DOM element to appear (with timeout)
async function waitForSelector(selector, timeout = 8000) {
  const pollInterval = 300;
  const maxAttempts = Math.ceil(timeout / pollInterval);
  let attempts = 0;
  while (attempts < maxAttempts) {
    const el = document.querySelector(selector);
    if (el) return el;
    await delay(pollInterval + Math.random() * 300); // Randomize polling
    attempts++;
  }
  return null;
}

// Main logic: simulate reporting a profile
async function reportProfile() {
  try {
    // 1. Find and click the "More" (three dots) button on the profile
    const moreBtn = await waitForSelector('div[aria-label="More options"], div[aria-label="Actions for this profile"], div[aria-label="Actions for this Page"]');
    if (!moreBtn) throw new Error('Could not find the "More options" button.');
    moreBtn.click();
    await delay(800 + Math.random() * 1200);

    // 2. Find and click "Find support or report profile"
    // This text can change based on language or account; adjust as needed
    const reportMenu = await waitForSelector('span:contains("Find support or report profile"), span:contains("Find support or report")');
    if (!reportMenu) throw new Error('Could not find the "Report profile" menu item.');
    reportMenu.closest('div[role="menuitem"]').click();
    await delay(900 + Math.random() * 1100);

    // 3. Select "Pretending to Be Someone"
    const pretendOption = await waitForSelector('span:contains("Pretending to Be Someone")');
    if (!pretendOption) throw new Error('Could not find "Pretending to Be Someone" option.');
    pretendOption.closest('div[role="radio"]').click();
    await delay(800 + Math.random() * 1000);

    // 4. Click "Next" or "Continue"
    const nextBtn = await waitForSelector('div[role="button"]:contains("Next"), div[role="button"]:contains("Continue")');
    if (!nextBtn) throw new Error('Could not find the "Next" button.');
    nextBtn.click();
    await delay(800 + Math.random() * 1200);

    // 5. Confirm report (if required)
    const doneBtn = await waitForSelector('div[role="button"]:contains("Done"), div[role="button"]:contains("Close")', 4000);
    if (doneBtn) doneBtn.click();

    // Success!
    sendLogToPopup('success', 'Profile reported successfully!');
  } catch (err) {
    sendLogToPopup('failed', err.message || 'An error occurred during reporting.');
  }
}

// Helper: Send status log to popup.js via window messaging
function sendLogToPopup(status, message) {
  window.postMessage({ source: "phantom-claw", status, message }, "*");
}

// Listen for a message from the background script to start
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "startReport") {
    sendLogToPopup('in-progress', 'Starting automated report...');
    reportProfile();
    sendResponse({ status: "started" });
  }
});

// ---- DOM Query Polyfill ----
// Facebook uses React so :contains() does not work on querySelector.
// We add a simple polyfill for matching elements by text content.
(function() {
  // Only patch once
  if (window.__phantomClawContainsPatch) return;
  window.__phantomClawContainsPatch = true;

  function querySelectorContains(tag, text) {
    const elements = Array.from(document.querySelectorAll(tag));
    return elements.find(el => el.textContent && el.textContent.trim().includes(text));
  }

  // Patch querySelector for :contains()
  const originalQuerySelector = Document.prototype.querySelector;
  Document.prototype.querySelector = function(selector) {
    const containsMatch = /(.+):contains"(.+)"/.exec(selector);
    if (containsMatch) {
      return querySelectorContains(containsMatch[1], containsMatch[2]);
    }
    return originalQuerySelector.call(this, selector);
  };
})();
