export default function decorate(block) {
  // Create the main list container
  const listContainer = document.createElement('div');
  listContainer.className = 'cmp-list';

  // Process each row in the block
  const rows = [...block.children];
  rows.forEach((row) => {
    const listItems = row.querySelectorAll('li');

    // Create a recursive function to build nested lists
    function createNestedList(items) {
      const ul = document.createElement('ul');
      items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item.firstChild.textContent.trim();

        // Check for nested lists
        const nestedUl = item.querySelector('ul');
        if (nestedUl) {
          li.appendChild(createNestedList(nestedUl.children));
        }

        ul.appendChild(li);
      });
      return ul;
    }

    // Append the constructed list to the container
    const nestedList = createNestedList(listItems);
    listContainer.appendChild(nestedList);
  });

  // Clear the existing block content and append the new structure
  block.textContent = '';
  block.appendChild(listContainer);
}