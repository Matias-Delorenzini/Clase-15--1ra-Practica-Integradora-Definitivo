import Cart from "./models/cart.schema.js";

class CartManagerDAO {
    static async getCart(userId) {
        return Cart.findOne({ userId }).lean();
    }

    static async createCart(userId) {
        return new Cart({ userId, products: [] }).save();
    }

    static async addToCart(userId, productId) {
        return Cart.findOneAndUpdate(
            { userId },
            { $addToSet: { products: productId } },
            { new: true, upsert: true }
        ).lean();
    }

    static async removeFromCart(userId, productId) {
        return Cart.findOneAndUpdate(
            { userId },
            { $pull: { products: productId } },
            { new: true }
        ).lean();
    }
}

export default CartManagerDAO;
