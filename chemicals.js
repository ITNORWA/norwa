document.addEventListener("DOMContentLoaded", function () {
  const sections      = document.querySelectorAll(".wtc-section");
  const subsections   = document.querySelectorAll(".wtc-subsection");
  const mainLinks     = document.querySelectorAll(".wtc-nav-link");
  const subLinks      = document.querySelectorAll(".wtc-nav-sublink");
  const sidebarToggle = document.getElementById("wtcSidebarToggle");
  const sidebarCard   = document.getElementById("wtcSidebarCard");
  const navItems      = document.querySelectorAll(".wtc-nav-item");

  // Show ONLY one subsection and its parent section (single-view)
  function showOnlySubsection(articleId) {
    const target = document.getElementById(articleId);
    if (!target) return;

    // 1) Section visibility + single-view mode
    sections.forEach(sec => {
      const contains = sec.contains(target);
      sec.style.display = contains ? "block" : "none";
      sec.classList.toggle("is-active", contains);
      sec.classList.toggle("single-view", contains);
    });

    // 2) Only this article is visible
    subsections.forEach(art => {
      art.style.display = (art === target) ? "block" : "none";
    });

    // 3) Sidebar active states
    subLinks.forEach(btn => {
      btn.classList.toggle("sub-active", btn.dataset.target === articleId);
    });

    mainLinks.forEach(btn => {
      const secId = btn.dataset.section;
      if (!secId) return;
      const secEl = document.getElementById(secId);
      const isParent = secEl && secEl.contains(target);
      btn.classList.toggle("is-active", isParent);
    });

    // 4) Scroll to card
    const rect = target.getBoundingClientRect();
    const y = rect.top + window.pageYOffset - 110;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  // ----- DEFAULT VIEW: first subsection under "Chemicals" -----
  const defaultSub = document.querySelector("#chemicals .wtc-subsection");
  if (defaultSub) {
    showOnlySubsection(defaultSub.id);
    const defaultItem = document.querySelector('.wtc-nav-link[data-section="chemicals"]');
    if (defaultItem) {
      const parent = defaultItem.closest(".wtc-nav-item");
      if (parent) parent.classList.add("is-open");   // open Chemicals dropdown
    }
  }

  // ----- MAIN LINKS (Chemicals / Media / Accessories / Chemical Dosers) -----
  mainLinks.forEach(btn => {
    btn.addEventListener("click", () => {
      const secId = btn.dataset.section;
      if (!secId) return;

      const parentItem = btn.closest(".wtc-nav-item");

      // collapse all nav groups except this one
      navItems.forEach(item => {
        item.classList.toggle("is-open", item === parentItem);
      });

      // pick first sublink in this group, if any
      let firstSubLink = parentItem ? parentItem.querySelector(".wtc-nav-sublink") : null;

      if (firstSubLink && firstSubLink.dataset.target) {
        showOnlySubsection(firstSubLink.dataset.target);
      } else {
        // fallback: first subsection inside that section
        const firstSubsection = document.querySelector("#" + secId + " .wtc-subsection");
        if (firstSubsection) showOnlySubsection(firstSubsection.id);
      }

      // close sidebar on mobile
      if (window.innerWidth < 993 && sidebarCard) {
        sidebarCard.classList.remove("is-open");
      }
    });
  });

  // ----- SUB LINKS (Disinfectants, Iron removal, etc.) -----
  subLinks.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;

      // make sure this nav group is open and others are closed
      const parentItem = btn.closest(".wtc-nav-item");
      navItems.forEach(item => {
        item.classList.toggle("is-open", item === parentItem);
      });

      showOnlySubsection(targetId);

      if (window.innerWidth < 993 && sidebarCard) {
        sidebarCard.classList.remove("is-open");
      }
    });
  });

  // ----- Mobile sidebar toggle -----
  if (sidebarToggle && sidebarCard) {
    sidebarToggle.addEventListener("click", () => {
      sidebarCard.classList.toggle("is-open");
    });
  }
});