
import { userModel } from '../../models/product.model.js';


export default class ProductManager {


    constructor() {
        this.product = userModel;
    }

    async addProducts(product) {
        return await this.product.create(product)
    }


    async updateProduct(uid, productActualizado) {
        return await this.product.updateOne({ _id: uid }, productActualizado);
    }

    async getProducts() {
        return await this.product.find();
    }

    async getProductsById(uid) {
        return await this.product.find({ _id: uid })
    }


    async deleteProduct(id) {
        return await this.product.deleteOne({ _id: id });
    }

}