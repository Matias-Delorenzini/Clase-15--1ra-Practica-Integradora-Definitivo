import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    products: {
        type: [String],
        required: true
    },
    userId: {
        type: Number,
        required: true
    }
});

export default mongoose.model("Cart", CartSchema);
