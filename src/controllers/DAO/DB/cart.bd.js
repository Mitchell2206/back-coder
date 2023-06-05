import { cartModel } from '../../models/carts.model.js';
import { productList } from '../../../utils/instances.js';
import { menssagerModel } from '../../models/menssage.model.js';

export default class cartManagers {

    constructor() {
        this.model = cartModel;
        this.menssage = menssagerModel;
    }

    async addCart(carts) {
        carts.products = [];
        return await this.model.create(carts)
    }

    async getProducts() {
        return await this.model.find();
    }

    async addProductCart(cid, pid) {
        console.log(cid, pid)
        const cart = await this.model.findOne({ _id: cid });
        const product = await productList.getProductsById(pid);

        const productId = product[0]._id;
        cart.products.push(productId)
        return await cart.save()

    }

    async getMenssage() {
        return  console.log(await this.menssage.find()) 
    }




}