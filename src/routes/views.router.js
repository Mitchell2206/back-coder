import { Router } from "express";
import { productList } from '../utils/instances.js';
import CartManagers from "../controllers/DAO/service/cart.service.js";
import { isAuth, isGuest, auth} from '../middleware/auth.middleware.js';
import { cartList } from "../utils/instances.js";

const wiewsRouter = Router()


wiewsRouter.get('/profile' , isAuth, (req, res) => {
  const { user } = req.session;
  delete user.password;
  res.render('profile', {
    title: 'Perfil de Usuario',
    user,
  });
});

wiewsRouter.get('/', isGuest, (req, res) => {
  res.render('register', {
    title: 'Registrar Nuevo Usuario',
  });
});

wiewsRouter.get('/login', isGuest, (req, res) => {
  res.render('login', {
    title: 'Inicio de Sesión',
  });
});



wiewsRouter.get('/index', isAuth, async (req, res) => {
  const { user } = req.session;
  const { limit = 5, page = 1, sort, descripcion, availability } = req.query;

  try {
    const result = await productList.getProducts(limit, page, sort, descripcion, availability);
    const pag = result.page;
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

    //mapeo para evitar el Object.object
    const products = result.docs.map((product) => product.toObject());
    res.render("index", { title: "Products", products, prevLink, pag, totalPages, nextLink, user });
  } catch (error) {
    res.status(500).send(`No se pudieron obtener los productos`);
  }
});

wiewsRouter.get('/chat', (req, res) => {
  const { user } = req.session;
  res.render('chat', { user });

});

wiewsRouter.get('/carts/:cid', async (req, res) => {
  const cart = await cartList.getCartId(req.params.cid);
  console.log('Datos del carrito:', cart);
	res.render('cart', { cart });
});





export default wiewsRouter
