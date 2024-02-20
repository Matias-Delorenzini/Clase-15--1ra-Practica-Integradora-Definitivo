import Products from "./models/products.schema.js";

class ProductManagerDAO {
    static async getProducts() {
        return Products.find().lean();
    }
    static async getProductsWithStock() {
        return Products.find({stock:{$gt:0}}).lean();
    }
    static async getProductById(id) {
        return Products.findOne({ _id: id }).lean();
    }
    static async addProduct(title, description, photo, price, stock) {
        return new Products({title, description, photo, price, stock}).save();
    }
    static async updateProduct(id, data) {
        return Products.findOneAndUpdate({ _id: id }, data);
    }
    static async deleteProduct(id) {
        return Products.findByIdAndDelete(id);
    }
}

export default ProductManagerDAO;