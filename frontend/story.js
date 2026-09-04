async function renderStory(quoteId, bodyId) {
  const quoteEl = document.getElementById(quoteId);
  const bodyEl = document.getElementById(bodyId);
  if (!quoteEl || !bodyEl) return;

  const { data, error } = await supabaseClient.from("story_content").select("*").eq("id", 1).maybeSingle();

  if (error || !data) {
    quoteEl.textContent = "";
    bodyEl.innerHTML = `<h4>Couldn't load this page right now.</h4>`;
    console.error(error);
    return;
  }

  quoteEl.textContent = `" ${data.quote} "`;
  bodyEl.innerHTML = (data.body || "")
    .split(/\n\s*\n/)
    .map((paragraph) => `<h4>${paragraph.trim()}</h4>`)
    .join("");

  if (window.AOS) AOS.refreshHard();
}

async function renderStoryPhoto(selectors) {
  const { data, error } = await supabaseClient.from("story_content").select("photo_url").eq("id", 1).maybeSingle();
  if (error || !data?.photo_url) return;
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((img) => (img.src = data.photo_url));
  });
}

async function renderTheme() {
  const { data, error } = await supabaseClient.from("story_content").select("theme").eq("id", 1).maybeSingle();
  if (error || !data?.theme || data.theme === "classic") return;
  document.body.classList.add("theme-" + data.theme);
}
