import { Router } from "express";
import { cartList } from "../utils/instances.js";

const cartRouter = Router();

// creo mi carrito //
cartRouter.post('/', async (req, res) => {
    const carts = req.body
    try {
        const crearCarrito = await cartList.addCart(carts)
        res.send(crearCarrito);
    } catch (error) {
        res.status(500).send({ error });
    }
});

cartRouter.get('/', async (req, res) => {

    try {
        const getCartRouter = await cartList.getProducts()
        res.send(getCartRouter)
    } catch (err) {
        res.status(500).send({ err });
    }
});


cartRouter.post('/:cid/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const addProdCart = await cartList.addProductCart(cid, pid)
        res.send(addProdCart)
    } catch (err) {
        res.status(500).send({ err });
    }
});


export { cartRouter };
