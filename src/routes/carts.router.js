import Ticket from "../models/Ticket.js";
import { v4 as uuidv4 } from "uuid";
import passport from "passport";
import { Router } from "express";
//import CartManager from "../managers/CartManager.js";
import Cart from "../models/Cart.js";
import ProductManager from "../managers/ProductManager.js";

const productManager = new ProductManager("./src/data/products.json");
const router = Router();
//const manager = new CartManager("./src/data/carts.json");

// Crear carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener carrito
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product");

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar producto
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productInCart = cart.products.find(
      p => p.product.toString() === pid
    );

    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: pid.toString(), quantity: 1 });
    }

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const cartId = req.params.cid;

    const cart = await Cart.findById(cartId);

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      let totalAmount = 0;
      let productsNotPurchased = [];

    for (const item of cart.products) {
  const product = await productManager.getProductById(item.product);

  if (!product) continue;

  if (product.stock >= item.quantity) {
    product.stock -= item.quantity;

    totalAmount += product.price * item.quantity;
  } else {
    productsNotPurchased.push(product.id);
  }
}
      const ticket = await Ticket.create({
        code: uuidv4(),
        amount: totalAmount,
        purchaser: req.user.email
      });

      res.json({
        message: "Compra finalizada",
        ticket,
        productsNotPurchased
      });

    } catch (error) {
  console.log(error); 
  res.status(500).json({ error: error.message });
}
  }
);

export default router;
