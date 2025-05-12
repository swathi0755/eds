export default function decorate(block) {
  // Read list items from the document metadata (assuming JSON or table-based structure)
  let listData = window.listData || [];

   let container = block.querySelector('a[href]');
   let data = new URL(container.href);
   fetch(`${data.pathname}${data.search}`)
           .then(async (response) => {
             const json = await response.json();
             listData = json.data;

              if (!Array.isArray(listData) || listData.length === 0) {
                 console.warn('No list data found');
                 return;
               }

               // Create a <ul> element with necessary attributes
               const ul = document.createElement('ul');
               ul.className = 'cmp-list';

               listData.forEach((item) => {
                 const li = document.createElement('li');
                 li.className = 'cmp-list__item';
                 li.dataset.cmpDataLayer = JSON.stringify({
                   [item.id]: {
                     '@type': 'core-components-examples/components/list/item',
                     'repo:modifyDate': item.modifyDate,
                     'dc:title': item.title,
                     'xdm:linkURL': item.url,
                   },
                 });

                 const span = document.createElement('span');
                 span.className = 'cmp-list__item-title';
                 span.textContent = item.title;

                 li.appendChild(span);
                 ul.appendChild(li);
               });

               // Replace the block content with the generated list
               block.innerHTML = '';
               block.appendChild(ul);
           });


}
