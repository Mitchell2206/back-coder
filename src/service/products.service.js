
export default class ProductService {
  constructor(dao) {
    this.dao = dao;
  }

  addProducts(product) {
    return this.dao.addProducts(product)
  }

  async getProducts(limit, page, sort, descripcion, availability) {
    const result = await this.dao.getProducts(limit, page, sort, descripcion, availability);
    return result;
  }


  updateProduct(uid, productActualizado) {
    return this.dao.updateProduct(uid, productActualizado);
  }

  getProductsById(uid) {
    return this.dao.getProductsById(uid)
  }


  deleteProduct(pid) {
    return this.dao.deleteProduct(pid);
  }

}