const express = require("express");
const ProductManager = require("./ProductManager");
const CartManager = require("./CartManager");

const app = express();
const PORT = 8080;

const productManager = new ProductManager("./data/products.json");
const cartManager = new CartManager("./data/carts.json");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenido a la API. Usá /api/products o /api/carts");
});

app.get("/api/products", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

app.get("/api/products/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

app.post("/api/products", async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  res.status(201).json(newProduct);
});

app.put("/api/products/:pid", async (req, res) => {
  const updated = await productManager.updateProduct(req.params.pid, req.body);
  if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(updated);
});

app.delete("/api/products/:pid", async (req, res) => {
  const deleted = await productManager.deleteProduct(req.params.pid);
  if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ message: "Producto eliminado" });
});

app.post("/api/carts", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

app.get("/api/carts/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart.products);
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
