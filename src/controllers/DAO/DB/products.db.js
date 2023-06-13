
import productModel from "../../models/product.model.js";
import mongoose from "mongoose";


export default class ProductManager {


    constructor() {
        this.product = productModel;
    }

    async addProducts(product) {
        return await this.product.create(product)
    }


    async updateProduct(uid, productActualizado) {
        return await this.product.updateOne({ _id: uid }, productActualizado);
    }


    async getProducts(limit, page, sort, descripcion, availability) {
        try {
            let options = {};
            let optionalQueries = {};
        
            // Verificar si se proporcionó el parámetro de categoría
            if (descripcion) {
              optionalQueries.descripcion = descripcion;
            }
        
            // Verificar si se proporcionó el parámetro de disponibilidad
            if (availability !== undefined) {
              optionalQueries.status = availability;
            }
        
            // Verificar el parámetro de orden
            if (sort === "asc") {
              options.sort = { price: 1 };
            } else if (sort === "desc") {
              options.sort = { price: -1 };
            }
        
            // paginate({},options)
            const products = await this.product.paginate(optionalQueries, {
              page: parseInt(page),
              limit: parseInt(limit),
              ...options,
            });
    
            return products;
          } catch (error) {
            throw new Error(`Error al obtener los productos: ${error}`);
          }
    }



    async getProductsById(uid) {
        return await this.product.find({ _id: uid })
    }


    async deleteProduct(pid) {
        return await this.product.deleteOne({ _id: pid });
    }

}