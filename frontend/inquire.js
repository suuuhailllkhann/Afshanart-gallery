const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let currentProduct = null;

if (productId) {
  document.getElementById("inquire-image").style.viewTransitionName = "product-img-" + productId;
}

async function loadProduct() {
  const loadingEl = document.getElementById("inquire-loading");
  const contentEl = document.getElementById("inquire-content");
  const notFoundEl = document.getElementById("inquire-notfound");

  if (!productId) {
    loadingEl.hidden = true;
    notFoundEl.hidden = false;
    return;
  }

  const { data, error } = await supabaseClient.from("products").select("*").eq("id", productId).maybeSingle();
  loadingEl.hidden = true;

  if (error || !data) {
    notFoundEl.hidden = false;
    return;
  }

  currentProduct = data;
  document.getElementById("inquire-image").src = data.image_url;
  document.getElementById("inquire-category").textContent = data.category;
  document.getElementById("inquire-title").textContent = data.title;
  document.getElementById("inquire-price").textContent = "AED " + data.price;
  const descEl = document.getElementById("inquire-description");
  descEl.textContent = data.description || "";
  descEl.hidden = !data.description;
  document.getElementById("inquire-sold-out").hidden = !data.sold_out;
  contentEl.hidden = false;
}

document.getElementById("inquire-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusEl = document.getElementById("inquire-status");
  const submitBtn = e.target.querySelector(".inquire-submit");
  statusEl.textContent = "";
  submitBtn.disabled = true;

  const payload = {
    product_id: currentProduct?.id || null,
    product_title: currentProduct?.title || "Unknown painting",
    name: document.getElementById("inquire-name").value.trim(),
    email: document.getElementById("inquire-email").value.trim(),
    phone: document.getElementById("inquire-phone").value.trim(),
    message: document.getElementById("inquire-message").value.trim(),
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-inquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Something went wrong. Please try again.");
    }
    document.getElementById("inquire-form").hidden = true;
    document.getElementById("inquire-success").hidden = false;
  } catch (err) {
    statusEl.textContent = err.message;
    submitBtn.disabled = false;
  }
});

loadProduct();
