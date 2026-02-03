(() => {
  const cfg = window.NORWA_SANITY;
  if (!cfg || !cfg.projectId || cfg.projectId === "YOUR_PROJECT_ID") {
    console.warn("Sanity config missing.");
    return;
  }

  const listEl = document.getElementById("blog-list");
  const pagerEl = document.getElementById("blog-pagination");
  const perPage = 6;

  const getPage = () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    if (slug) {
      const target = `blog-details.html?slug=${encodeURIComponent(slug)}`;
      window.location.href = target;
      return 1;
    }
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
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    posts.forEach((post) => {
      const href = `blog-details.html?slug=${post.slug}`;
      const img = post.coverImage || "assets/img/placeholder.webp";
      const dateText = formatDate(post.publishedAt);
      const readMinutes = calcReadMinutes(post.body);
      const card = document.createElement("article");
      card.className = "blog-card";
      card.innerHTML = `
        <a class="blog-card-image" href="${href}">
          <img src="${img}" alt="${post.title}" loading="lazy">
        </a>
        <div class="blog-card-body">
          <div class="blog-card-meta">${dateText}${dateText ? " • " : ""}${readMinutes} min read</div>
          <h3><a href="${href}">${post.title}</a></h3>
          <p>${post.excerpt || ""}</p>
          <a class="blog-card-link" href="${href}">Read more</a>
        </div>
      `;
      listEl.appendChild(card);
    });
  };

  const renderPagination = (page, total) => {
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    pagerEl.innerHTML = "";
    const prev = document.createElement("a");
    prev.href = `?page=${Math.max(1, page - 1)}`;
    prev.textContent = "Prev";
    prev.className = page === 1 ? "disabled" : "";

    const next = document.createElement("a");
    next.href = `?page=${Math.min(totalPages, page + 1)}`;
    next.textContent = "Next";
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
        body
      }
    }`;

    try {
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
