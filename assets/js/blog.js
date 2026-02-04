(() => {
  const cfg = window.NORWA_SANITY;
  if (!cfg || !cfg.projectId || cfg.projectId === "YOUR_PROJECT_ID") {
    console.warn("Sanity config missing.");
    return;
  }

  const listEl = document.getElementById("blog-list");
  const pageInfoEl = document.getElementById("blog-page-info");
  const videoGridEl = document.getElementById("blog-video-grid");
  const videoStripEl = document.querySelector(".blog-video-strip");
  const pagerEl = document.getElementById("blog-pagination");
  const perPage = 6;

  const getPage = () => {
    const params = new URLSearchParams(window.location.search);
    const p = parseInt(params.get("page") || "1", 10);
    return Number.isNaN(p) || p < 1 ? 1 : p;
  };

  const buildQueryUrl = (query) => {
    const base = `https://${cfg.projectId}.api.sanity.io/v${cfg.apiVersion}/data/query/${cfg.dataset}`;
    const params = new URLSearchParams({
      query,
      perspective: "published",
    });
    return `${base}?${params.toString()}`;
  };

  const renderPosts = (posts) => {
    listEl.innerHTML = "";
    const calcReadMinutes = (body) => {
      if (!Array.isArray(body)) return 1;
      const text = body
        .filter((block) => block && block._type === "block")
        .map((block) => (block.children || []).map((c) => c.text || "").join(" "))
        .join(" ");
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(1, Math.ceil(words / 200));
      return minutes;
    };

    const formatDate = (value) => {
      if (!value) return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "";
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    };

    if (!posts.length) {
      listEl.innerHTML = "<p style='text-align:center;'>No posts available yet.</p>";
      return;
    }

    const focusTags = [
      "Borehole",
      "Water Treatment",
      "Solar Pumping",
      "Operations",
      "Water Quality",
      "Community Projects",
    ];
    const extraCopy = [
      "We break down the decisions, the costs, and the real-world results.",
      "Expect practical steps, quick wins, and maintenance tips that stick.",
      "Here is what worked, what did not, and what we would do next time.",
    ];

    const fallbackImage = "assets/img/education/wholehousefiltration.png";
    const videoPosts = posts.filter((post) => post.videoUrl || post.videoFile);
    const featuredVideos = videoPosts.slice(0, 3);
    const featuredVideoSlugs = new Set(featuredVideos.map((post) => post.slug));

    if (videoGridEl) {
      if (!featuredVideos.length) {
        if (videoStripEl) videoStripEl.style.display = "none";
      } else {
        if (videoStripEl) videoStripEl.style.display = "";
        videoGridEl.innerHTML = "";
        featuredVideos.forEach((post) => {
          const href = `/blog-details.html?slug=${post.slug}`;
          const img = post.coverImage || fallbackImage;
          const dateText = formatDate(post.publishedAt);
          const readMinutes = calcReadMinutes(post.body);
          const card = document.createElement("article");
          card.className = "blog-video-card";
          card.innerHTML = `
            <a class="blog-video-thumb" href="${href}">
              <img src="${img}" alt="${post.title}" loading="lazy">
            </a>
            <div class="blog-video-body">
              <p class="blog-video-meta">${dateText} | ${readMinutes} min</p>
              <h4>${post.title}</h4>
              <p>${post.excerpt || "Watch the full breakdown inside."}</p>
              <a href="${href}" class="blog-row-cta">Watch now <i class="bi bi-play-circle"></i></a>
            </div>
          `;
          videoGridEl.appendChild(card);
        });
      }
    }

    const listPosts = posts.filter((post) => !featuredVideoSlugs.has(post.slug));

    if (!listPosts.length) {
      listEl.innerHTML = "<p style='text-align:center;'>No posts available yet.</p>";
      return;
    }

    listPosts.forEach((post, index) => {
      const href = `/blog-details.html?slug=${post.slug}`;
      const img = post.coverImage || fallbackImage;
      const dateText = formatDate(post.publishedAt);
      const readMinutes = calcReadMinutes(post.body);
      const focus = focusTags[index % focusTags.length];
      const extra = extraCopy[index % extraCopy.length];
      const snippet = post.excerpt
        ? `${post.excerpt} ${extra}`
        : `A quick preview of the post. ${extra}`;
      const card = document.createElement("article");
      card.className = "blog-row-card";
      card.setAttribute("data-aos", "fade-up");
      card.setAttribute("data-aos-delay", index * 60);
      card.innerHTML = `
        <div class="blog-row">
          <a class="blog-hex" href="${href}" aria-label="${post.title}">
            <img src="${img}" alt="${post.title}" loading="lazy">
          </a>
          <div class="blog-row-body">
            <div class="blog-row-meta">
              <span class="blog-row-date">${dateText}</span>
              <span class="blog-row-tag">Focus: ${focus}</span>
              <span class="blog-row-read"><i class="bi bi-clock"></i> ${readMinutes} min read</span>
            </div>
            <h3><a href="${href}">${post.title}</a></h3>
            <p>${snippet}</p>
            <a class="blog-row-cta" href="${href}">
              Read More <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });
  };

  const renderPagination = (page, total) => {
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    pagerEl.innerHTML = "";
    if (pageInfoEl) {
      const nextPage = Math.min(totalPages, page + 1);
      const nextLink =
        page < totalPages
          ? `<a href="?page=${nextPage}">Next</a>`
          : `<span class="disabled">Next</span>`;
      pageInfoEl.innerHTML = `Page ${page} of ${totalPages} ${nextLink}`;
    }
    const prev = document.createElement("a");
    prev.href = `?page=${Math.max(1, page - 1)}`;
    prev.innerHTML = `<i class="bi bi-chevron-left"></i>`;
    prev.setAttribute("aria-label", "Previous");
    prev.className = page === 1 ? "disabled" : "";

    const next = document.createElement("a");
    next.href = `?page=${Math.min(totalPages, page + 1)}`;
    next.innerHTML = `<i class="bi bi-chevron-right"></i>`;
    next.setAttribute("aria-label", "Next");
    next.className = page === totalPages ? "disabled" : "";

    const info = document.createElement("span");
    info.textContent = `Page ${page} of ${totalPages}`;

    pagerEl.appendChild(prev);
    pagerEl.appendChild(info);
    pagerEl.appendChild(next);
  };

  const load = async () => {
    const page = getPage();
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const baseFilter = `_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))`;
    const query = `{
      "total": count(*[${baseFilter}]),
      "posts": *[${baseFilter}] | order(publishedAt desc) [${from}..${to}] {
        title,
        "slug": slug.current,
        excerpt,
        "coverImage": mainImage.asset->url,
        publishedAt,
        videoUrl,
        "videoFile": videoFile.asset->url,
        body
      }
    }`;

    try {
      listEl.innerHTML =
        '<div style="text-align:center; width:100%; padding: 50px;"><div class="spinner-border text-success" role="status"></div></div>';
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(buildQueryUrl(query), { signal: controller.signal });
      clearTimeout(timer);
      const json = await res.json();
      if (!json.result) throw new Error("No results");
      renderPosts(json.result.posts || []);
      renderPagination(page, json.result.total || 0);
    } catch (err) {
      console.error(err);
      listEl.innerHTML = "<p>Unable to load posts.</p>";
    }
  };

  if (listEl && pagerEl) load();
})();
