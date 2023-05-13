import { Router } from "express";
import cartManagers from "../controllers/cartManager.js";

const cartRouter = Router();

const cartList = new cartManagers();


cartRouter.post('/', async (req, res) => {

    const crearCarrito = await cartList.addCart()
    console.log(crearCarrito)
    try {
        res.status(201).send(crearCarrito);
    } catch (error) {
        res.status(400).send({ error });
    }
});

cartRouter.get('/:cid', async (req, res) => {
      
    try {
        const id = req.params.cid;
      let getID = await cartList.idToCart(id);
        res.status(200).send(await getID);
    } catch (err) {
        res.status(400).send({ err });
    }
});


cartRouter.post('/:cid/product/:pid', async (req, res) => {
	try {
		const cid = req.params.cid;
		const pid = req.params.pid;
		res.status(201).send(cartList.addProductCart(cid, pid));
	} catch (err) {
		res.status(400).send({ err });
	}
});



export { cartRouter };
