(function () {
  const PASSWORD = "#99#";
  const SESSION_KEY = "warsaw_unlocked";

  function createLocker() {
    // Already unlocked for this session?
    if (sessionStorage.getItem(SESSION_KEY) === "true") return;

    // Prevent duplicate overlays
    if (document.getElementById("locker-overlay")) return;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "locker-overlay";
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.85); z-index: 99999;
      display: flex; justify-content: center; align-items: center;
    `;

    // Container
    const container = document.createElement("div");
    container.style.cssText = "text-align: center;";

    const input = document.createElement("input");
    input.type = "password";
    input.placeholder = "Not Allowed Here!";
    input.style.cssText = "padding: 10px; font-size: 18px; border-radius: 5px;";

    const message = document.createElement("div");
    message.style.cssText = "color: red; margin-top: 10px; font-weight: bold;";

    container.appendChild(input);
    container.appendChild(message);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Blur page content
    Array.from(document.body.children).forEach(child => {
      if (child !== overlay) {
        child.style.filter = "blur(5px)";
        child.style.pointerEvents = "none";
      }
    });

    input.focus();

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        if (input.value === PASSWORD) {
          sessionStorage.setItem(SESSION_KEY, "true");
          overlay.remove();
          Array.from(document.body.children).forEach(child => {
            child.style.filter = "";
            child.style.pointerEvents = "";
          });
        } else {
          message.textContent = "Incorrect password. Try again.";
          input.value = "";
        }
      }
    });

    overlay.addEventListener("click", e => e.stopPropagation(), true);
    window.addEventListener("keydown", e => {
      if (e.key === "Escape") e.preventDefault();
    }, true);
  }

  function watchRouteChanges() {
    let currentUrl = location.href;
    const observer = new MutationObserver(() => {
      if (location.href !== currentUrl) {
        currentUrl = location.href;
        sessionStorage.removeItem(SESSION_KEY); // Optional: re-lock on navigation
        createLocker();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Run on first load
  createLocker();

  // Watch for URL changes (SPA handling)
  watchRouteChanges();
})();
