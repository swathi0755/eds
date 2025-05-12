export default function decorate(block) {
  // Extract data attributes from the block
  const type = block.querySelector('div:nth-child(1) p').textContent.trim();
  const buttonText = block.querySelector('div:nth-child(2) p').textContent.trim();
  const buttonLink = block.querySelector('div:nth-child(3) p').textContent.trim();

  // Create the button or link element
  const element = document.createElement(buttonLink ? 'a' : 'button');
  element.className = `cmp-${type}`;
  element.id = `button-${Date.now()}`;
  element.setAttribute('aria-label', buttonText);
  element.setAttribute('href', buttonLink);
  element.setAttribute('role', 'button');

  // Set button text
  const textSpan = document.createElement('span');
  textSpan.className = `cmp-${type}__text`;
  textSpan.textContent = buttonText;
  element.appendChild(textSpan);

  // Replace block content with the constructed button/link
  block.textContent = '';
  block.appendChild(element);
}