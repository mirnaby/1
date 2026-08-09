// سلة التسوق - تخزين محلي (localStorage) بدون سيرفر

const CART_KEY = "mirna-beauty-cart";

const Cart = {
  read() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  write(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  },

  count() {
    return this.read().reduce((sum, i) => sum + i.quantity, 0);
  },

  total(items) {
    const list = items || this.read();
    return list.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  add(product, quantity) {
    const qty = quantity || 1;
    const items = this.read();
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, product.stock);
    } else {
      items.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        emoji: product.emoji,
        gradientFrom: product.gradientFrom,
        gradientTo: product.gradientTo,
        stock: product.stock,
        quantity: Math.min(qty, product.stock),
      });
    }
    this.write(items);
  },

  removeItem(productId) {
    this.write(this.read().filter((i) => i.productId !== productId));
  },

  setQuantity(productId, quantity) {
    const items = this.read();
    if (quantity < 1) {
      this.write(items.filter((i) => i.productId !== productId));
      return;
    }
    const item = items.find((i) => i.productId === productId);
    if (item) {
      item.quantity = Math.min(quantity, item.stock);
      this.write(items);
    }
  },

  clear() {
    localStorage.removeItem(CART_KEY);
  },
};
