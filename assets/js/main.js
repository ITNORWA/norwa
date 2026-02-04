/**
 * Optimized Script — Reduced Forced Reflows + Layout Shifts
 * Applies batching, throttling, and safe DOM reads/writes.
 */

(function () {
  "use strict";

  /**
   * Fix malformed hrefs (e.g., \"blog.html\") introduced in some nav items
   */
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const cleaned = href.replace(/\\+/g, "").replace(/^"+|"+$/g, "");
    if (cleaned !== href) link.setAttribute("href", cleaned);
  });

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
  // (Blog routing fix removed to avoid redirect loops on Cloudflare Pages preview URLs)

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

  // --- Contact Map Controls ---
  const contactMapFrame = document.getElementById("contact-map-frame");
  if (contactMapFrame) {
    const mapSelect = document.getElementById("contact-map-select");
    const mapJump = document.getElementById("contact-map-jump");

    const setMapQuery = (query) => {
      if (!query) return;
      const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
      contactMapFrame.src = embedUrl;
    };

    if (mapJump && mapSelect) {
      mapJump.addEventListener("click", () => setMapQuery(mapSelect.value));
    }
  }

  // --- Footer Locations Map Modal ---
  const locationLinks = document.querySelectorAll(".location-list a");
  if (locationLinks.length) {
    let modal = document.getElementById("location-map-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "location-map-modal";
      modal.className = "location-map-modal";
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `
        <div class="location-modal-dialog" role="dialog" aria-modal="true" aria-label="Location map">
          <div class="location-modal-header">
            <h5 class="location-modal-title">Location</h5>
            <div class="location-modal-actions">
              <select class="location-modal-select" aria-label="Other locations"></select>
              <button type="button" class="location-modal-jump">Search location</button>
              <button type="button" class="location-modal-close" aria-label="Close map">×</button>
            </div>
          </div>
          <div class="location-modal-body">
            <iframe title="Location map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const modalTitle = modal.querySelector(".location-modal-title");
    const modalFrame = modal.querySelector("iframe");
    const modalClose = modal.querySelector(".location-modal-close");
    const modalSelect = modal.querySelector(".location-modal-select");
    const modalJump = modal.querySelector(".location-modal-jump");

    const buildEmbedUrl = (href) => {
      try {
        const url = new URL(href);
        const query = url.searchParams.get("query") || url.searchParams.get("q");
        if (query) {
          return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
        }
      } catch (err) {
        // Fallback to raw href if URL parsing fails.
      }
      return `https://www.google.com/maps?q=${encodeURIComponent(href)}&output=embed`;
    };

    const openModal = (embedUrl, label, activeIndex) => {
      if (modalTitle) modalTitle.textContent = label || "Location";
      if (modalFrame) modalFrame.src = embedUrl;
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      if (modalSelect && typeof activeIndex === "number") {
        modalSelect.value = String(activeIndex);
      }
    };

    const closeModal = () => {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      if (modalFrame) modalFrame.src = "";
      document.body.classList.remove("modal-open");
    };

    const locationItems = Array.from(locationLinks).map((link) => ({
      href: link.href,
      label: link.textContent.trim(),
    }));

    locationLinks.forEach((link, index) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const embedUrl = buildEmbedUrl(link.href);
        const label = link.textContent.trim();
        openModal(embedUrl, label, index);
      });
    });

    if (modalSelect) {
      modalSelect.innerHTML = locationItems
        .map((item, index) => `<option value="${index}">${item.label}</option>`)
        .join("");
    }

    if (modalJump && modalSelect) {
      modalJump.addEventListener("click", () => {
        const index = Number(modalSelect.value);
        if (Number.isNaN(index) || !locationItems[index]) return;
        const target = locationItems[index];
        const embedUrl = buildEmbedUrl(target.href);
        openModal(embedUrl, target.label, index);
      });
    }

    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    if (modalClose) modalClose.addEventListener("click", closeModal);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });
  }
});
