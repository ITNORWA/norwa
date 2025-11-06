/**
 * Optimized Script — Reduced Forced Reflows + Layout Shifts
 * Applies batching, throttling, and safe DOM reads/writes.
 */

(function () {
  "use strict";

  // Utility: throttle high-frequency events
  function throttle(fn, wait) {
    let timeout = null;
    return function (...args) {
      if (!timeout) {
        timeout = setTimeout(() => {
          fn.apply(this, args);
          timeout = null;
        }, wait);
      }
    };
  }

  /** 
   * - Batches DOM reads/writes
   * - Throttled to 100ms
   */
  const selectBody = document.body;
  const selectHeader = document.querySelector("#header");

  function toggleScrolled() {
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;

    const isScrolled = window.scrollY > 100;
    selectBody.classList.toggle("scrolled", isScrolled);
  }
  document.addEventListener("scroll", throttle(toggleScrolled, 100));
  window.addEventListener("load", toggleScrolled);

  /**
   * 2️ Mobile Nav Toggle — no reflows
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
  const body = document.body;
  function mobileNavToggle() {
    body.classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToggle);
  }

  /**
   * 3️ Hide mobile nav when clicking internal links
   */
  document.querySelectorAll("#navmenu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (body.classList.contains("mobile-nav-active")) {
        mobileNavToggle();
      }
    });
  });

  /**
   * 4️ Toggle mobile dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const parent = this.parentNode;
      parent.classList.toggle("active");
      const next = parent.nextElementSibling;
      if (next) next.classList.toggle("dropdown-active");
    });
  });

  /**
   * 5️ Preloader (safe remove on load)
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => preloader.remove());
  }

  /**
   * 6️ Scroll-top button (throttled)
   */
  const scrollTop = document.querySelector(".scroll-top");
  function toggleScrollTop() {
    if (!scrollTop) return;
    scrollTop.classList.toggle("active", window.scrollY > 100);
  }
  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("load", toggleScrollTop);
    document.addEventListener("scroll", throttle(toggleScrollTop, 150));
  }

  /**
   * 7️ Initialize AOS
   */
  function aosInit() {
    AOS.init({ duration: 600, easing: "ease-in-out", once: true, mirror: false });
  }
  window.addEventListener("load", aosInit);

  /**
   * 8️ Initialize Pure Counter
   */
  new PureCounter();

  /**
   * 9️ Isotope layout — init after images load
   */
  document.querySelectorAll(".isotope-layout").forEach((isotopeItem) => {
    const layout = isotopeItem.dataset.layout ?? "masonry";
    const filter = isotopeItem.dataset.defaultFilter ?? "*";
    const sort = isotopeItem.dataset.sort ?? "original-order";

    imagesLoaded(isotopeItem.querySelector(".isotope-container"), () => {
      const initIsotope = new Isotope(isotopeItem.querySelector(".isotope-container"), {
        itemSelector: ".isotope-item",
        layoutMode: layout,
        filter,
        sortBy: sort,
      });

      isotopeItem.querySelectorAll(".isotope-filters li").forEach((filterEl) => {
        filterEl.addEventListener("click", function () {
          isotopeItem.querySelector(".filter-active")?.classList.remove("filter-active");
          this.classList.add("filter-active");
          initIsotope.arrange({ filter: this.dataset.filter });
          aosInit();
        });
      });
    });
  });

  /**
   * 10 Swiper Init
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach((swiperElement) => {
      const configText = swiperElement.querySelector(".swiper-config")?.textContent.trim();
      if (!configText) return;
      const config = JSON.parse(configText);
      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);

  /**
   * 1️1️ GLightbox Init
   */
  const glightbox = GLightbox({ selector: ".glightbox" });
})();

/**
 * -------------------------------------------------------------------------------------------
 * CUSTOM PAGE LOGIC
 * -------------------------------------------------------------------------------------------
 */
document.addEventListener("DOMContentLoaded", () => {
  // --- Water Analysis Form Validation ---
  const reportForm = document.getElementById("reportForm");
  if (reportForm) {
    reportForm.addEventListener("submit", (event) => {
      const fileInput = document.getElementById("fileAttachment");
      const file = fileInput?.files[0];
      const maxFileSize = 2 * 1024 * 1024;

      if (file && file.size > maxFileSize) {
        alert("The selected file exceeds 2MB. Please choose a smaller one.");
        event.preventDefault();
        return;
      }

      const requiredFields = [...document.querySelectorAll("[required]")];
      const unfilled = requiredFields.some((field) => !field.value.trim());
      if (unfilled) {
        alert("Please fill all required fields.");
        event.preventDefault();
      }
    });
  }

  // --- WhatsApp Button Logic ---
  const whatsAppButton = document.getElementById("whatsapp-button");
  if (whatsAppButton) {
    const phoneNumber = "254710869870";
    const message = encodeURIComponent("Hello! Norwa, I need your support.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    whatsAppButton.addEventListener("click", () => window.open(whatsappUrl, "_blank"));

    whatsAppButton.addEventListener("mouseenter", () => {
      document.body.classList.add("link-cursor");
    });
    whatsAppButton.addEventListener("mouseleave", () => {
      document.body.classList.remove("link-cursor");
    });
  }
});
