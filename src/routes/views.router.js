import express from "express";
import { Router } from "express";

const wiewsRouter = Router()



wiewsRouter.get('/chat', (req, res) => {

  res.render('chat');

});



export default wiewsRouter
