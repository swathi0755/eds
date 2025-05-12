export default function decorate(block) {
  block.classList.add('cards-wrapper'); // Add a wrapper class for styling if needed

  // Process each child of the block
  [...block.children].forEach((row) => {
    const card = document.createElement('li');
    card.className = 'card';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'card-image';

    const textContainer = document.createElement('div');
    textContainer.className = 'card-body';

    // Extract image
    const picture = row.querySelector('picture');
    if (picture) {
      const pictureClone = picture.cloneNode(true); // Clone the image to avoid moving the DOM
      imageContainer.appendChild(pictureClone);
    }

    // Extract text content
    const textElements = row.querySelectorAll('p');
    textElements.forEach((textEl, index) => {
      const textClone = textEl.cloneNode(true); // Clone the text to avoid moving the DOM
      if (index === 0) {
        textClone.className = 'card-date'; // First paragraph is treated as the date
      }
      textContainer.appendChild(textClone);
    });

    // Append image and text containers to the card
    card.appendChild(imageContainer);
    card.appendChild(textContainer);

    // Append the card to the block
    block.appendChild(card);
  });

//  // Remove the original children as they are now processed
//  while (block.firstChild) {
//    //block.firstChild.remove();
//  }
}