export default function decorate(block) {
  // Create the main accordion container
  const accordionContainer = document.createElement('div');
  accordionContainer.className = 'cmp-accordion';
  accordionContainer.setAttribute('data-cmp-is', 'accordion');
  accordionContainer.setAttribute('data-cmp-data-layer', block.dataset.cmpDataLayer || '{}');
  accordionContainer.setAttribute('data-cmp-single-expansion', block.dataset.cmpSingleExpansion || 'false');

  // Process each row in the block (excluding the header row)
  const rows = [...block.children].slice(1); // Skip the header row
  rows.forEach((row, index) => {
    const cells = [...row.children];
    const id = cells[0]?.textContent.trim();
    const title = cells[1]?.textContent.trim();
    const content = cells[2]?.innerHTML || '';

    // Create accordion item
    const accordionItem = document.createElement('div');
    accordionItem.className = 'cmp-accordion__item';
    accordionItem.setAttribute('data-cmp-hook-accordion', 'item');
    accordionItem.setAttribute('id', `accordion-item-${id}`);
    accordionItem.setAttribute('data-cmp-expanded', 'false');

    // Create accordion header with a button
    const header = document.createElement('div');
    header.className = 'cmp-accordion__header';

    const button = document.createElement('button');
    button.className = 'cmp-accordion__button';
    button.setAttribute('type', 'button');
    button.setAttribute('aria-controls', `accordion-panel-${id}`);
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('id', `accordion-button-${id}`);

    const titleSpan = document.createElement('span');
    titleSpan.className = 'cmp-accordion__title';
    titleSpan.textContent = title || `Accordion Item ${index + 1}`;

    const iconSpan = document.createElement('span');
    iconSpan.className = 'cmp-accordion__icon';

    button.append(titleSpan, iconSpan);
    header.appendChild(button);
    accordionItem.appendChild(header);

    // Create accordion panel for content
    const panel = document.createElement('div');
    panel.className = 'cmp-accordion__panel cmp-accordion__panel--hidden';
    panel.setAttribute('data-cmp-hook-accordion', 'panel');
    panel.setAttribute('id', `accordion-panel-${id}`);
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', `accordion-button-${id}`);
    panel.innerHTML = content;

    accordionItem.appendChild(panel);
    accordionContainer.appendChild(accordionItem);

    // Add toggle functionality to the accordion button
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
      panel.classList.toggle('cmp-accordion__panel--hidden', isExpanded);
      panel.classList.toggle('cmp-accordion__panel--expanded', !isExpanded);
    });
  });

  // Replace the existing block content with the newly structured accordion
  block.textContent = '';
  block.appendChild(accordionContainer);
}