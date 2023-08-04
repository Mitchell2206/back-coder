import { Router } from "express";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";
import cartController from "../controllers/cart.controller.js";
import ticketController from "../controllers/ticket.controller.js";

const ticketRouter = Router()


ticketRouter.post('/:id', middlewarePassportJwt, async (req, res) => {

    const cartClient = await cartController.getCartId(req.params.id)
    const user = req.user;
    const total = cartClient.products.reduce((acc, product) => acc + product.product.price * product.quantity, 0);
   

    const purchase_datatime = new Date().toLocaleString();
    console.log(purchase_datatime)


    const generateRandomCode = () => Math.floor(Math.random() * 90000) + 10000;
    const generatedCode = generateRandomCode();

    console.log(generatedCode);

    const createTicket = await ticketController.createTicket({
        code: generatedCode,
        purchase_datatime,
        amount: total,
        purchaser: user.email,
    })


    console.log(createTicket)
})






ticketRouter.get('/', async (req, res) => {
  const tickets = await ticketController.getTicket()
  console.log(tickets)
  res.status(200).send(tickets)
})


export { ticketRouter }