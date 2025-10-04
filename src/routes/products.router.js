const express = require("express");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const pm = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await pm.getProducts({ limit, page, sort, query });

   
    const base = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`; 
    const makeLink = (p) => {
      if (!p) return null;
      const params = new URLSearchParams();
      if (limit) params.set("limit", limit);
      if (sort) params.set("sort", sort);
      if (query) params.set("query", query);
      params.set("page", p);
      return `${base}?${params.toString()}`;
    };

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? makeLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? makeLink(result.nextPage) : null
    });
  } catch (err) {
    console.error("GET /api/products error:", err);
    res.status(500).json({ status: "error", message: "Error al obtener productos" });
  }
});


router.get("/:pid", async (req, res) => {
  try {
    const p = await pm.getProductById(req.params.pid);
    if (!p) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json({ status: "success", payload: p });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await pm.addProduct(req.body);
    res.status(201).json({ status: "success", payload: created });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updated = await pm.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const ok = await pm.deleteProduct(req.params.pid);
    if (!ok) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json({ status: "success", message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;