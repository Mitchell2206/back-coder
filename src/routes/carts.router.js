import { Router } from "express";
import { cartList } from "../utils/instances.js";

const cartRouter = Router();

// creo mi carrito //
cartRouter.post('/', async (req, res) => {
    try {
        const crearCarrito = await cartList.addCart()
        console.log(crearCarrito)
        res.status(201).send(crearCarrito);
    } catch (error) {
        res.status(500).send({ error });
    }
});

// traemos el carrito con sus repectivos productos //
cartRouter.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
    try {
        const getCartRouter = await cartList.getCartId(cid)
        console.log(getCartRouter)
        res.status(201).send(getCartRouter)
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// agregamos un producto en el carrito por los params//
cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const addProdCart = await cartList.addProductCart(cid, pid);
        res.status(201).send(addProdCart); // Envía el carrito actualizado como respuesta
    } catch (err) {
        res.status(500).send({ error: err.message }); // Envia el mensaje de error
    }
});

//eliminamos un producto especifico en el carrito por params//
cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const deleteProdCart = await cartList.deleteProductCart(cid, pid)
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

cartRouter.put('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const newProducts = req.body;
    try {
        const productsNuevos = await cartList.updateCart(cid, newProducts)
        res.status(201).send(productsNuevos)
    } catch (error) {
        console.log("Error al tratar de actualizar el carrito", error);
        res.status(500).send("Error al tratar de actualizar el carrito");
    }
})

// actualizo la cantidad del producto que esta en el carrito desde el req.body//
cartRouter.put('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;

    try {
        const updatedCart = await cartList.updateQuantityProduct(cid, pid, quantity);
        res.send(updatedCart);
    } catch (err) {
        res.status(500).send({ error: 'Error en la actualización de la cantidad' });
    }
});

// vaciamos los productos del carrito //
cartRouter.delete('/:cid/product/', async (req, res) => {
    const cid = req.params.cid;
    try {

        const clearCart = await cartList.clearProductToCart(cid)
        res.send(clearCart);
    } catch (err) {
        res.status(500).send({ error: 'No se pudo vaciar el carrito' });
    }
})



export { cartRouter };
