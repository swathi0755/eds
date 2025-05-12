function showPopup(message, type = "error") {
  // Remove existing popup if any
  const existingPopup = document.getElementById("custom-popup");
  if (existingPopup) existingPopup.remove();

  // Create popup container
  const popup = document.createElement("div");
  popup.id = "custom-popup";
  popup.className = `popup-container ${type}`;

  // Create icon based on error type
  const icon = document.createElement("span");
  icon.className = "popup-icon";
  icon.innerHTML = type === "success" ? "✅" : type === "warning" ? "⚠️" : "❌";

  // Create message element
  const text = document.createElement("p");
  text.className = "popup-message";
  text.textContent = message;

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.className = "popup-close";
  closeButton.onclick = () => popup.remove();

  // Append elements to popup
  popup.append(icon, text, closeButton);
  document.body.appendChild(popup);

  // Auto-remove popup after 3 seconds
  setTimeout(() => popup.remove(), 3000);
}

export{
  showPopup
}