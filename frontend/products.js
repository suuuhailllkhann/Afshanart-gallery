async function renderProducts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let { data, error } = await supabaseClient
    .from("products")
    .select("*, product_images(image_url, sort_order)")
    .order("created_at", { ascending: false });

  if (error) {
    // product_images may not exist yet if the migration hasn't been run —
    // fall back to a plain query so the Shop page still works either way.
    console.error("product_images join failed, falling back:", error);
    ({ data, error } = await supabaseClient
      .from("products")
      .select("*")
      .order("created_at", { ascending: false }));
  }

  if (error) {
    container.innerHTML = `<p class="text-center">Couldn't load paintings right now.</p>`;
    console.error(error);
    return;
  }

  container.innerHTML = data
    .map((p, i) => {
      const extra = (p.product_images || [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((pi) => pi.image_url);
      const slides = [p.image_url, ...extra];
      const dotsHtml = slides.length > 1 ? `<div class="carousel-dots"></div>` : "";

      return `
    <a href="inquire.html?id=${p.id}" class="pro" data-aos="zoom-out" data-aos-delay="200" data-product-id="${p.id}" data-slides='${JSON.stringify(slides)}'>
        <div class="pro-imgbox">
            <img src="${p.image_url}" alt="${p.title}" loading="${i < 3 ? "eager" : "lazy"}" decoding="async">
            ${dotsHtml}
            ${p.sold_out ? `<span class="pro-sold">Sold out</span>` : ""}
        </div>
        <div class="pro-body">
            <span class="pro-cat">${p.category}</span>
            <h5>${p.title}</h5>
            <div class="star">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
            </div>
            ${p.description ? `<p class="pro-desc">${p.description}</p>` : ""}
            <div class="pro-bottom">
                <span class="pro-price">AED ${p.price}</span>
                <span class="pro-cart">Inquire</span>
            </div>
        </div>
    </a>`;
    })
    .join("");

  container.querySelectorAll(".pro").forEach((card) => {
    const img = card.querySelector(".pro-imgbox img");
    img.style.viewTransitionName = "product-img-" + card.dataset.productId;

    const slides = JSON.parse(card.dataset.slides || "[]");
    const dots = card.querySelector(".carousel-dots");
    attachCarousel(img, dots, slides);
  });

  if (window.AOS) AOS.refreshHard();
}
