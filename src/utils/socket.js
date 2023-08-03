
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



	socket.on('removeProduct', async ({ cartIdd, productId }) => {
		try {
			console.log(cartIdd, productId, "aqui socket")
			const cartUser = await cartController.deleteProductCart(cartIdd, productId);
			
		} catch (err) {
			console.error('Error al crear o buscar el carrito:', err);;
		}
	});


	socket.on('cartUser', async ({ cartIdd, productId }) => {
		try {
			console.log(cartIdd, productId)

			//apartir de aqui creare mi carrito con su usuario y cart, ya que no puedo hacerlo por la ruta//
			//const cartUser = await cartController.deleteProductCart(cartIdd, productId);
			
		} catch (err) {
			console.error('Error al crear o buscar el carrito:', err);;
		}
	});





	socket.on('cartId', async (existingCartId) => {
		try {
			if (existingCartId && existingCartId !== 'undefined') {
				const existingCart = await cartController.getCartId(existingCartId);
			} else {
				const cart = await cartController.addCart();
				socket.emit('cartId', cart._id.toString());
			}
		} catch (err) {
			console.error('Error al crear o buscar el carrito:', err);;
		}
	});


	socket.on('agregarProducto', async ({ cartId, productId }) => {
		try {
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
			const cartUser = await cartController.getCartId(data.cartIdd)
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

/*
io.use(socketIoJwt.authorize({
	secret: secretKey,
	handshake: true, // Habilitar handshake para que el token verificado esté disponible en socket.handshake.decoded
  }));

io.on('connection', function (socket) {
	console.log(socket.handshake.decoded)
	console.log('Cliente conectado');

	socket.on('cartId', async (existingCartId) => {
		try {
			if (existingCartId && existingCartId !== 'undefined') {
				const existingCart = await cartController.getCartId(existingCartId);

				socket.emit('existingCart', existingCart);
			} else {
				
				const cart = await cartController.addCart();
				socket.emit('cartId', cart._id.toString());
			}
		} catch (err) {
			console.error('Error al crear o buscar el carrito:', err);
		}
	});

	

	socket.on('disconnect', () => {
		// Elimina al usuario del mapa cuando se desconecta
		const userId = socket.decoded._id.toString();
		connectedUsers.delete(userId);

		console.log('Cliente desconectado');
	});
});*/