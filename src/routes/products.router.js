import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager("./src/data/products.json");

// GET todos
router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

// GET por ID
router.get("/:pid", async (req, res) => {
  const product = await manager.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

// POST
router.post("/", async (req, res) => {
  const newProduct = await manager.addProduct(req.body);
  res.status(201).json(newProduct);
});

// PUT
router.put("/:pid", async (req, res) => {
  const updated = await manager.updateProduct(req.params.pid, req.body);
  if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(updated);
});

// DELETE
router.delete("/:pid", async (req, res) => {
  await manager.deleteProduct(req.params.pid);
  res.json({ message: "Producto eliminado" });
});

export default router;
