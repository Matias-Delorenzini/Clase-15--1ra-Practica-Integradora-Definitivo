import express from "express";
import { engine } from 'express-handlebars';
import mongoose from "mongoose";
import { Server } from 'socket.io'
import MessageManagerDAO from './dao/message.dao.js';
import multer from "multer";

import chatRouter from './routes/chat.router.js'
import prodsRouter from './routes/products.router.js';
import cartRouter from "./routes/cart.router.js"

const app = express();
const httpServer = app.listen(8080, () => console.log('Server running in port 8080'))

const io = new Server(httpServer);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/products/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use("/chat", chatRouter);

app.use("/products", prodsRouter);

app.use("/cart", cartRouter);

app.get("/", (req, res) => {
    res.redirect("/home");
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.get("/ping", (req, res) => {
    res.send("Pong!");
});

app.use((req, res, next) => {
    res.render("404");
});

try {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect("mongodb+srv://MatiasDelorenzini:Xc22iQNHFLrA6Ujz@cluster0.ljaqye5.mongodb.net/ecommerce?retryWrites=true&w=majority");
    }
} catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    Swal.fire("El sistema no esta disponible en estos momentos");
}


io.on('connection', socket => {
    console.log('Nuevo cliente conectado')

    socket.on('message', async data => {
        try {
            await MessageManagerDAO.addMessage(data.user, data.message);
        } catch (errorAddMessage) {
            console.error("Error al añadir mensaje:", errorAddMessage);
            Swal.fire("El sistema no esta disponible en estos momentos");
        }

        try {
            const messages = await MessageManagerDAO.getMessages();
            io.emit('messageLogs', messages);
            return messages;
        } catch (errorGetMessages) {
            console.error("Error al obtener mensajes:", errorGetMessages);
            Swal.fire("El sistema no esta disponible en estos momentos");
        }
    });

    socket.on('login', async data => {
        try {
            socket.emit('register', data)
            console.log(data)
            const messages = await MessageManagerDAO.getMessages()
            socket.emit('messageLogs', messages)
        } catch (errorLogin){
            console.error("Error al hacer login:", errorLogin)
            Swal.fire("El sistema no esta disponible en estos momentos");
        }
    })
});

export default app;
