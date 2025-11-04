/**
* Template Name: NiceSchool
* Template URL: https://bootstrapmade.com/nice-school-bootstrap-education-template/
* Updated: May 10 2025 with Bootstrap v5.3.6
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }
  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);
  }


  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });
    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );
      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

})();

/**
 * -------------------------------------------------------------------------------------------
 * CUSTOM APPLICATION LOGIC
 * This section contains custom JavaScript for specific pages.
 * By wrapping each piece of logic in an 'if (element)' check, we ensure
 * the code only runs on the pages where the element exists, preventing errors.
 * -------------------------------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {

  // --- Water Analysis Form Validation Logic ---
  const reportForm = document.getElementById('reportForm');
  
  // This check prevents errors on pages that don't have the form.
  if (reportForm) {
    reportForm.addEventListener('submit', function(event) {
      const fileInput = document.getElementById('fileAttachment');
      const file = fileInput.files[0];
      const maxFileSize = 2 * 1024 * 1024; // 2MB

      // Check file size
      if (file && file.size > maxFileSize) {
        alert('The selected file exceeds the maximum size of 2MB. Please choose a smaller file.');
        event.preventDefault();
      }

      // Check if all mandatory fields are filled
      const requiredFields = document.querySelectorAll('[required]');
      let allFieldsFilled = true;
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          allFieldsFilled = false;
        }
      });

      if (!allFieldsFilled) {
        alert('Please fill out all mandatory fields.');
        event.preventDefault();
      }
    });
  }


  const whatsAppButton = document.getElementById('whatsapp-button');
  
  if (whatsAppButton) {
    const phoneNumber = '254710869870';
    const message = encodeURIComponent("Hello! Norwa I need your support.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    whatsAppButton.addEventListener('click', () => {
      window.open(whatsappUrl, '_blank');
    });

    const setCursorVariant = (variant) => {
      document.body.classList.toggle('link-cursor', variant === 'link');
    };
    whatsAppButton.addEventListener('mouseenter', () => setCursorVariant('link'));
    whatsAppButton.addEventListener('mouseleave', () => setCursorVariant('default'));
  }

});