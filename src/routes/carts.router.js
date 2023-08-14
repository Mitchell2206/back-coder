import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";




const cartRouter = Router();


cartRouter.post('/', middlewarePassportJwt, isAuth, async (req, res, next) => {
    try {
        const crearCarrito = await cartController.addCart()
        return res.status(201).send(crearCarrito);
    } catch (err) {
        next(err)
        res.status(500).send({ err });
    }
});


cartRouter.get('/:cid', middlewarePassportJwt, isAuth, async (req, res, next) => {
    const cid = req.params.cid;
    try {
        const getCartRouter = await cartController.getCartId(cid)
        res.status(201).send(getCartRouter)
    } catch (err) {
        next(err)
        res.status(500).send(err);
    }
});


cartRouter.post('/:cid/product/:pid', middlewarePassportJwt, isAuth, async (req, res, next) => {

    const cid = req.params.cid;
    const pid = req.params.pid;
    try {

        const addProdCart = await cartController.addProductCart(cid, pid);
        res.status(201).send(addProdCart);
    } catch (err) {
        next(err)
        res.status(500).send(err);
    }
});


cartRouter.delete('/:cid/product/:pid', middlewarePassportJwt, isAuth, async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const deleteProdCart = await cartController.deleteProductCart(cid, pid)
        res.status(201).send(deleteProdCart)
    } catch (err) {
        next(err)
        res.status(500).send(err);
    }
})


cartRouter.put('/:cid', middlewarePassportJwt, isAuth, async (req, res, next) => {
    const cid = req.params.cid;
    const newProducts = req.body;
    try {
        const productsNuevos = await cartController.updateCart(cid, newProducts)
        res.status(201).send(productsNuevos)
    } catch (err) {
        next(err)
        res.status(500).send(err);
    }
})


cartRouter.put('/:cid/product/:pid', middlewarePassportJwt, isAuth, async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;
    try {
        const updatedCart = await cartController.updateQuantityProduct(cid, pid, quantity);
        res.send(updatedCart);
    } catch (err) {
        next(err)
        res.status(500).send(err);
    }
});

cartRouter.delete('/:cid', middlewarePassportJwt, isAuth, async (req, res, next) => {
    const cid = req.params.cid;
    try {
        const clearCart = await cartController.clearProductToCart(cid)
        res.send(clearCart);
    } catch (err) {
        next(err)
        res.status(500).send(err);
    }
})



export { cartRouter };
