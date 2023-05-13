import express from 'express';
import { productRouter } from './routes/products.router.js';
import { cartRouter } from './routes/carts.router.js';
import { wiewsRouter } from './routes/views.router.js';
import handlerbars from 'express-handlebars';
import __dirname from './utils/utils.js';
import path from 'path';



const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.engine('.handlebars', handlerbars.engine());
app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'handlebars');



app.use(express.static('public'))

app.use('/', wiewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)


app.listen(8080, () => {
	console.log('estoy escuchando')
})