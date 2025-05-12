console.log('Running custom import.js transformation...');

// This is a simplified version of how you can add a footer to a DOCX file using Helix Importer.

const createCarouselBlock = (main, document) => {
  const rows = [['Carousel']];
  const headers = ['Slide No', 'Image', 'Quote', 'Author Name & Title', 'Organization'];
  rows.push(headers);

  document.querySelectorAll('.cmp-carousel__item').forEach((slide, index) => {
    const img = slide.querySelector('.cmp-image__image');
    const quote = slide.querySelector('.cmp-pullquote__quote .cmp-pullquote__content');
    const author = slide.querySelector('.cmp-pullquote__nametitle');
    const org = slide.querySelector('.cmp-pullquote__organization');

    const row = [
      `Slide ${index + 1}`,
      img || '',
      quote?.innerText || '',
      author?.innerText || '',
      org?.innerText || '',
    ];
    rows.push(row);
  });

  if (rows.length > 2) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    main.prepend(table);
  }
};


const createAccordionBlock = (main, document) => {
  const rows = [['Accordion']];

  // Header row starts with "Accordion" as the first cell
  const headers = [ 'id','Title',  'Content', ];
  rows.push(headers);

  document.querySelectorAll('.cmp-accordion__item').forEach((tab, i) => {
    const img = tab.querySelector('.cmp-image__placeholder img');
    const title = tab.querySelector('.cmp-accordion__title');
    const icon = tab.querySelector('.cmp-accordion__icon');
    const element = tab.querySelector('.cmp-accordion__icon--content');
    const addedClasses = Array.from(element.classList).filter(cls => cls !== 'cmp-accordion__icon--content');
    const classString = addedClasses.join(' ');

    const acc_element = document.querySelector('.accordion.panelcontainer');
    const classes = acc_element.className.split(' ');
    const startIndex = classes.indexOf('panelcontainer');
    const theme = classes[startIndex + 1];
    const icon_alignment = classes[startIndex + 2];
    const vertical_spacing = classes[startIndex + 3];

    let desc;
    tab.querySelectorAll('.cmp-text').forEach((itm) => {
      if (desc) {
        desc.append(itm);
      } else {
        desc = itm;
      }
    });

    // Build the row for this accordion tab
    const row = [
      `${i + 1}`,
      title,
      desc

    ];

    rows.push(row);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  main.prepend(table);
};


const createHeroBlock = (main, document) => {
  document.querySelectorAll('.cmp-teaser__container').forEach((tab, i) => {
  const img = tab.querySelector('.cmp-image__placeholder img')
  const pretitle = tab.querySelector('.cmp-teaser__pretitle')
  const title = tab.querySelector('.cmp-teaser__title')
  const description = tab.querySelector('.cmp-teaser__description')

  let desc;
  tab.querySelectorAll('.cmp-text').forEach((itm, i) => {
    console.log(itm)
    if(desc){
      desc.append(itm);
    }else{
      desc = itm;
    }


  })

  const cells = [
    ['Hero'],
   ['Title',title],['Pretitle',pretitle],['Image',img],['Caption',description],

  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  main.prepend(table);
  })
};

const createMetadataBlock = (main, document) => {
  const meta = {};

  // find the <title> element
  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  // find the <meta property="og:description"> element
  const desc = document.querySelector('[name="description"]');
  if (desc) {
    meta.Description = desc.content;
  }

   const navigationtitle = document.querySelector('[name="navigationtitle"]');
    if (navigationtitle) {
      meta.Navigationtitle = navigationtitle.content;
    }

  // find the <meta property="og:image"> element
  const img = document.querySelector('[property="og:image"]');
  if (img) {
    // create an <img> element
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  // helper to create the metadata block
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);

  // append the block to the main element
  main.append(block);

  // returning the meta object might be usefull to other rules
  return meta;
};
export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // attempt to remove non-content elements
    WebImporter.DOMUtils.remove(main, [
      'header',
      '.header',
      'nav',
      '.nav',
      'footer',
      '.footer',
      'iframe',
      'noscript',
    ]);
    createMetadataBlock(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    WebImporter.rules.convertIcons(main, document);
    createAccordionBlock(main, document);
    createCarouselBlock(main, document);
    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    let p = new URL(url).pathname;
    if (p.endsWith('/')) {
      p = `${p}index`;
    }
    return decodeURIComponent(p)
      .toLowerCase()
      .replace(/\.html$/, '')
      .replace(/[^a-z0-9/]/gm, '-');
  },
};