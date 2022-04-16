import { ProductModel } from './ProductModel';

class UpdateProductModel extends ProductModel {
  constructor(id, name, email, count, price, country, city) {
    super(name, email, count, price, country, city);
    this.id = id;
  }
}

export {
  UpdateProductModel,
}