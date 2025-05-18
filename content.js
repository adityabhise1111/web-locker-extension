(function() {
  const PASSWORD = "#99#";

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.id = 'locker-overlay';

  // Create password input container
  const container = document.createElement('div');
  container.id = 'locker-container';

  // Create password input field
  const input = document.createElement('input');
  input.type = 'password';
  input.id = 'locker-password';
  input.placeholder = 'Not Allowed Here!';
  input.className = 'form-control fs-5';

  // Create message element
  const message = document.createElement('div');
  message.id = 'locker-message';
  message.className = 'mt-3 text-danger fw-bold';

  container.appendChild(input);
  container.appendChild(message);
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  // Focus on input field
  input.focus();

  // Apply blur and disable pointer events to all body children except overlay
  Array.from(document.body.children).forEach(child => {
    if (child !== overlay) {
      child.style.filter = 'blur(5px)';
      child.style.pointerEvents = 'none';
    }
  });

  // Unlock function
  function unlock() {
    document.body.removeChild(overlay);
    Array.from(document.body.children).forEach(child => {
      if (child !== overlay) {
        child.style.filter = '';
        child.style.pointerEvents = '';
      }
    }); 
  }
 
  // Handle input keypress
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      if (input.value === PASSWORD) {
        unlock();
      } else {
        message.textContent = 'Incorrect password. Try again.';
        input.value = '';
      }
    }
  });

  // Prevent closing overlay by clicking outside or other means
  overlay.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
  }, true);

  // Prevent keyboard shortcuts like ESC
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
    }
  }, true);
})();
