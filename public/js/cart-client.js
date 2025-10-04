async function ensureCart() {
  let cartId = localStorage.getItem("cartId");
  if (!cartId) {
    const res = await fetch("/api/carts", { method: "POST" });
    const data = await res.json();
    cartId = data.payload ? data.payload._id || data.payload.id : data.id || data._id;
    localStorage.setItem("cartId", cartId);
  }
  return cartId;
}

document.addEventListener("click", async (e) => {
  if (e.target.matches(".add-to-cart") || e.target.id === "addToCartBtn") {
    const productId = e.target.dataset.id;
    const cartId = await ensureCart();
    const res = await fetch(`/api/carts/${cartId}/product/${productId}`, { method: "POST" });
    if (res.ok) alert("Producto agregado al carrito");
    else alert("Error agregando producto");
  }
});