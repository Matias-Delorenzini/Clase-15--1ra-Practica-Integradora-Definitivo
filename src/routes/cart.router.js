import express from "express";
import CartManagerDAO from "../dao/cart.dao.js";
import ProductManagerDAO from "../dao/products.dao.js";

const router = express.Router();
export default router;

router.post("/add/:productId", async (req, res) => {
    const userId = -1; 
    const productId = req.params.productId;

    try {
        await CartManagerDAO.addToCart(userId, productId);
        res.status(200).json({ message: 'Producto añadido al carrito con éxito' });
    } catch (error) {
        console.error('Error al añadir producto al carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post("/remove/:productId", async (req, res) => {
    const userId = -1;
    const productId = req.params.productId;

    try {
        await CartManagerDAO.removeFromCart(userId, productId);
        res.status(200).json({ message: 'Producto eliminado del carrito con éxito' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get("/", async (req, res) => {
    const userId = -1;

    try {
        const cart = await CartManagerDAO.getCart(userId);
        res.render("cart", { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
