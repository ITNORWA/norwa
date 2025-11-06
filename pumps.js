document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  const sidebarLinks = document.querySelectorAll('.pumps-sidebar .nav-link');
  const contentSections = document.querySelectorAll('.pumps-content .content-section');

  // Function to switch active tabs
  const switchTab = (targetId) => {
    // Update content sections
    contentSections.forEach(section => {
      if (section.id === targetId) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Update sidebar links
    sidebarLinks.forEach(link => {
      if (link.dataset.target === targetId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  // Add click event listeners to sidebar links
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.dataset.target;
      switchTab(targetId);
      
      // Optional: Scroll to the top of the content area on mobile
      if (window.innerWidth < 992) {
        document.querySelector('.pumps-content').scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Check for hash in URL on page load to show a specific tab
  if (window.location.hash) {
    const hashTarget = window.location.hash.substring(1);
    const targetElement = document.getElementById(hashTarget);
    if (targetElement) {
        switchTab(hashTarget);
    }
  } else {
    // Otherwise, ensure the default first tab is active
    switchTab('booster-pumps');
  }

});