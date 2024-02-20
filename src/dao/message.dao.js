import Messages from "./models/message.schema.js";
import mongoose from "mongoose";
mongoose.connect("mongodb+srv://MatiasDelorenzini:Xc22iQNHFLrA6Ujz@cluster0.ljaqye5.mongodb.net/ecommerce?retryWrites=true&w=majority");

class MessageManagerDAO {
    static async getMessages() {
        return Messages.find().lean();
    }
    static async addMessage(user,message) {
        return new Messages({user, message}).save(); 
    }
}

export default MessageManagerDAO;