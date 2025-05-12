export default function decorate(block) {
  // Create the main hero container
  const heroContainer = document.createElement('div');
  heroContainer.className = 'cmp-teaser__container cmp-image-teaser';
  heroContainer.setAttribute('role', 'region');
  heroContainer.setAttribute('tabindex', '0');

  // Extract data attributes from the block
  const dataLayer = block.dataset.cmpDataLayer ? JSON.parse(block.dataset.cmpDataLayer) : {};
  const { assetType, imageResource, title, description, showButton, buttonList, accessibilityLabel } = dataLayer;

  // Create image or video element based on asset type
  if (assetType === 'image' && imageResource) {
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = imageResource; // Assuming imageResource is a valid image URL
    img.alt = 'Hero Image'; // Provide a default alt text
    img.loading = 'eager';
    picture.appendChild(img);
    heroContainer.appendChild(picture);
  } else if (assetType === 'video') {
    const video = document.createElement('video');
    video.className = 'cmp-image__image';
    video.autoplay = true; // Assuming autoplay is desired
    video.muted = true; // Assuming muted is desired
    video.loop = true; // Assuming loop is desired
    const source = document.createElement('source');
    source.src = imageResource; // Assuming imageResource is a valid video URL
    source.type = 'video/mp4';
    video.appendChild(source);
    heroContainer.appendChild(video);
  }

  // Create content section
  const contentSection = document.createElement('div');
  contentSection.className = 'cmp-teaser__content';

  // Add pretitle, title, and description
  if (dataLayer.pretitle) {
    const pretitle = document.createElement('p');
    pretitle.className = 'cmp-teaser__pretitle';
    pretitle.textContent = dataLayer.pretitle;
    contentSection.appendChild(pretitle);
  }

  const titleElement = document.createElement('h2');
  titleElement.className = 'cmp-teaser__title';
  titleElement.textContent = title || 'Default Title';
  contentSection.appendChild(titleElement);

  const descriptionElement = document.createElement('p');
  descriptionElement.className = 'cmp-teaser__description';
  descriptionElement.textContent = description || 'Default description for the hero.';
  contentSection.appendChild(descriptionElement);

  // Add buttons if present
  if (showButton && buttonList) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'cmp-teaser__button-container';

    buttonList.forEach((button) => {
      const buttonElement = document.createElement('a');
      buttonElement.className = 'button primary';
      buttonElement.href = button.link; // Assuming button.link is a valid URL
      buttonElement.textContent = button.text || 'Button';
      buttonContainer.appendChild(buttonElement);
    });

    contentSection.appendChild(buttonContainer);
  }

  // Append content section to hero container
  heroContainer.appendChild(contentSection);
  
  // Clear existing block content and append the new hero structure
  block.textContent = '';
  block.appendChild(heroContainer);
}