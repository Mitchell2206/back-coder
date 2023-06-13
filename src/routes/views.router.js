import express from "express";
import { Router } from "express";
import { productList } from '../utils/instances.js';
import mongoose from "mongoose";
import ProductManager from "../controllers/Dao/DB/products.db.js";
import CartManagers from "../controllers/DAO/DB/cart.bd.js";
import { cartList } from "../utils/instances.js";

const cartManagers = new CartManagers();
const wiewsRouter = Router()



wiewsRouter.get('/index', async (req, res) => {
  const { limit = 5, page = 1, sort, descripcion, availability } = req.query;
  try {
    const result = await productList.getProducts(limit, page, sort, descripcion, availability);
    const pag = result.page;
    const prevPage = result.prevPage;
    const nextPage = result.nextPage;
    const totalPages = result.totalPages;
    const prevLink =
      prevPage &&

      `${req.baseUrl}/index/?page=${prevPage}&limit=${limit}&sort=${sort || ""
      }&descripcion=${encodeURIComponent(descripcion || "")}${availability ? `&availability=${availability}` : ""
      }`;

    const nextLink =
      nextPage &&
      `${req.baseUrl}/index/?page=${nextPage}&limit=${limit}&sort=${sort || ""
      }&descripcion=${encodeURIComponent(descripcion || "")}${availability ? `&availability=${availability}` : ""
      }`;

    //mapeo para evitar el Object.object
    const products = result.docs.map((product) => product.toObject());
    res.render("index", { title: "Products", products, prevLink, pag, totalPages, nextLink });
  } catch (error) {
    res.status(500).send(`No se pudieron obtener los productos`);
  }
});

wiewsRouter.get('/chat', (req, res) => {

  res.render('chat');

});


wiewsRouter.get('/carts/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    
    const cart = await cartManagers.getCartContents(cid);
   
    console.log(cart.products)  // aqui tengo mis productos que pushee al carrito cuando cree los post //
    res.render("cart", { title: "cart", cart });
  } catch (err) {
    res.status(400).send(`${err}`);
  }
});



export default wiewsRouter
