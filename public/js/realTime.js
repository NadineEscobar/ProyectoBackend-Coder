const socket = io();

const productList = document.getElementById("product-list");
const productForm = document.getElementById("productForm");


socket.on("products", (products) => {
  renderProducts(products);
});


function renderProducts(products) {
  productList.innerHTML = "";
  products.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <h3>${p.title}</h3>
      <p><strong>Precio:</strong> $${p.price}</p>
      <p><strong>Descripción:</strong> ${p.description || "Sin descripción"}</p>
      <p><strong>Categoría:</strong> ${p.category || "Sin categoría"}</p>
      <button class="btn-delete" onclick="deleteProduct('${p.id}')">Eliminar</button>
    `;

    productList.appendChild(card);
  });
}


productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  const product = Object.fromEntries(formData);
  socket.emit("newProduct", product);
  productForm.reset();
});


function deleteProduct(productId) {
  socket.emit("deleteProduct", productId);
}
