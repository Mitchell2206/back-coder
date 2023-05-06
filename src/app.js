import express from 'express';
import { productRouter } from './routes/products.router.js';
import { cartRouter } from './routes/carts.router.js';



const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productRouter)

app.use('/api/carts', cartRouter)

app.listen(3000, () => {
	console.log('estoy escuchando')
})