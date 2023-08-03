import { Router } from "express";
import { cartList } from "../utils/instances.js";
import cartController from "../controllers/cart.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";

const cartRouter = Router();


cartRouter.post('/', async (req, res) => {
    try {
        const crearCarrito = await cartController.addCart()
        console.log(crearCarrito)
        res.status(201).send(crearCarrito);
    } catch (error) {
        res.status(500).send({ error });
    }
});


cartRouter.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
    try {
        const getCartRouter = await cartController.getCartId(cid)
        console.log(getCartRouter)
        res.status(201).send(getCartRouter)
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


cartRouter.post('/:cid/product/:pid' , isAuth , async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const addProdCart = await cartController.addProductCart(cid, pid);
        res.status(201).send(addProdCart);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


cartRouter.delete('/:cid/product/:pid', isAuth, async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const deleteProdCart = await cartController.deleteProductCart(cid, pid)
        res.status(201).send(deleteProdCart)
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})

// actualimos el contenido del carrito con nuevos enviados desde req.body con
// siguiente formato
//{
//   "products": [
//    {
//       "product": "647fe1ee8b65c8d042f75c45",
//      "quantity": 2
//    },
//     {
//       "product": "647fe1be8b65c8d042f75c43",
//      "quantity": 1
//     }
//  ]
// }

cartRouter.put('/:cid', isAuth, async (req, res) => {
    const cid = req.params.cid;
    const newProducts = req.body;
    try {
        const productsNuevos = await cartController.updateCart(cid, newProducts)
        res.status(201).send(productsNuevos)
    } catch (error) {
        console.log("Error al tratar de actualizar el carrito", error);
        res.status(500).send("Error al tratar de actualizar el carrito");
    }
})


cartRouter.put('/:cid/product/:pid', isAuth, async (req, res) => {
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

// vaciamos los productos del carrito //
cartRouter.delete('/:cid/product/', isAuth, async (req, res) => {
    const cid = req.params.cid;
    try {

        const clearCart = await cartController.clearProductToCart(cid)
        res.send(clearCart);
    } catch (err) {
        res.status(500).send({ error: 'No se pudo vaciar el carrito' });
    }
})



export { cartRouter };
