import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import { productList } from './instances.js';

// inicializo express y server.io
export const app = express();
export const server = http.createServer(app);
export const io = new Server(server);

io.on('connection', async (socket) => {
	console.log('Cliente conectado');

	socket.emit('List-Product', await productList.getProducts());

	socket.on('disconnect', () => {
		console.log('Cliente desconectado..');
	});
});