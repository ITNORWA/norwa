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
sideFilter.addEventListener('click', function (ev) {
  const clicked = ev.target.closest('li');
  if (!clicked || !sideFilter.contains(clicked)) return;

  const isDropdownParent = clicked.classList.contains('dropdown');
  const isSub = clicked.parentElement.classList.contains('dropdown-menu');

  // Get main dropdown parent for any click
  const dropdownParent = clicked.closest('.dropdown');

  // ----- TOGGLE BEHAVIOR -----
  // Clicking "Chemicals" should open/close the submenu
  if (isDropdownParent) {
    dropdownParent.classList.toggle('open');
  }

  // Clicking a sub-filter should close the dropdown
  if (isSub && dropdownParent) {
    dropdownParent.classList.remove('open');
  }

  // ----- FILTER BEHAVIOR -----
  const key =
    clicked.dataset.filter ||
    (dropdownParent && dropdownParent.dataset.filter) ||
    '';

  clearActive();
  if (dropdownParent) dropdownParent.classList.add('active');
  if (isSub) clicked.classList.add('sub-active');

  applyFilter(key);
  ev.stopPropagation();
});
