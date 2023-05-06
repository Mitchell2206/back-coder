 import { Router } from "express";

 const carts = []

 const cartRouter = Router();

 cartRouter.get('/', (req, res) =>{
    
     res.send(carts)
 });


 cartRouter.post('/', (req, res)=>{
    const cart = req.body;
    carts.push(cart)
    res.status(201).send(cart)
 }) 


 export { cartRouter } ;