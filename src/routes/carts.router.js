import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";



const cartRouter = Router();


cartRouter.post('/', middlewarePassportJwt, isAuth, async (req, res) => {
    try {
        const crearCarrito = await cartController.addCart()
        res.status(201).send(crearCarrito);
        return
    } catch (error) {
        res.status(500).send({ error });
    }
});


cartRouter.get('/:cid', middlewarePassportJwt, isAuth, async (req, res) => {
    const cid = req.params.cid;
    try {
        const getCartRouter = await cartController.getCartId(cid)
        res.status(201).send(getCartRouter)
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


cartRouter.post('/:cid/product/:pid', middlewarePassportJwt, isAuth, async (req, res) => {

    const cid = req.params.cid;
    const pid = req.params.pid;
    try {

        const addProdCart = await cartController.addProductCart(cid, pid);
        res.status(201).send(addProdCart);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


cartRouter.delete('/:cid/product/:pid', middlewarePassportJwt, isAuth, async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const deleteProdCart = await cartController.deleteProductCart(cid, pid)
        res.status(201).send(deleteProdCart)
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})


cartRouter.put('/:cid', middlewarePassportJwt, isAuth, async (req, res) => {
    const cid = req.params.cid;
    const newProducts = req.body;
    try {
        const productsNuevos = await cartController.updateCart(cid, newProducts)
        res.status(201).send(productsNuevos)
    } catch (error) {
        res.status(500).send("Error al tratar de actualizar el carrito");
    }
})


cartRouter.put('/:cid/product/:pid', middlewarePassportJwt, isAuth, async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;

    try {
        const updatedCart = await cartController.updateQuantityProduct(cid, pid, quantity);
        res.send(updatedCart);
    } catch (err) {
        res.status(500).send({ error: 'Error en la actualización de la cantidad' });
    }
});


cartRouter.delete('/:cid/product/', middlewarePassportJwt, isAuth, async (req, res) => {
    const cid = req.params.cid;
    try {

        const clearCart = await cartController.clearProductToCart(cid)
        res.send(clearCart);
    } catch (err) {
        res.status(500).send({ error: 'No se pudo vaciar el carrito' });
    }
})



export { cartRouter };
