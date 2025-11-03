document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Function to handle header state on scroll
   */
  const handleHeaderScroll = () => {
    const header = document.querySelector('#header');
    if (!header) return;
    
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Add event listener for scroll and run on page load
  window.addEventListener('load', handleHeaderScroll);
  document.addEventListener('scroll', handleHeaderScroll);

  /**
   * Scroll to the top of the content area when a new tab is shown on mobile.
   */
  const tabLinks = document.querySelectorAll('.sidebar-nav .nav-link');
  const contentArea = document.querySelector('.tab-content');

  tabLinks.forEach(link => {
    link.addEventListener('shown.bs.tab', event => {
      if (window.innerWidth < 992) {
        const topOfContent = contentArea.offsetTop - 100; // Adjust for fixed header
        window.scrollTo({
          top: topOfContent,
          behavior: 'smooth'
        });
      }
    });
  });

});

/**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.remove();
      }, 500);
    });
  }