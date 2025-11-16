document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.remove();
      }, 500); // Match this to the CSS transition duration
    });
  }

  /**
   * Header scroll class
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
  window.addEventListener('load', handleHeaderScroll);
  document.addEventListener('scroll', handleHeaderScroll);

  /**
   * Animation on scroll initialization
   */
  function aos_init() {
    AOS.init({
      duration: 800,
      easing: 'slide',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

  /**
   * Projects isotope and filter
   */
  let projectsContainer = document.querySelector('.isotope-container');
  if (projectsContainer) {
    let projectsIsotope = new Isotope(projectsContainer, {
      itemSelector: '.isotope-item',
      layoutMode: 'masonry'
    });

    let filterButtons = document.querySelectorAll('.isotope-filters li');
    filterButtons.forEach(filterButton => {
      filterButton.addEventListener('click', function() {
        // Remove active class from all filters
        filterButtons.forEach(btn => btn.classList.remove('filter-active'));
        // Add active class to the clicked filter
        this.classList.add('filter-active');
        
        // Arrange isotope items
        projectsIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        projectsIsotope.on('arrangeComplete', function() {
          AOS.refresh();
        });
      }, false);
    });
    
    // Ensure layout is correct after all images are loaded
    imagesLoaded(projectsContainer).on('progress', function() {
        projectsIsotope.layout();
    });
  }

  /**
   * GLightbox for project images
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

});
