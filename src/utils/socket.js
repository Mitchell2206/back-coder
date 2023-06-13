import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import { productList } from './instances.js';
import productModel from '../controllers/models/product.model.js';
import { menssagerModel } from '../controllers/models/menssage.model.js';

// inicializo express y server.io
export const app = express();
export const server = http.createServer(app);
export const io = new Server(server);


io.on('connection', async (socket) => {
	console.log('Cliente conectado');

	try {
		try {
			socket.emit("products", await productList.getProducts());
		} catch (error) {
			console.log(error);
		}


		const messages = await menssagerModel.find({}).lean();
		socket.emit('List-Message', { messages });
	} catch (error) {
		console.error('Error al obtener los datos:', error);
	}


	socket.on('disconnect', () => {
		console.log('Cliente desconectado');
	});
});
