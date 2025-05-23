// Phantom Claw - background.js
// Handles background tasks and automation flow using Manifest V3 Service Worker

// Called when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Phantom Claw extension installed.');
});

// Listen for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'reportProfile') {
    const { profileUrl, reportMethod } = message;

    // Open the Facebook profile in a new tab (in the background)
    chrome.tabs.create({ url: profileUrl, active: false }, async (tab) => {
      // Wait for the tab to finish loading
      const tabId = tab.id;

      // Poll the tab's status until complete
      function waitForTabLoad(callback) {
        chrome.tabs.get(tabId, (updatedTab) => {
          if (updatedTab.status === 'complete') {
            callback();
          } else {
            setTimeout(() => waitForTabLoad(callback), 500);
          }
        });
      }

      waitForTabLoad(() => {
        // Inject content.js into the profile page
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            files: ['src/content.js'],
          },
          () => {
            // Send a message to content.js to start the automated report
            chrome.tabs.sendMessage(tabId, { action: 'startReport', reportMethod }, (res) => {
              // Optionally handle response
              // You can send a message back to popup if needed
            });
          }
        );
      });
    });

    // Respond to popup immediately so UI can show "in progress"
    sendResponse({ status: 'in-progress', message: 'Reporting initiated.' });
    return true; // Indicate async response
  }
});

// (Optional) Listen for messages from content.js for logging/status
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.source === 'phantom-claw-content') {
    // Example: Forward status updates to the popup, or handle logs here
    // message.status, message.details, etc.
    console.log(`[Phantom Claw] Status from content:`, message);

    // You could use chrome.storage or chrome.runtime.sendMessage to forward to popup if desired
  }
});
