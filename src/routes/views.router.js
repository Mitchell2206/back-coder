import express from "express";
import { Router } from "express";
import { productList } from '../utils/instances.js';
import mongoose from "mongoose";

const wiewsRouter = Router()



wiewsRouter.get('/chat', (req, res) => {

  res.render('chat');

});

wiewsRouter.get('/index', async (req, res) => {

  const products = await productList.getProducts()


  res.render('index', { prodc: products });

});



export default wiewsRouter
