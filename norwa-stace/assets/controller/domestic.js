document.addEventListener('DOMContentLoaded', () => {

    // --- Helper Function for Smart Scrolling ---
    // This function calculates the header height and scrolls to the correct position
    function scrollToSection(targetId) {
        const targetElement = document.getElementById(targetId);
        const header = document.querySelector('#header');

        if (targetElement && header) {
            const headerHeight = header.offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight - 20; // 20px for extra breathing room

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // --- Sidebar Navigation Functionality ---
    const sidebarLinks = document.querySelectorAll('#sidebar-nav ul li a');
    const contentSections = document.querySelectorAll('.content-section');

    function showMainSection(targetId) {
        // Hide all content sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Deactivate all sidebar links
        sidebarLinks.forEach(link => link.classList.remove('active'));

        // Show the target content section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');

            // Activate the corresponding sidebar link
            const activeSidebarLink = document.querySelector(`#sidebar-nav ul li a[href="#${targetId}"]`);
            if (activeSidebarLink) {
                activeSidebarLink.classList.add('active');
            }
        }
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 1. Prevent the default browser jump
            e.preventDefault(); 
            
            const targetId = link.getAttribute('href').substring(1);

            // 2. Show the correct content section
            showMainSection(targetId);

            // 3. Use our new smart scroll function
            scrollToSection(targetId);
            
            // 4. Update URL hash without a page reload
            history.pushState(null, '', `#${targetId}`);
        });
    });

    // Handle initial page load based on URL hash
    function initialLoad() {
        const initialHash = window.location.hash ? window.location.hash.substring(1) : 'municipal-water-purification';
        
        // Show the correct section immediately
        showMainSection(initialHash);
        
        // Use a slight delay for the initial scroll to ensure all elements are rendered
        setTimeout(() => {
            scrollToSection(initialHash);
        }, 100);
    }
    
    initialLoad();


    // --- Internal System Selector Buttons (No changes here) ---
    document.querySelectorAll('.system-selector .system-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    // --- Accessories Tab Functionality (No changes here) ---
    const filterTabButtons = document.querySelectorAll('.accessories-section-container .tab-btn');
    const filterContents = document.querySelectorAll('.accessories-section-container .filter-content');

    function showFilterTab(targetTabId) {
        filterTabButtons.forEach(button => button.classList.remove('active'));
        filterContents.forEach(content => content.classList.remove('active'));

        const activeTabButton = document.querySelector(`.accessories-section-container .tab-btn[data-tab="${targetTabId}"]`);
        const activeTabContent = document.getElementById(targetTabId);

        if (activeTabButton) activeTabButton.classList.add('active');
        if (activeTabContent) activeTabContent.classList.add('active');
    }

    filterTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.getAttribute('data-tab');
            showFilterTab(targetTabId);
        });
    });

    showFilterTab('sediment');
});

