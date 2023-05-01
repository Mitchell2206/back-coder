import express from 'express';

import ProductManager from './primeramitchell.js';

const app = express()

app.use(express.urlencoded({ extended: true }));

let productManager = new ProductManager("/products.json")



app.get('/products', async (req, res) => {

	try {

		let productos = await productManager.getProducts();
		let limite = req.query.limite;
		if (productos) {
			return res.send(await productos.slice(0, limite))
		} else {
			res.send(productos)
		}
	} catch (error) {
		console.log("no entra")
	}
})



app.get('/products/:id', async (req, res) => {

	try {
		let productUnico = await productManager.getProductsById(
			parseInt(req.params.id)
			//Por medio del req.params.id le pusheamos el id en el localhost //
		);

		if (productUnico != undefined) { //aqui definimos que si productUnico no contiene informacion, enviaremos un undefined//
			return res.send(productUnico)
		} else {
			console.log(`no se ejecuto ${error}`)
		}
		return productUnico
	} catch (error) {
		res.status(400).send(`Problemas 400 ${error}`)
	}


});

app.listen(3000, () => {
	console.log('estoy escuchando')
})