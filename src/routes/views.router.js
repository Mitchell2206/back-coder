import express from "express";
import { Router } from "express";
import ProductManager from "../controllers/primeramitchell.js";



const wiewsRouter = Router()
const productManager = new ProductManager();
console.log(wiewsRouter)

wiewsRouter.get('/', async (req, res) => {


    try {
        
        let prodc = await productManager.getProducts();
        
        console.log("estoy en el index",prodc)
        res.render('index',{ prodc } );


    } catch (err) {
        console.log(err)
        res.status(500).send({ err });
    }
});

export { wiewsRouter };
