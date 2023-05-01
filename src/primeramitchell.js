
import { Console } from 'console';
import { writeFileSync, promises, readFile } from 'fs';
import { parse } from 'path';
import { json } from 'stream/consumers';

export default class ProductManager {




    constructor() {
        this.products = [];
        this.productsId = 1;
    }

    addProducts(product) {

        if (product.title != '' && product.descripcion != '' && product.price != '' && product.thumbnail != '' && product.code != '') {

            product.id = this.productsId++;
            const filtro = this.products.filter(prod => prod.code === product.code);
            if (filtro.length > 0) {
                console.log("No puedes agregar mas de este articulo, porque es uno por persona")
                return;
            }


            this.products.push(product)
            console.log("El producto con el id: ", product.id, "Ha sido agregado.");
            writeFileSync('./archivoDeProducts.txt', JSON.stringify(this.products));

        } else (console.log("Todos los campos deben estar llenos"))


    }


    async updateProduct(product) {

        try {

            const todosLosProductos = JSON.parse(await promises.readFile('./archivoDeProducts.txt', 'utf-8'));
           
            const productoBuscado = todosLosProductos.find((prod) => prod.id === product.id);
            productoBuscado.title = product.title;
            productoBuscado.descripcion = product.descripcion;
            productoBuscado.price = product.price;
            productoBuscado.thumbnail = product.thumbnail;
            productoBuscado.code = product.code;
            const newProducts = todosLosProductos.filter((prod) => prod.id !== productoBuscado.id);
            newProducts.push(productoBuscado);
            writeFileSync('./archivoDeProducts.txt', JSON.stringify(newProducts))
            console.log("El producto con el id: ", product.id, "Ha sido actualizado")
            return newProducts;

        }
        catch (error) {
            console.log("No se agregaron mas productos")
        }

    }

    async getProducts() {

        try {
            const todosLosProductos = await promises.readFile('./archivoDeProducts.txt', 'utf-8');
            console.log(todosLosProductos)
            return JSON.parse(todosLosProductos);
        }
        catch (error) {
            console.log("No puedo ver el carrito de productos")
        }

        console.log(todosLosProductos)
    }

    async getProductsById(id) {

        try {

            let todosLosProductos = await promises.readFile('./archivoDeProducts.txt', 'utf-8');

            let filtro = JSON.parse(todosLosProductos).find((prod) => prod.id === id);
            if (filtro != null || filtro != undefined) {
                console.log("Producto encontrado ", filtro)
                return filtro
            } else {
                console.log("Producto id: ", id, " no encontrado.")
            }
        }

        catch (error) {
            console.log("error :", error)
        }

    }


    async deleteProduct(id) {

        try {
            const todosLosProductos = JSON.parse(await promises.readFile('./archivoDeProducts.txt', 'utf-8'));
            const newProducts = todosLosProductos.filter((prod) => prod.id !== id);
            promises.writeFile('./archivoDeProducts.txt', JSON.stringify(newProducts))

            return console.log("El producto con el id: ", id, "Ha sido eliminado.");
        }
        catch (error) {
            console.log("NO SE PUEDE ELIMINAR EL PRODUCTO")
        }
    }

}



const manager = new ProductManager();

const test = async () => {

    try {
        manager.addProducts({
            id: 0,
            title: 'oreo',
            descripcion: 'Galleta',
            price: '12.00',
            thumbnail: 'nose',
            code: 'AS001',
            stock: 10
        });

        manager.addProducts({
            id: 0,
            title: 'helado',
            descripcion: 'Helado de chocolate',
            price: '8000',
            thumbnail: 'nose2',
            code: 'AS002',
            stock: 10
        });
        manager.addProducts({
            id: 0,
            title: 'Banana',
            descripcion: 'fruta',
            price: '1500',
            thumbnail: 'nose5',
            code: 'AS003',
            stock: 10
        });
        manager.addProducts({
            id: 0,
            title: 'Santa Julia',
            descripcion: 'Vino',
            price: '4000',
            thumbnail: 'nose6',
            code: 'AS004',
            stock: 10
        });
        manager.addProducts({
            id: 0,
            title: 'Los hermanos',
            descripcion: 'Arroz',
            price: '700',
            thumbnail: 'nose7',
            code: 'AS005',
            stock: 10
        });

        // Producto actualizar //

        manager.updateProduct({
            id: 1,
            title: 'Dorito',
            descripcion: 'Snask',
            price: '15.00',
            thumbnail: 'nose',
            code: 'AS006',
            stock: 10
        });




    } catch (error) {
        console.log("no cargaron")
    }

}

test()

/*manager.getProducts()*/ ////*la podes activar cuando quieras traer todos los productos*/
//manager.getProductsById(2) ////ingresa el ID que quieras localizar, traido desde un archivo//
//manager.deleteProduct()// //ingresa el id del producto a eliminar//