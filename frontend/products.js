async function renderProducts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML = `<p class="text-center">Couldn't load paintings right now.</p>`;
    console.error(error);
    return;
  }

  container.innerHTML = data
    .map(
      (p, i) => `
    <a href="inquire.html?id=${p.id}" class="pro" data-aos="zoom-out" data-aos-delay="200" data-product-id="${p.id}">
        <div class="pro-imgbox">
            <img src="${p.image_url}" alt="${p.title}" loading="${i < 3 ? "eager" : "lazy"}" decoding="async">
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
    </a>`
    )
    .join("");

  container.querySelectorAll(".pro").forEach((card) => {
    const img = card.querySelector(".pro-imgbox img");
    img.style.viewTransitionName = "product-img-" + card.dataset.productId;
  });

  if (window.AOS) AOS.refreshHard();
}
