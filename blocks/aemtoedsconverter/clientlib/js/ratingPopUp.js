function showRatingPopup(ratingDescription) {
  // Create overlay container
      const overlay = document.querySelector('.rating-overlay') ? document.querySelector('.rating-overlay'): document.createElement("div");
      overlay.className = "rating-overlay";

      // Create modal box
      const modal = document.createElement("div");
      modal.className = "rating-modal";

      // Create close button
      const closeButton = document.createElement("button");
      closeButton.innerHTML = "×";
      closeButton.className = "close-rating";
      closeButton.onclick = () => {
        document.body.style.overflow = ""; // Restore scrolling
        overlay.remove();
      };

      // Create title (top-right)
      const title = document.createElement("h2");
      title.textContent = "Review and Rate Experience";
      title.className = "rating-title";

      // Create description (centered)
      const description = ratingDescription!= null ? ratingDescription : document.createElement("p");
      description.innerHTML = description.innerHTML != ''? description.innerHTML :"Please rate your experience from 1 to 10.";
      description.className = "rating-description";


      // Create rating options
      const ratingContainer = document.createElement("div");
      ratingContainer.className = "rating-container";
      for (let i = 1; i <= 10; i++) {
        const ratingButton = document.createElement("button");
        ratingButton.className = "rating-button";
        ratingButton.setAttribute('data-rating',i);
        ratingButton.textContent = i;
        ratingButton.onclick = () => {
          submitButton.dataset.rating = i; // Store selected rating
        };
        ratingContainer.appendChild(ratingButton);
      }

      // Create submit button
      const submitButton = document.createElement("button");
      submitButton.textContent = "Submit";
      submitButton.className = "submit-rating";
      submitButton.onclick = () => {
        if(submitButton.dataset.rating){
           alert(`You rated: ${submitButton.dataset.rating}`);
            document.body.style.overflow = ""; // Restore scrolling
            overlay.remove();
        }else{
          alert(`You rated: "No rating selected"`);
        }
        return
      };

      // Append elements
      modal.append(closeButton, title, description, ratingContainer, submitButton);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";
}
export{
  showRatingPopup
}