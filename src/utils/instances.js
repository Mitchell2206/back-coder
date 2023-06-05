import ProductManager from "../controllers/Dao/DB/products.db.js";

import cartManagers from "../controllers/DAO/DB/cart.bd.js";
// instancias //
export const productList = new ProductManager();
export const cartList = new cartManagers();