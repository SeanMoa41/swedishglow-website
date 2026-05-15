(function () {
  var KEY = 'tsg-cart';
  var WC  = 'https://theswedishglow.com';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }

  function save(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    _updateNav();
  }

  function addToCart(item) {
    var cart = load();
    var existing = cart.find(function (i) { return i.cartId === item.cartId; });
    if (existing) {
      existing.qty += 1;
    } else {
      var entry = {};
      for (var k in item) entry[k] = item[k];
      entry.qty = 1;
      cart.push(entry);
    }
    save(cart);
  }

  function removeItem(cartId) {
    save(load().filter(function (i) { return i.cartId !== cartId; }));
  }

  function setQty(cartId, qty) {
    if (qty < 1) { removeItem(cartId); return; }
    var cart = load();
    var item = cart.find(function (i) { return i.cartId === cartId; });
    if (item) { item.qty = qty; save(cart); }
  }

  function getCount() {
    return load().reduce(function (s, i) { return s + i.qty; }, 0);
  }

  function buildCheckoutUrl() {
    var cart = load();
    if (!cart.length) return null;
    var parts = cart.map(function (i) {
      var wcQty = i.qty * (i.wcQtyMultiplier || 1);
      return i.wcVariationId
        ? i.wcProductId + ':' + i.wcVariationId + ':' + wcQty
        : i.wcProductId + ':' + wcQty;
    });
    return WC + '/?tsg_cart=' + encodeURIComponent(parts.join(','));
  }

  function _updateNav() {
    var count = getCount();
    document.querySelectorAll('a[href*="winkelwagen"]').forEach(function (el) {
      if (/Cart\s*\(\d+\)/.test(el.textContent)) {
        el.textContent = 'Cart (' + count + ')';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', _updateNav);

  window.TSGCart = {
    addToCart: addToCart,
    removeItem: removeItem,
    setQty: setQty,
    getCount: getCount,
    load: load,
    buildCheckoutUrl: buildCheckoutUrl
  };
})();
