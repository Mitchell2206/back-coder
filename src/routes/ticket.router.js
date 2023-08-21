import { Router } from "express";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";
import cartController from "../controllers/cart.controller.js";
import ticketController from "../controllers/ticket.controller.js";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";




const ticketRouter = Router()

ticketRouter.post('/:id', middlewarePassportJwt, async (req, res, next) => {
  try {
    const user = req.user;
    const client = await userModel.findById(user._id);
    const cartClient = await cartController.getCartId(req.params.id);

    client.cart.push(cartClient);
    await client.save();

    const productsToUpdate = cartClient.products.map(item => {
      return {
        productId: item.product._id,
        quantity: item.quantity
      };
    });

    const updateOperations = productsToUpdate.map(item => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stock: -item.quantity } }
      }
    }));

    await productModel.bulkWrite(updateOperations);

    const total = cartClient.products.reduce((acc, product) => acc + product.product.price * product.quantity, 0);
    const purchase_datatime = new Date().toLocaleString();
    const generatedCode = Math.floor(Math.random() * 90000) + 10000;

    const createTicket = await ticketController.createTicket({
      code: generatedCode,
      purchase_datatime,
      amount: total,
      purchaser: user.email,
    });

    return res.status(201).send(createTicket);

  } catch (err) {
    next(err)
    req.logger.error(`Error al generar el ticket`);
    return res.status(500).send(err);
  }
});



ticketRouter.get('/', async (req, res) => {
  const tickets = await ticketController.getTicket()
  res.status(200).send(tickets)
})


export { ticketRouter }