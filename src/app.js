
// creamos instancias //
import express from 'express';
import { server, app } from './utils/socket.js';
import handlerbars from 'express-handlebars';
// creamos rutas de js //
import { productRouter } from './routes/products.router.js';
import { cartRouter } from './routes/carts.router.js';
import { wiewsRouter } from './routes/views.router.js';


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// creamos accesos a handlerbars de enlazamiento //
app.engine('handlebars', handlerbars.engine());
app.set('views', 'views/');
app.set('view engine', 'handlebars');

app.use(express.static('public'))
// creamos rutas api
app.use('/', wiewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

const httpServer = 8080;
server.listen(httpServer, () => console.log(`estoy escuchando ${httpServer}...`));


