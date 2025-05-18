(function () {
  const PASSWORD = "#99#";
  const SESSION_KEY = "warsaw_unlocked";

  let overlay = null;
  let initialized = false;

  function addLocker() {
    if (sessionStorage.getItem(SESSION_KEY) === "true") return; // Skip if already unlocked

    if (initialized) return;
    initialized = true;

    overlay = document.createElement('div');
    overlay.id = 'locker-overlay';

    const container = document.createElement('div');
    container.id = 'locker-container';

    const input = document.createElement('input');
    input.type = 'password';
    input.id = 'locker-password';
    input.placeholder = 'Not Allowed Here!';
    input.className = 'form-control fs-5';

    const message = document.createElement('div');
    message.id = 'locker-message';
    message.className = 'mt-3 text-danger fw-bold';

    container.appendChild(input);
    container.appendChild(message);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    input.focus();

    Array.from(document.body.children).forEach(child => {
      if (child !== overlay) {
        child.style.filter = 'blur(5px)';
        child.style.pointerEvents = 'none';
      }
    });

    function unlock() {
      sessionStorage.setItem(SESSION_KEY, "true");
      if (overlay && overlay.parentElement) {
        overlay.remove();
        Array.from(document.body.children).forEach(child => {
          child.style.filter = '';
          child.style.pointerEvents = '';
        });
        initialized = false;
      }
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        if (input.value === PASSWORD) {
          unlock();
        } else {
          message.textContent = 'Incorrect password. Try again.';
          input.value = '';
        }
      }
    });

    overlay.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
    }, true);

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
      }
    }, true);
  }

  function initLockerOnRouteChange() {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        // You can add fine-grained URL filtering here
        if (
          currentUrl.includes('chatgpt.com') ||
          currentUrl.includes('chat.openai.com') ||
          currentUrl.includes('youtube.com') ||
          currentUrl.includes('m.youtube.com')
        ) {
          addLocker();
        }
      }
    }).observe(document, { subtree: true, childList: true });
  }

  addLocker();
  initLockerOnRouteChange();
})();
