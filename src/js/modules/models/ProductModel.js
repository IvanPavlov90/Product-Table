class ProductModel {
  constructor(name, email, count, price, country, city) {
    this.name = name;
    this.email = email;
    this.count = count;
    this.price = price;
    this.delivery = {
      country: country,
      city: city,
    };
  }
}

export {
  ProductModel,
}