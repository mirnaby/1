// وظائف مشتركة بين كل صفحات موقع ميرنا بيوتي

function formatPrice(value) {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(value);
}

function gradientStyle(from, to) {
  return "background:linear-gradient(135deg," + from + "," + to + ")";
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const count = Cart.count();
  badge.textContent = count > 9 ? "9+" : String(count);
  badge.hidden = count === 0;
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function setYear() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
}

function bindNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
    showToast("شكراً لاشتراكك معنا! 💌");
  });
}

function productCardHtml(product) {
  const compare = product.compareAtPrice
    ? '<span class="price-compare">' + formatPrice(product.compareAtPrice) + "</span>"
    : "";
  return (
    '<a class="product-card" href="product.html?slug=' +
    encodeURIComponent(product.slug) +
    '">' +
    '<div class="product-visual" style="' +
    gradientStyle(product.gradientFrom, product.gradientTo) +
    '">' +
    product.emoji +
    "</div>" +
    '<div class="product-body">' +
    '<p class="product-name">' +
    product.name +
    "</p>" +
    '<div class="product-rating">⭐ ' +
    product.rating.toFixed(1) +
    ' <span>(' + product.reviewsCount + ')</span></div>' +
    '<div class="product-price-row"><span class="price">' +
    formatPrice(product.price) +
    "</span>" +
    compare +
    "</div>" +
    '<button type="button" class="quick-add" data-quick-add="' +
    product.id +
    '">أضيفي للسلة</button>' +
    "</div>" +
    "</a>"
  );
}

function bindQuickAddButtons(root) {
  (root || document).querySelectorAll("[data-quick-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const product = PRODUCTS.find((p) => p.id === btn.getAttribute("data-quick-add"));
      if (!product) return;
      Cart.add(product, 1);
      updateCartBadge();
      showToast(product.name + " أُضيف إلى السلة");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  setYear();
  bindNewsletterForm();
});
