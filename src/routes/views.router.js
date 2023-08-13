import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { isAuth, isGuest } from '../middleware/auth.middleware.js';
import { authToken ,middlewarePassportJwt } from "../middleware/jwt.middleware.js";
import ErrorCodes from "../utils/error.js";
import CustomErrors from "../utils/customError.js";
import { generateErrorTokenNoFound } from "../utils/info.js";
import { generateProducts } from "../utils/generate.js";

const wiewsRouter = Router()


wiewsRouter.get('/profile' , middlewarePassportJwt, (req, res) => {

  if (!req.user) {
    CustomErrors.createError('token no found', generateErrorTokenNoFound(), 'Token caducado', ErrorCodes.AUTENTICACION_ERROR)
    //res.redirect('/errorcaduco')
  }

  res.render('profile', {
    title: 'Perfil de Usuario',
    message: 'Private route',
    user: req.user
  });
});

wiewsRouter.get('/', (req, res) => {
  res.render('register', {
    title: 'Registrar Nuevo Usuario',
  });
});


wiewsRouter.get('/login', (req, res) => {
  res.render('login', {
    title: 'Inicio de Sesión',
  });
});

wiewsRouter.get('/dataerror', isGuest, (req, res) => {
  res.render('dataerror', {
    title: 'Error en en datos ingresados',
  });
});

wiewsRouter.get('/errorexistsuser', isGuest, (req, res) => {
  res.render('errorexistsuser', {
    title: 'EL usuario ya existe',
  });
});


wiewsRouter.get('/errorservidor', isGuest, (req, res) => {
  res.render('errorservidor', {
    title: 'Error del servidor',
  });
});

wiewsRouter.get('/errorcaduco', isGuest, (req, res) => {
  res.render('errorcaduco', {
    title: 'token jwt expired',
  });
});



wiewsRouter.get('/index', authToken , middlewarePassportJwt, async (req, res) => {
  const { limit = 4, page = 1, sort, descripcion, availability } = req.query;

  try {
    // const products = generateProducts(page, limit, sort, descripcion, availability)

    const result = await productController.getProducts(limit, page, sort, descripcion, availability);
    const pag = result.pag;
    const prevPage = result.prevPage;
    const nextPage = result.nextPage;
    const totalPages = result.totalPages;



    const prevLink =
      prevPage &&
      `${req.baseUrl}/index/?page=${prevPage}&limit=${limit}&sort=${sort || ""
      }&descripcion=${encodeURIComponent(descripcion || "")}${availability ? `&availability=${availability}` : ""
      }`;


    const nextLink =
      nextPage &&
      `${req.baseUrl}/index/?page=${nextPage}&limit=${limit}&sort=${sort || ""
      }&descripcion=${encodeURIComponent(descripcion || "")}${availability ? `&availability=${availability}` : ""
      }`;


    const products = result.docs.map((product) => product.toObject());

    res.render("index", { title: "Products", products, products, pag, prevLink, totalPages, nextLink, user: req.user, });
  } catch (error) {
    res.status(500).send(`No se pudieron obtener los productos`);
  }
});


wiewsRouter.get('/chat', middlewarePassportJwt, (req, res) => {

  if (req.user.rol === 'ADMIN') {
    console.log('LOS ', req.user.rol, ' NO PUEDEN ENVIAR MENSAJES AL CHAT')
    res.status(500).redirect('/profile');
  }
  res.render('chat', { user: req.user });

});


wiewsRouter.get('/carts/', middlewarePassportJwt, async (req, res) => {

  res.render('cart', { user: req.user });
});


wiewsRouter.post('/', middlewarePassportJwt, isGuest, async (req, res) => {
  const id = req.params.id
  console.log(id)
  res.render('purchase', { user: req.user });
});


export default wiewsRouter
