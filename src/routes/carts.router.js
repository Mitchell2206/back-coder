import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
import { checkCartAuthorization, isAuth } from "../middleware/auth.middleware.js";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";




const cartRouter = Router();

// , middlewarePassportJwt, isAuth //  con los middleware de autorizacion no puedo usar swagger
cartRouter.post('/', async (req, res, next) => {
    try {

        const crearCarrito = await cartController.addCart()
        req.logger.info(`se creo el cart ID:${crearCarrito}`)
        console.log(crearCarrito.products)

        return res.status(201).send(crearCarrito);
    } catch (err) {
        next(err)
        req.logger.error(`No se creo el carrito`)
        res.status(500).send(err);
    }
});

// , middlewarePassportJwt, isAuth //  con los middleware de autorizacion no puedo usar swagger
cartRouter.get('/:cid', async (req, res, next) => {
    const cid = req.params.cid;
    try {
        const getCartRouter = await cartController.getCartId(cid)
        res.status(201).send(getCartRouter)
    } catch (err) {
        next(err)
        req.logger.error(`No se obtuvo el cart ${cid}`)
        res.status(500).send(err);
    }
});

// , middlewarePassportJwt, checkCartAuthorization , isAuth //  con los middleware de autorizacion no puedo usar swagger
cartRouter.post('/:cid/product/:pid', async (req, res, next) => {

    const cid = req.params.cid;
    const pid = req.params.pid;
    console.log(cid, pid)
    try {


        const addProdCart = await cartController.addProductCart(cid, pid);

        if (!addProdCart) {
            req.logger.warn(`no hay stock del producto ${pid}`)
        } else {
            req.logger.info(`se agrego el producto ${pid}`)
        }

        res.status(201).send(addProdCart);
    } catch (err) {
        next(err)
        req.logger.error(`No se logro agregar el producto ${pid}`)
        res.status(500).send(err);
    }
});

// , middlewarePassportJwt, isAuth //  con los middleware de autorizacion no puedo usar swagger
cartRouter.delete('/:cid/product/:pid', async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const deleteProdCart = await cartController.deleteProductCart(cid, pid)
        req.logger.info(`El producto ${pid} se elimino, delete cart`)

        res.status(201).send(deleteProdCart)
    } catch (err) {
        next(err)
        req.logger.error(`No se elimino el producto ${pid} del carrito`)
        res.status(500).send(err);
    }
})

// , middlewarePassportJwt, isAuth  //  con los middleware de autorizacion no puedo usar swagger
cartRouter.put('/:cid', async (req, res, next) => {
    const cid = req.params.cid;
    const newProducts = req.body;
    try {
        const productsNuevos = await cartController.updateCart(cid, newProducts)
        res.status(201).send(productsNuevos)
    } catch (err) {
        next(err)
        req.logger.error(`No se actualizo el producto ${newProducts}`)
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
        req.logger.error(err)
        res.status(500).send(err);
    }
});
// , middlewarePassportJwt, isAuth //  con los middleware de autorizacion no puedo usar swagger
cartRouter.delete('/:cid', async (req, res, next) => {
    const cid = req.params.cid;
    try {

        const clearCart = await cartController.clearProductToCart(cid)
        res.send(clearCart);
    } catch (err) {
        next(err)
        req.logger.error(`No se pudo limpiar los producto del cart ${cid}`)
        res.status(500).send(err);
    }
})



export { cartRouter };
