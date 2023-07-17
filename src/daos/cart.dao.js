
import cartModel from '../models/carts.model.js';


class CartDao {

    constructor() {
        this.cart = cartModel;
    }

    async addCart() {
        try {
            const cart = await this.cart.create({ products: [] });
            return cart;
        } catch (error) {
            console.log(error);
        }
    }


    async getCartId(cid) {
        return await this.cart.findById(cid).populate('products.product').lean();
    }

    async addProductCart(cid, pid) {
        const cart = await this.cart.findOne({ _id: cid });
        const index = cart.products.findIndex((producto) => {
            return producto.product !== null && producto.product.toString() === pid;
        });

        if (index === -1) {
            cart.products.push({ product: pid, quantity: 1 })
        } else {
            cart.products[index].quantity += 1;
        }

        return await cart.save()
    }


    async getCartProducts(cid) {
        try {
            const cart = await this.cart.findById(cid).populate('products.product').lean()
            return cart
        } catch (err) {
            throw new Error(`No se pudo obtener el contenido del carrito: ${err}`);
        }

    }


    async getCartContents(cid) {
        try {
            const cart = await this.cart.findById(cid).populate('products.product').lean();

            if (!cart) {
                throw new Error("No existe el carrito buscado");
            }

            return cart;
        } catch (error) {
            throw new Error(`No se pudo obtener el contenido del carrito: ${error}`);
        }
    }


    async deleteProductCart(cid, pid) {

        const cart = await this.cart.findOne({ _id: cid });

        const updeteProdct = cart.products.filter(product => product._id != pid)
        console.log(updeteProdct)
        cart.products.splice(updeteProdct, 1)


        return await cart.save();
    }


    async updateCart(cid, newProducts) {

        const cart = await this.cart.findOne({ _id: cid });
        if (!cart) {
            throw new Error("No se encontró el carrito");
        }

        cart.products = newProducts.products;
        await cart.save();
        return cart;

    }

    async updateQuantityProduct(cid, pid, qty) {
        try {
            const cart = await this.cart.findOne({ _id: cid });
            const product = cart.products.find((product) => product._id == pid);
            if (!product) {
                throw new Error('No se encontró el producto en el carrito');
            }
            product.quantity = qty;

            await cart.save();
            return cart;
        } catch (err) {
            console.log('Error en la actualización de la cantidad:', err);
        }
    }

    async clearProductToCart(cid) {

        const cart = await this.cart.findOne({ _id: cid });
        cart.products = []
        return await cart.save();

    }

}


const cartDao = new CartDao;
export default cartDao;