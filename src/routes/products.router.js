import { Router } from "express";
import upload from "../utils/upload.middleware.js";
import ProductManagerDAO from "../dao/products.dao.js";

const router = Router();
export default router;

router.get("/", async (req, res) => {
    const productsWithStock = req.query.stock;

    try {
        let products;

        if (productsWithStock === undefined) {
            products = await ProductManagerDAO.getProducts();
        } else {
            products = await ProductManagerDAO.getProductsWithStock();
        }

        res.render("products", { products });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).render("error", { error: "El sistema no esta disponible en estos momentos" });
    }
});

router.get("/new", (req, res) => {
    res.render("new-product");
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.redirect("/products/");
    }

    try {
        const product = await ProductManagerDAO.getProductById(id);

        if (!product) {
            return res.render("404");
        }

        res.render("product", {
            title: product.title,
            description: product.description,
            image: product.image,
            price: product.price,
            isStock: product.stock > 0,
            stock: product.stock,
            id: id
        });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).render("error", { error: "El sistema no esta disponible en estos momentos" });
    }
});

router.post("/", upload.array('images', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0 || !req.title || !req.description || !req.price || !req.stock) {
            return res.redirect("/products/new");
        }

        const filenames = req.files.map(file => file.filename);
        const product = req.body;

        await ProductManagerDAO.addProduct(product.title, product.description, filenames, product.price, product.stock);

        res.redirect("/products");
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).render("error", { error: "El sistema no esta disponible en estos momentos" });
    }
});

router.post("/delete/:id", async (req, res) => {
    const productId = req.params.id;

    if (!productId) {
        return res.status(400).render("error", { error: "ID del producto no proporcionado" });
    }

    try {
        await ProductManagerDAO.deleteProduct(productId);
        res.redirect("/products");
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).render("error", { error: "El sistema no esta disponible en estos momentos" });
    }
});

router.post("/updateProduct/:id", upload.array('images', 5), async (req, res) => {
    const productId = req.params.id;

    if (!productId) {
        return res.status(400).json({ error: "ID del producto no proporcionado" });
    }

    const productData = req.body;
    
    if (req.files && req.files.length > 0) {
        const filenames = req.files.map(file => file.filename);
        productData.photo = filenames;
    }

    try {
        await ProductManagerDAO.updateProduct(productId, productData);
        res.redirect("/products/" + productId);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
