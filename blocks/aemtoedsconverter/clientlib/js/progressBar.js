
/** Progress Bar Functions */
  const createProgressBar = () => {
    const overlay = document.createElement("div");
    overlay.id = "progress-overlay";
    overlay.style.display = "none";

    overlay.innerHTML = `
      <div class="progress-container">
        <p>Processing...</p>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <p class="progress-text">0%</p>
      </div>
    `;

    document.body.appendChild(overlay);
  };

  const showProgressBar = () => {
    const overlay = document.getElementById("progress-overlay");
    overlay.style.display = "flex";

    const progressFill = overlay.querySelector(".progress-fill");
    const progressText = overlay.querySelector(".progress-text");

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress > 90) progress = 90;
      progressFill.style.width = `${progress}%`;
      progressText.textContent = `${progress}%`;
    }, 500);

    overlay.dataset.interval = interval;
  };

  const hideProgressBar = () => {
    const overlay = document.getElementById("progress-overlay");
    clearInterval(overlay.dataset.interval);

    const progressFill = overlay.querySelector(".progress-fill");
    const progressText = overlay.querySelector(".progress-text");

    progressFill.style.width = "100%";
    progressText.textContent = "100%";

    setTimeout(() => {
      overlay.style.display = "none";
      progressFill.style.width = "0%";
      progressText.textContent = "0%";
    }, 500);
  };

  export { createProgressBar, showProgressBar, hideProgressBar };