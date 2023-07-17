
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { menssagerModel } from '../models/menssage.model.js';
import cartController from '../controllers/cart.controller.js';
import cartModel from '../models/carts.model.js';
// inicializo express y server.io
export const app = express();
export const server = http.createServer(app);
export const io = new Server(server);




io.on('connection', async (socket) => {
	console.log('Cliente conectado');



	try {
		const cart = await cartController.addCart()
		socket.emit('cartId', cart._id)

	} catch (err) {
		console.error('Error al crear el carrito:', err);
	}




	socket.on('agregarProducto', async ({ cartId, productId }) => {
		try {

			console.log(cartId, productId)

			await cartController.addProductCart(cartId, productId);
			let cart = await cartController.getCartId(cartId);

			const userCard = await cartModel.findById(cart._id).lean()


			//socket.emit('cartproducts', { userCard });
		} catch (error) {
			console.log(error)
		}
	});




	socket.on('enviarCarrito', async (data) => {
		try {
			console.log(data)
			const cartUser = await cartController.getCartId(data.cartIdd)
			console.log(cartUser)
			socket.emit('cartUser', { cartUser })
		} catch (error) {
			console.log(error);
		}
	});

	try {
		const messages = await menssagerModel.find({}).lean();
		socket.emit('List-Message', { messages });
	} catch (error) {
		console.error('Error al obtener los mensajes:', error);
	}


	socket.on('disconnect', () => {
		console.log('Cliente desconectado');
	});
});
