const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");
const CartManager = require("../managers/CartManager");

const productManager = new ProductManager();
const cartManager = new CartManager();

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await productManager.getProducts({ limit, page, sort, query });

    console.log("PRODUCTOS:", result.docs);

    const pagination = {
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/?${new URLSearchParams({ ...req.query, page: result.prevPage }).toString()}` : null,
      nextLink: result.hasNextPage ? `/?${new URLSearchParams({ ...req.query, page: result.nextPage }).toString()}` : null
    };

    res.render("home", { products: result.docs, pagination });
  } catch (error) {
    console.error("❌ Error al renderizar la vista Home:", error);
    res.status(500).send("Error interno del servidor");
  }
});


router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("❌ Error al renderizar la vista RealTimeProducts:", error);
    res.status(500).send("Error interno del servidor");
  }
});


router.get("/products/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("productDetail", { product });
  } catch (error) {
    console.error("❌ Error al renderizar la vista ProductDetail:", error);
    res.status(500).send("Error interno del servidor");
  }
});


router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.render("cart", { cart });
  } catch (error) {
    console.error("❌ Error al renderizar la vista Cart:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;