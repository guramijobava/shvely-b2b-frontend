// Service Worker Registration
export function registerServiceWorker() {
  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registration successful with scope: ", registration.scope)
        })
        .catch((error) => {
          console.log("ServiceWorker registration failed: ", error)
        })
    })
  }
}

// Add to Home Screen Prompt
export function handleInstallPrompt(event: Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> }) {
  event.preventDefault()
  // Stash the event so it can be triggered later.
  const deferredPrompt = event
  // Show your custom install prompt UI
  // For example, display a button that when clicked calls deferredPrompt.prompt()
  console.log("Install prompt stashed", deferredPrompt)

  // Example:
  // const installButton = document.getElementById('install-button');
  // installButton.style.display = 'block';
  // installButton.addEventListener('click', () => {
  //   deferredPrompt.prompt();
  //   deferredPrompt.userChoice.then((choiceResult) => {
  //     if (choiceResult.outcome === 'accepted') {
  //       console.log('User accepted the A2HS prompt');
  //     } else {
  //       console.log('User dismissed the A2HS prompt');
  //     }
  //     // Hide your custom install prompt UI
  //     // installButton.style.display = 'none';
  //   });
  // });
}

// Check for online status
export function isOnline(): boolean {
  return navigator.onLine
}
