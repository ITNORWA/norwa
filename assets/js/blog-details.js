(() => {
  const cfg = window.NORWA_SANITY;
  if (!cfg || !cfg.projectId || cfg.projectId === "YOUR_PROJECT_ID") {
    console.warn("Sanity config missing.");
    return;
  }

  const titleEl = document.getElementById("blog-title");
  const metaEl = document.getElementById("blog-meta");
  const coverEl = document.getElementById("blog-cover");
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
      useCdn: "true",
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

  const query = `*[_type == "post" && slug.current == "${slug}" && !(_id in path("drafts.**"))][0]{
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
    return body.map((block) => {
      if (block._type === 'block') {
        const text = block.children.map(c => c.text).join('');
        const tag = block.style === 'h2' ? 'h2' : block.style === 'h3' ? 'h3' : 'p';
        return `<${tag}>${text}</${tag}>`;
      }
      return "";
    }).join('');
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
    .then(res => res.json())
    .then(({ result }) => {
      clearTimeout(timer);
      if (!result) {
        contentEl.innerHTML = "<p>Post not found.</p>";
        return;
      }

      if (result.metaTitle) document.title = result.metaTitle;
      if (result.metaDescription) {
        const meta = document.querySelector("meta[name='description']");
        if (meta) meta.setAttribute("content", result.metaDescription);
      }
      if (result.ogImage) {
        const og = document.querySelector("meta[property='og:image']");
        if (og) og.setAttribute("content", result.ogImage);
      }

      titleEl.textContent = result.title || "";
      const dateText = result.publishedAt
        ? new Date(result.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "";
      const readMinutes = calcReadMinutes(result.body);
      metaEl.textContent = `${dateText}${dateText ? " • " : ""}${readMinutes} min read`;
      if (result.coverImage) {
        coverEl.src = result.coverImage;
        coverEl.alt = result.title || "";
      } else {
        coverEl.style.display = "none";
      }

      let videoHtml = "";
      if (result.videoFile) {
        videoHtml = `
          <div class="blog-video">
            <video controls preload="metadata" src="${result.videoFile}"></video>
          </div>
        `;
      } else if (result.videoUrl) {
        const embed = buildEmbed(result.videoUrl);
        if (embed) {
          videoHtml = `
            <div class="blog-video">
              <iframe src="${embed}" title="Video" frameborder="0" allowfullscreen></iframe>
            </div>
          `;
        } else {
          videoHtml = `
            <div class="blog-video">
              <video controls preload="metadata" src="${result.videoUrl}"></video>
            </div>
          `;
        }
      }

      contentEl.innerHTML = `${videoHtml}${renderPortableText(result.body)}`;
    })
    .catch(() => {
      clearTimeout(timer);
      contentEl.innerHTML = "<p>Unable to load post.</p>";
    });
})();
