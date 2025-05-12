
export default function decorate(block) {
    const tabList = document.createElement('ol');
    tabList.className = 'cmp-tabs__tablist';
    tabList.setAttribute('role', 'tablist');

    const items = [...block.children];
    
    items.forEach((item, index) => {
        const titleElement = item.querySelector("h2, h3, h4, h5, h6");
        const contentElement = item.querySelector('div:nth-of-type(2)');

        // Create tab button
        const li = document.createElement('li');
        li.setAttribute('role', 'tab');
        li.id = `tab-${index}`;
        li.className = 'cmp-tabs__tab';
        li.setAttribute('tabindex', index === 0 ? '0' : '-1');
        li.setAttribute('aria-controls', `tabpanel-${index}`);
        li.setAttribute('aria-selected', index === 0);
        
        const tabTitle = document.createElement('span');
        tabTitle.className = 'cmp-tabs__tab-title';
        tabTitle.textContent = titleElement ? titleElement.textContent : `Tab ${index + 1}`;
        
        li.appendChild(tabTitle);
        tabList.appendChild(li);

        // Create tab panel
        const tabPanel = document.createElement('div');
        tabPanel.className = 'cmp-tabs__tabpanel';
        tabPanel.setAttribute('role', 'tabpanel');
        tabPanel.id = `tabpanel-${index}`;
        tabPanel.setAttribute('aria-labelledby', li.id);
        tabPanel.style.display = index === 0 ? 'block' : 'none'; // Only show first tab by default

        // Append content to the tab panel
        if (contentElement) {
            tabPanel.appendChild(contentElement.cloneNode(true));
        }

        block.appendChild(tabPanel);
    });

    block.prepend(tabList);

    // Toggle functionality for tabs
    tabList.addEventListener('click', (event) => {
        if (event.target.closest('.cmp-tabs__tab')) {
            const selectedTab = event.target.closest('.cmp-tabs__tab');
            const selectedTabIndex = Array.from(tabList.children).indexOf(selectedTab);

            // Hide all tab panels, and remove active state from all tabs
            tabList.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
                tab.setAttribute('aria-selected', 'false');
                tab.setAttribute('tabindex', '-1');
                tab.style.display = 'none';
            });
            
            // Show the selected tab panel and set it as active
            const tabPanels = block.querySelectorAll('.cmp-tabs__tabpanel');
            tabPanels.forEach((panel, index) => {
                panel.style.display = index === selectedTabIndex ? 'block' : 'none';
            });

            selectedTab.setAttribute('aria-selected', 'true');
            selectedTab.setAttribute('tabindex', '0');
        }
    });
}
