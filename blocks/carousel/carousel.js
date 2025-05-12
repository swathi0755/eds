export default function decorate(block) {
  // Create main carousel container
  const carousel = document.createElement('div');
  carousel.classList.add('cmp-carousel');
  carousel.setAttribute('role', 'group');
  carousel.setAttribute('aria-label', block.dataset.accessibilityLabel || 'Carousel');
  carousel.setAttribute('aria-live', 'polite');
  carousel.setAttribute('data-cmp-is', 'carousel');

  // Create carousel content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('cmp-carousel__content');

  // Process each slide
  const slides = [...block.children].slice(1); // Skip the header row
  slides.forEach((slide, index) => {
    const slideWrapper = document.createElement('div');
    slideWrapper.classList.add('cmp-carousel__item');
    slideWrapper.setAttribute('role', 'tabpanel');
    slideWrapper.setAttribute('aria-roledescription', 'slide');
    slideWrapper.setAttribute('id', `carousel-slide-${index}`);
    slideWrapper.setAttribute('aria-labelledby', `carousel-tab-${index}`);

    // Extract elements from input HTML
    const label = slide.children[0]?.textContent?.trim();
    const imageContainer = slide.children[1]?.querySelector('picture')?.cloneNode(true);
    const slideContent = slide.children[2]?.cloneNode(true);
    const slideID = slide.children[3]?.textContent?.trim();

    if (imageContainer) {
      imageContainer.classList.add('cmp-carousel__image');
      slideWrapper.appendChild(imageContainer);
    }

    if (slideContent) {
      slideContent.classList.add('cmp-carousel__content');
      slideWrapper.appendChild(slideContent);
    }

    contentWrapper.appendChild(slideWrapper);
  });

  // Navigation controls wrapper
  const controlsWrapper = document.createElement('div');
  controlsWrapper.classList.add('cmp-carousel__controls');

  const prevButton = document.createElement('button');
  prevButton.className = 'cmp-carousel__action cmp-carousel__action--previous';
  prevButton.innerHTML = '<span class="cmp-carousel__action-icon"></span>';
  prevButton.addEventListener('click', () => changeSlide(-1));

  const nextButton = document.createElement('button');
  nextButton.className = 'cmp-carousel__action cmp-carousel__action--next';
  nextButton.innerHTML = '<span class="cmp-carousel__action-icon"></span>';
  nextButton.addEventListener('click', () => changeSlide(1));

  controlsWrapper.append(prevButton, nextButton);

  // Indicators (dots)
  const indicators = document.createElement('ol');
  indicators.classList.add('cmp-carousel__indicators');
  indicators.setAttribute('role', 'tablist');
  indicators.setAttribute('aria-label', 'Choose a slide to display');

  slides.forEach((_slide, index) => {
    const indicator = document.createElement('li');
    indicator.className = `cmp-carousel__indicator ${index === 0 ? 'cmp-carousel__indicator--active' : ''}`;
    indicator.setAttribute('role', 'tab');
    indicator.setAttribute('id', `carousel-tab-${index}`);
    indicator.setAttribute('aria-controls', `carousel-slide-${index}`);
    indicator.addEventListener('click', () => goToSlide(index));
    indicator.textContent = `Slide ${index + 1}`;
    indicators.appendChild(indicator);
  });

  // Append all components to the carousel
  carousel.append(contentWrapper, controlsWrapper, indicators);
  block.innerHTML = ''; // Clear original content
  block.appendChild(carousel);

  let currentSlide = 0;
  const totalSlides = slides.length;

  function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;
    updateCarousel();
  }

  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
  }

  function updateCarousel() {
    contentWrapper.querySelectorAll('.cmp-carousel__item').forEach((el, idx) => {
      el.classList.toggle('cmp-carousel__item--active', idx === currentSlide);
    });

    indicators.querySelectorAll('.cmp-carousel__indicator').forEach((el, idx) => {
      el.classList.toggle('cmp-carousel__indicator--active', idx === currentSlide);
    });
  }

  updateCarousel();
}