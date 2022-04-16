/* eslint-disable class-methods-use-this */
import { ProductModel } from './ProductModel';
import { UpdateProductModel } from './UpdateProductModel';

class DataModel {
  constructor() {
    this.products = [];
  }

  async getProducts() {
    this.products = [];
    const response = await fetch(
      'https://api-crud-mongo.herokuapp.com/api/v1/products',
    );
    const data = await response.json();
    data.Data.forEach((product) => {
      this.products.push(product);
    });
    return this.products;
  }

  async addProduct(name, email, count, price, country, cities) {
    const product = new ProductModel(name, email, count, price, country, cities);
    const response = await fetch(
      'https://api-crud-mongo.herokuapp.com/api/v1/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      },
    );
    const data = await response.json();
    if (data.Success && country !== null) {
      const dataUpdate = await this.updateProduct(data.Data.name, data.Data.email, data.Data.count, data.Data.price, country, cities, data.Data.id);
      return dataUpdate;
    }
    return data;
  }

  async deleteProduct(id) {
    const response = await fetch(
      `https://api-crud-mongo.herokuapp.com/api/v1/products/delete/${id}`, {
        method: 'DELETE',
      },
    );
    const data = await response.json();
    return data;
  }

  async updateProduct(name, email, count, price, country, cities, id) {
    const product = new UpdateProductModel(id, name, email, count, price, country, cities);
    const response = await fetch(
      `https://api-crud-mongo.herokuapp.com/api/v1/products/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      },
    );
    const data = await response.json();
    return data;
  }
}

export { 
  DataModel 
};
