async function renderBlogPosts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { data, error } = await supabaseClient
    .from("blog_posts")
    .select("*")
    .order("post_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML = `<p class="text-center">Couldn't load posts right now.</p>`;
    console.error(error);
    return;
  }

  container.innerHTML = data
    .map((b, i) => {
      const images = [b.image_url, b.image_url_2].filter(Boolean);
      const loadAttr = i < 2 ? "eager" : "lazy";
      const imgHtml = images.length
        ? `<div class="press-imgbox${images.length > 1 ? " has-two" : ""}">
            ${images.map((src) => `<img src="${src}" alt="${b.title}" loading="${loadAttr}" decoding="async">`).join("")}
          </div>`
        : "";

      const links = [
        b.link_url ? { url: b.link_url, label: b.link_label || "Know more" } : null,
        b.link2_url ? { url: b.link2_url, label: b.link2_label || "Know more" } : null,
      ].filter(Boolean);

      let linksHtml = "";
      if (links.length === 1) {
        linksHtml = `<div class="press-links"><a href="${links[0].url}" target="_blank" rel="noopener">Know more</a></div>`;
      } else if (links.length > 1) {
        const options = links
          .map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`)
          .join("");
        linksHtml = `<div class="press-links">
            <span class="press-more-btn" role="button" tabindex="0">Know more</span>
            <div class="press-link-options" hidden>${options}</div>
          </div>`;
      }

      return `
        <div class="press-card" data-aos="fade-in" data-aos-delay="100">
            ${imgHtml}
            <div class="press-body">
                ${b.subtitle ? `<span class="press-date">${b.subtitle}</span>` : ""}
                <h3>${b.title}</h3>
                ${b.description ? `<p>${b.description}</p>` : ""}
                ${linksHtml}
            </div>
        </div>`;
    })
    .join("");

  const THEME_ACCENTS = {
    "theme-elegant-script": { bg: "#a67c52", hover: "#8a6440" },
    "theme-terracotta": { bg: "#c1592f", hover: "#a3491f" },
    "theme-teal": { bg: "#1a8c7d", hover: "#146b60" },
  };
  const activeTheme = [...document.body.classList].find((cls) => THEME_ACCENTS[cls]);
  const accent = activeTheme ? THEME_ACCENTS[activeTheme] : { bg: "darkmagenta", hover: "#6e0070" };

  container.querySelectorAll(".press-more-btn").forEach((btn) => {
    btn.style.backgroundColor = accent.bg;
    btn.addEventListener("mouseenter", () => (btn.style.backgroundColor = accent.hover));
    btn.addEventListener("mouseleave", () => (btn.style.backgroundColor = accent.bg));

    const reveal = () => {
      btn.hidden = true;
      btn.nextElementSibling.hidden = false;
    };
    btn.addEventListener("click", reveal);
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        reveal();
      }
    });
  });

  if (window.AOS) AOS.refreshHard();
}
