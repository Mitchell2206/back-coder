
// creamos instancias //
import mongoose from 'mongoose';
import express from 'express';
import { server, app } from './utils/socket.js';
import handlerbars from 'express-handlebars';
// creamos rutas de js //
import { productRouter } from './routes/products.router.js';
import { cartRouter } from './routes/carts.router.js';
import wiewsRouter from './routes/views.router.js';
import { menssagerModel } from "../src/controllers/models/menssage.model.js";
import { productList } from './utils/instances.js';
import { io } from './utils/socket.js';
import { cartList } from './utils/instances.js';


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// creamos accesos a handlerbars de enlazamiento //
app.engine('handlebars', handlerbars.engine());
app.set('views', 'views/');
app.set('view engine', 'handlebars');

app.use(express.static('public'))
// creamos rutas api


app.get('/chat', async (req, res) => {
  try {
    const messages = await menssagerModel.find({}).lean();
    res.render('chat', { messages });
  } catch (err) {
    res.render('error', { error: err.message });
  }
});



app.post('/', async (req, res) => {
  try {
    const { user, menssage } = req.body;
    const newMessage = new menssagerModel({ user, menssage });
    await newMessage.save();

    const messages = await menssagerModel.find({}).lean();

    io.emit('List-Message', {
      products: await cartList.getProducts(),
      messages: messages

    })

    res.redirect('/chat');
  } catch (err) {
    res.render('error', { error: err.message });
  }
});


app.use('/', wiewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

mongoose.connect(
  "mongodb+srv://mitch2206:24591959@codercluster.ouvay3s.mongodb.net/?retryWrites=true&w=majority"
);

const httpServer = 8080;
server.listen(httpServer, () => console.log(`estoy escuchando ${httpServer}...`));


