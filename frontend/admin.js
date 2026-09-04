const loginView = document.getElementById("login-view");
const dashboardView = document.getElementById("dashboard-view");
const logoutBtn = document.getElementById("logout-btn");

// ------------------------------------------------------------
// Confirm dialog (replaces window.confirm, which some embedded/
// preview browsers silently auto-cancel instead of prompting).
// ------------------------------------------------------------
const confirmOverlay = document.getElementById("confirm-overlay");
const confirmMessage = document.getElementById("confirm-message");
const confirmOkBtn = document.getElementById("confirm-ok");
const confirmCancelBtn = document.getElementById("confirm-cancel");

function confirmDialog(message) {
  return new Promise((resolve) => {
    confirmMessage.textContent = message;
    confirmOverlay.hidden = false;

    const cleanup = (result) => {
      confirmOverlay.hidden = true;
      confirmOkBtn.removeEventListener("click", onOk);
      confirmCancelBtn.removeEventListener("click", onCancel);
      confirmOverlay.removeEventListener("click", onOverlayClick);
      resolve(result);
    };
    const onOk = () => cleanup(true);
    const onCancel = () => cleanup(false);
    const onOverlayClick = (e) => {
      if (e.target === confirmOverlay) cleanup(false);
    };

    confirmOkBtn.addEventListener("click", onOk);
    confirmCancelBtn.addEventListener("click", onCancel);
    confirmOverlay.addEventListener("click", onOverlayClick);
  });
}

async function refreshSession() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    loginView.hidden = true;
    dashboardView.hidden = false;
    logoutBtn.hidden = false;
    loadPanel("shop");
  } else {
    loginView.hidden = false;
    dashboardView.hidden = true;
    logoutBtn.hidden = true;
  }
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");
  errorEl.hidden = true;

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    errorEl.textContent = error.message;
    errorEl.hidden = false;
    return;
  }
  await refreshSession();
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  await refreshSession();
});

// ------------------------------------------------------------
// Tabs
// ------------------------------------------------------------
const tabButtons = document.querySelectorAll(".tab-btn");
const panels = {
  shop: document.getElementById("panel-shop"),
  blog: document.getElementById("panel-blog"),
  story: document.getElementById("panel-story"),
  inquiries: document.getElementById("panel-inquiries"),
};

function loadPanel(name) {
  tabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.panel === name));
  Object.entries(panels).forEach(([key, el]) => (el.hidden = key !== name));
  if (name === "shop") loadProducts();
  if (name === "blog") loadBlogPosts();
  if (name === "story") loadStory();
  if (name === "inquiries") loadInquiries();
}

tabButtons.forEach((btn) => btn.addEventListener("click", () => loadPanel(btn.dataset.panel)));

// ------------------------------------------------------------
// Shared helpers
// ------------------------------------------------------------
async function uploadImage(file, folder) {
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  const { error } = await supabaseClient.storage.from("gallery-images").upload(path, file);
  if (error) throw error;
  const { data } = supabaseClient.storage.from("gallery-images").getPublicUrl(path);
  return data.publicUrl;
}

function setStatus(el, message, isError) {
  el.textContent = message;
  el.className = "status-text" + (isError ? " error-text" : " success-text");
  if (message) setTimeout(() => (el.textContent = ""), 4000);
}

// ------------------------------------------------------------
// SHOP
// ------------------------------------------------------------
const productForm = document.getElementById("product-form");
const productIdField = document.getElementById("product-id");
const productExistingImage = document.getElementById("product-existing-image");
const productImagePreview = document.getElementById("product-image-preview");
const productCancelBtn = document.getElementById("product-cancel");

async function loadProducts() {
  const list = document.getElementById("product-list");
  list.textContent = "Loading...";
  const { data, error } = await supabaseClient.from("products").select("*").order("created_at", { ascending: false });
  if (error) {
    list.textContent = "Error loading products: " + error.message;
    return;
  }
  list.innerHTML = "";
  data.forEach((p) => {
    const row = document.createElement("div");
    row.className = "admin-row";
    row.innerHTML = `
      <img src="${p.image_url}" alt="">
      <div class="admin-row-info">
        <strong>${p.title}</strong>
        <span>${p.category} — AED ${p.price}${p.sold_out ? " — SOLD OUT" : ""}</span>
      </div>
      <div class="admin-row-actions">
        <button class="btn-ghost edit-btn">Edit</button>
        <button class="btn-danger delete-btn">Delete</button>
      </div>`;
    row.querySelector(".edit-btn").addEventListener("click", () => editProduct(p));
    row.querySelector(".delete-btn").addEventListener("click", () => deleteProduct(p.id));
    list.appendChild(row);
  });
}

function editProduct(p) {
  productIdField.value = p.id;
  productExistingImage.value = p.image_url;
  document.getElementById("product-category").value = p.category;
  document.getElementById("product-title").value = p.title;
  document.getElementById("product-price").value = p.price;
  document.getElementById("product-description").value = p.description || "";
  document.getElementById("product-sold-out").checked = p.sold_out;
  productImagePreview.src = p.image_url;
  productImagePreview.hidden = false;
  productCancelBtn.hidden = false;
  window.scrollTo({ top: productForm.offsetTop - 20, behavior: "smooth" });
}

function resetProductForm() {
  productForm.reset();
  productIdField.value = "";
  productExistingImage.value = "";
  productImagePreview.hidden = true;
  productCancelBtn.hidden = true;
}

productCancelBtn.addEventListener("click", resetProductForm);

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusEl = document.getElementById("product-status");
  const fileInput = document.getElementById("product-image");
  const id = productIdField.value;

  try {
    let imageUrl = productExistingImage.value;
    if (fileInput.files[0]) {
      imageUrl = await uploadImage(fileInput.files[0], "products");
    }
    if (!imageUrl) throw new Error("Please choose an image.");

    const record = {
      category: document.getElementById("product-category").value,
      title: document.getElementById("product-title").value.trim(),
      price: Number(document.getElementById("product-price").value),
      description: document.getElementById("product-description").value.trim() || null,
      sold_out: document.getElementById("product-sold-out").checked,
      image_url: imageUrl,
    };

    const { error } = id
      ? await supabaseClient.from("products").update(record).eq("id", id)
      : await supabaseClient.from("products").insert(record);
    if (error) throw error;

    setStatus(statusEl, "Saved.", false);
    resetProductForm();
    loadProducts();
  } catch (err) {
    setStatus(statusEl, err.message, true);
  }
});

async function deleteProduct(id) {
  if (!(await confirmDialog("Delete this item?"))) return;
  const { error } = await supabaseClient.from("products").delete().eq("id", id);
  if (error) alert(error.message);
  loadProducts();
}

// ------------------------------------------------------------
// BLOG
// ------------------------------------------------------------
const blogForm = document.getElementById("blog-form");
const blogIdField = document.getElementById("blog-id");
const blogExistingImage = document.getElementById("blog-existing-image");
const blogExistingImage2 = document.getElementById("blog-existing-image-2");
const blogCancelBtn = document.getElementById("blog-cancel");

async function loadBlogPosts() {
  const list = document.getElementById("blog-list");
  list.textContent = "Loading...";
  const { data, error } = await supabaseClient
    .from("blog_posts")
    .select("*")
    .order("post_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) {
    list.textContent = "Error loading blog posts: " + error.message;
    return;
  }
  list.innerHTML = "";
  data.forEach((b) => {
    const row = document.createElement("div");
    row.className = "admin-row";
    row.innerHTML = `
      <img src="${b.image_url || ""}" alt="">
      <div class="admin-row-info">
        <strong>${b.title}</strong>
        <span>${b.subtitle || ""}</span>
      </div>
      <div class="admin-row-actions">
        <button class="btn-ghost edit-btn">Edit</button>
        <button class="btn-danger delete-btn">Delete</button>
      </div>`;
    row.querySelector(".edit-btn").addEventListener("click", () => editBlogPost(b));
    row.querySelector(".delete-btn").addEventListener("click", () => deleteBlogPost(b.id));
    list.appendChild(row);
  });
}

function editBlogPost(b) {
  blogIdField.value = b.id;
  blogExistingImage.value = b.image_url || "";
  blogExistingImage2.value = b.image_url_2 || "";
  document.getElementById("blog-title").value = b.title;
  document.getElementById("blog-subtitle").value = b.subtitle || "";
  document.getElementById("blog-post-date").value = b.post_date || "";
  document.getElementById("blog-description").value = b.description || "";
  document.getElementById("blog-link-url").value = b.link_url || "";
  document.getElementById("blog-link-label").value = b.link_label || "";
  document.getElementById("blog-link2-url").value = b.link2_url || "";
  document.getElementById("blog-link2-label").value = b.link2_label || "";
  blogCancelBtn.hidden = false;
  window.scrollTo({ top: blogForm.offsetTop - 20, behavior: "smooth" });
}

function resetBlogForm() {
  blogForm.reset();
  blogIdField.value = "";
  blogExistingImage.value = "";
  blogExistingImage2.value = "";
  blogCancelBtn.hidden = true;
}

blogCancelBtn.addEventListener("click", resetBlogForm);

blogForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusEl = document.getElementById("blog-status");
  const id = blogIdField.value;
  const file1 = document.getElementById("blog-image").files[0];
  const file2 = document.getElementById("blog-image-2").files[0];

  try {
    let imageUrl = blogExistingImage.value;
    let imageUrl2 = blogExistingImage2.value;
    if (file1) imageUrl = await uploadImage(file1, "blog");
    if (file2) imageUrl2 = await uploadImage(file2, "blog");

    const record = {
      title: document.getElementById("blog-title").value.trim(),
      subtitle: document.getElementById("blog-subtitle").value.trim() || null,
      post_date: document.getElementById("blog-post-date").value || null,
      description: document.getElementById("blog-description").value.trim() || null,
      image_url: imageUrl || null,
      image_url_2: imageUrl2 || null,
      link_url: document.getElementById("blog-link-url").value.trim() || null,
      link_label: document.getElementById("blog-link-label").value.trim() || null,
      link2_url: document.getElementById("blog-link2-url").value.trim() || null,
      link2_label: document.getElementById("blog-link2-label").value.trim() || null,
    };

    const { error } = id
      ? await supabaseClient.from("blog_posts").update(record).eq("id", id)
      : await supabaseClient.from("blog_posts").insert(record);
    if (error) throw error;

    setStatus(statusEl, "Saved.", false);
    resetBlogForm();
    loadBlogPosts();
  } catch (err) {
    setStatus(statusEl, err.message, true);
  }
});

async function deleteBlogPost(id) {
  if (!(await confirmDialog("Delete this entry?"))) return;
  const { error } = await supabaseClient.from("blog_posts").delete().eq("id", id);
  if (error) alert(error.message);
  loadBlogPosts();
}

// ------------------------------------------------------------
// STORY
// ------------------------------------------------------------
async function loadStory() {
  const { data, error } = await supabaseClient.from("story_content").select("*").eq("id", 1).maybeSingle();
  if (error) {
    setStatus(document.getElementById("story-status"), error.message, true);
    return;
  }
  document.getElementById("story-quote").value = data?.quote || "";
  document.getElementById("story-body").value = data?.body || "";
  document.getElementById("story-theme").value = data?.theme || "classic";
  document.getElementById("story-existing-photo").value = data?.photo_url || "";
  const preview = document.getElementById("story-photo-preview");
  if (data?.photo_url) {
    preview.src = data.photo_url;
    preview.hidden = false;
  } else {
    preview.hidden = true;
  }
}

document.getElementById("story-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusEl = document.getElementById("story-status");
  const fileInput = document.getElementById("story-photo");

  try {
    let photoUrl = document.getElementById("story-existing-photo").value;
    if (fileInput.files[0]) {
      photoUrl = await uploadImage(fileInput.files[0], "story");
    }

    const record = {
      id: 1,
      quote: document.getElementById("story-quote").value.trim(),
      body: document.getElementById("story-body").value.trim(),
      theme: document.getElementById("story-theme").value,
      photo_url: photoUrl || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabaseClient.from("story_content").upsert(record);
    if (error) throw error;

    setStatus(statusEl, "Saved.", false);
    fileInput.value = "";
    document.getElementById("story-existing-photo").value = photoUrl;
  } catch (err) {
    setStatus(statusEl, err.message, true);
  }
});

// ------------------------------------------------------------
// INQUIRIES
// ------------------------------------------------------------
async function loadInquiries() {
  const list = document.getElementById("inquiries-list");
  list.textContent = "Loading...";
  const { data, error } = await supabaseClient
    .from("inquiries")
    .select("*, products(image_url)")
    .order("created_at", { ascending: false });
  if (error) {
    list.textContent = "Error loading inquiries: " + error.message;
    return;
  }
  if (!data.length) {
    list.textContent = "No inquiries yet.";
    return;
  }
  list.innerHTML = "";
  data.forEach((inq) => {
    const row = document.createElement("div");
    row.className = "admin-row admin-row-inquiry";
    const subject = encodeURIComponent(`Re: your inquiry about ${inq.product_title || "a painting"}`);
    const mailtoHref = `mailto:${inq.email}?subject=${subject}`;
    // products can be null if the item was deleted after the inquiry came in —
    // product_title is a snapshot saved at inquiry time, so it still shows.
    const imgUrl = inq.products?.image_url;
    const imgHtml = imgUrl
      ? `<img src="${imgUrl}" alt="${inq.product_title || "Painting"}">`
      : `<div class="admin-row-noimg">?</div>`;
    row.innerHTML = `
      ${imgHtml}
      <div class="admin-row-info">
        <strong>${inq.product_title || "Unknown painting"}</strong>
        <span>${inq.name} · <a href="${mailtoHref}">${inq.email}</a>${inq.phone ? " · " + inq.phone : ""}</span>
        <p>${inq.message || ""}</p>
        <small>${new Date(inq.created_at).toLocaleString()}</small>
      </div>
      <div class="admin-row-actions">
        <a href="${mailtoHref}" class="btn-ghost email-btn">Email</a>
        <button type="button" class="btn-ghost copy-btn">Copy email</button>
        <button class="btn-danger delete-btn">Delete</button>
      </div>`;
    row.querySelector(".copy-btn").addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      const original = btn.textContent;
      let copied = false;
      try {
        await navigator.clipboard.writeText(inq.email);
        copied = true;
      } catch (err) {
        // Clipboard API can be unavailable (e.g. no HTTPS, no permission, or a
        // restricted embedded browser). Fall back to a manual-select prompt,
        // and if even that isn't supported, just tell the user to select the
        // address text that's already visible in the row.
        try {
          window.prompt("Copy this email address:", inq.email);
          copied = true;
        } catch (err2) {
          copied = false;
        }
      }
      btn.textContent = copied ? "Copied!" : "Select above ↑";
      setTimeout(() => (btn.textContent = original), 1500);
    });
    row.querySelector(".delete-btn").addEventListener("click", async () => {
      if (!(await confirmDialog("Delete this inquiry?"))) return;
      const { error } = await supabaseClient.from("inquiries").delete().eq("id", inq.id);
      if (error) alert(error.message);
      loadInquiries();
    });
    list.appendChild(row);
  });
}

refreshSession();
