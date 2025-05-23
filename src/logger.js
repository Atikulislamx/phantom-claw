// Phantom Claw - logger.js
// Centralized logging utility for status and actions

// Log a status message to the console (and optionally to storage or popup)
export function logStatus(status, message = "") {
  const timestamp = new Date().toISOString();
  const logEntry = `[Phantom Claw][${timestamp}] ${status.toUpperCase()}: ${message}`;
  console.log(logEntry);

  // Future: Save logs to Chrome storage for history
  // chrome.storage.local.get({ logs: [] }, (data) => {
  //   const logs = data.logs;
  //   logs.push(logEntry);
  //   chrome.storage.local.set({ logs });
  // });

  // Future: Send logs to the popup or elsewhere if needed
  // chrome.runtime.sendMessage({ source: "phantom-claw-logger", status, message, timestamp });
}

// Example usage:
// logStatus('success', 'Reported profile successfully');
// logStatus('failed', 'Could not find report button');
