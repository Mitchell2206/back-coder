import cartService from "../service/cart.service.js";
import cartDao from "../daos/dao.mongo/cart.dao.js";
import { isAuth } from "../middleware/auth.middleware.js";
import productController from "./product.controller.js";

class CartController {
    constructor() {
        this.service = new cartService(cartDao);
    }

    async addCart() {
        return this.service.addCart({ products: [] })
    }


    async getCartId(cid) {
        return await this.service.getCartId(cid)
    }

    async addProductCart(cid, pid) {
        try {
            const product = await productController.getProductsById(pid);
            if (product.length > 0) {
                const productStock = product[0]
                if (productStock.stock === 0) {

                    // creo un logger no hay productos
                } else {
                    return this.service.addProductCart(cid, pid);
                }
            }

        } catch (error) {
            
            console.log("Ocurrió un error al obtener el producto:", error.message);
        }

    }



    async deleteProductCart(cid, pid) {
        return this.service.deleteProductCart(cid, pid)
    }


    async updateCart(cid, newProducts) {

        return this.service.updateCart(cid, newProducts);

    }

    async updateQuantityProduct(cid, pid, qty) {
        return this.service.updateQuantityProduct(cid, pid, qty)
      // falta este para documentar
    } 

    async clearProductToCart(cid) {
        return this.service.clearProductToCart(cid);
    }


}

const cartController = new CartController;
export default cartController;