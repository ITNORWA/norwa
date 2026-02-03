(() => {
  const cfg = window.NORWA_SANITY;
  if (!cfg || !cfg.projectId || cfg.projectId === "YOUR_PROJECT_ID") {
    console.warn("Sanity config missing.");
    return;
  }

  const titleEl = document.getElementById("blog-title");
  const metaEl = document.getElementById("blog-meta");
  const coverEl = document.getElementById("blog-cover");
  const mediaEl = document.getElementById("blog-media");
  const mediaSectionEl = document.querySelector(".blog-media-section");
  const suggestionsEl = document.getElementById("blog-video-suggestions");
  const relatedSectionEl = document.querySelector(".blog-related-videos");
  const contentEl = document.getElementById("blog-content");

  const getSlug = () => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("slug");
    if (fromQuery) return fromQuery;
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts.length >= 2 && parts[0] === "blog") return parts[1];
    return null;
  };

  const buildQueryUrl = (query) => {
    const base = `https://${cfg.projectId}.api.sanity.io/v${cfg.apiVersion}/data/query/${cfg.dataset}`;
    const params = new URLSearchParams({
      query,
      perspective: "published",
    });
    return `${base}?${params.toString()}`;
  };

  const slug = getSlug();
  if (!slug) {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    const fallback = isLocal ? "blog.html" : "/blog";
    window.location.href = fallback;
    return;
  }

  const baseFilter = `_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))`;
  const query = `{
    "post": *[${baseFilter} && slug.current == "${slug}"][0]{
      title,
      publishedAt,
      excerpt,
      "coverImage": mainImage.asset->url,
      "metaTitle": metaTitle,
      "metaDescription": metaDescription,
      "ogImage": ogImage.asset->url,
      videoUrl,
      "videoFile": videoFile.asset->url,
      body
    },
    "videos": *[${baseFilter} && (defined(videoUrl) || defined(videoFile.asset)) && slug.current != "${slug}"] | order(publishedAt desc) [0..2]{
      title,
      publishedAt,
      excerpt,
      "slug": slug.current,
      "coverImage": mainImage.asset->url
    }
  }`;

  const calcReadMinutes = (body) => {
    if (!Array.isArray(body)) return 1;
    const text = body
      .filter((block) => block && block._type === "block")
      .map((block) => (block.children || []).map((c) => c.text || "").join(" "))
      .join(" ");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const renderPortableText = (body) => {
    if (!Array.isArray(body)) return "";
    return body
      .map((block) => {
        if (block._type === "block") {
          const text = block.children.map((c) => c.text).join("");
          const tag =
            block.style === "h2" ? "h2" : block.style === "h3" ? "h3" : "p";
          return `<${tag}>${text}</${tag}>`;
        }
        return "";
      })
      .join("");
  };

  const escapeHtml = (value) => {
    if (!value) return "";
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  const buildEmbed = (url) => {
    if (!url) return null;
    const youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    );
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return null;
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  fetch(buildQueryUrl(query), { signal: controller.signal })
    .then((res) => res.json())
    .then(({ result }) => {
      clearTimeout(timer);
      const post = result?.post;
      if (!post) {
        contentEl.innerHTML = "<p>Post not found.</p>";
        return;
      }

      if (post.metaTitle) document.title = post.metaTitle;
      if (post.metaDescription) {
        const meta = document.querySelector("meta[name='description']");
        if (meta) meta.setAttribute("content", post.metaDescription);
      }
      if (post.ogImage) {
        const og = document.querySelector("meta[property='og:image']");
        if (og) og.setAttribute("content", post.ogImage);
      }

      titleEl.textContent = post.title || "";
      const dateText = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "";
      const readMinutes = calcReadMinutes(post.body);
      metaEl.textContent = `${dateText}${dateText ? " | " : ""}${readMinutes} min read`;

      if (post.coverImage) {
        if (coverEl) {
          coverEl.src = post.coverImage;
          coverEl.alt = post.title || "";
        }
      } else if (coverEl) {
        coverEl.style.display = "none";
      }

      let mediaHtml = "";
      if (post.videoFile) {
        mediaHtml = `
          <div class="blog-video">
            <video controls preload="metadata" src="${post.videoFile}"></video>
          </div>
        `;
      } else if (post.videoUrl) {
        const embed = buildEmbed(post.videoUrl);
        if (embed) {
          mediaHtml = `
            <div class="blog-video">
              <iframe src="${embed}" title="Video" frameborder="0" allowfullscreen></iframe>
            </div>
          `;
        } else {
          mediaHtml = `
            <div class="blog-video">
              <video controls preload="metadata" src="${post.videoUrl}"></video>
            </div>
          `;
        }
      }

      if (mediaEl) {
        mediaEl.innerHTML = mediaHtml;
      }

      if (mediaSectionEl && !mediaHtml) {
        mediaSectionEl.style.display = "none";
      }

      const summary = post.excerpt
        ? escapeHtml(post.excerpt)
        : "A concise summary of the work goes here. Use this space to explain the purpose, timeline, and impact in two or three short sentences.";
      const publishedText = dateText || "Recent update";
      contentEl.innerHTML = renderPortableText(post.body);

      if (suggestionsEl) {
        const videos = result?.videos || [];
        if (!videos.length) {
          if (relatedSectionEl) relatedSectionEl.style.display = "none";
        } else {
          suggestionsEl.innerHTML = "";
          videos.forEach((video) => {
            const href = `blog-details.html?slug=${video.slug}`;
            const img = video.coverImage || "assets/img/blog/blog-1.jpg";
            const date = video.publishedAt
              ? new Date(video.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "";
            const card = document.createElement("article");
            card.className = "blog-video-card";
            card.innerHTML = `
              <a class="blog-video-thumb" href="${href}">
                <img src="${img}" alt="${video.title || "Video"}" loading="lazy">
              </a>
              <div class="blog-video-body">
                <p class="blog-video-meta">${date}</p>
                <h4>${video.title || "Watch the full breakdown"}</h4>
                <p>${video.excerpt || "A quick walkthrough from the field."}</p>
                <a href="${href}" class="blog-row-cta">Watch now <i class="bi bi-play-circle"></i></a>
              </div>
            `;
            suggestionsEl.appendChild(card);
          });
        }
      }
    })
    .catch(() => {
      clearTimeout(timer);
      contentEl.innerHTML = "<p>Unable to load post.</p>";
    });
})();
