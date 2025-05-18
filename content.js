(function () {
  const PASSWORD = "#99#";
  const SESSION_KEY = "warsaw_unlocked";

  function injectLocker() {
    // If already unlocked in session
    if (sessionStorage.getItem(SESSION_KEY) === "true") return;

    // If overlay already exists
    if (document.getElementById("locker-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "locker-overlay";
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.85); z-index: 99999;
      display: flex; justify-content: center; align-items: center;
    `;

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

    blurContent();

    input.focus();

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        if (input.value === PASSWORD) {
          sessionStorage.setItem(SESSION_KEY, "true");
          overlay.remove();
          unblurContent();
        } else {
          message.textContent = "Incorrect password. Try again.";
          input.value = "";
        }
      }
    });
  }

  function blurContent() {
    Array.from(document.body.children).forEach(child => {
      if (child.id !== "locker-overlay") {
        child.style.filter = "blur(5px)";
        child.style.pointerEvents = "none";
      }
    });
  }

  function unblurContent() {
    Array.from(document.body.children).forEach(child => {
      child.style.filter = "";
      child.style.pointerEvents = "";
    });
  }

  // 1. First injection
  injectLocker();

  // 2. Re-inject if DOM changes (SPA or overwrite)
  const observer = new MutationObserver(() => {
    injectLocker(); // Will not duplicate because of ID + session check
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
