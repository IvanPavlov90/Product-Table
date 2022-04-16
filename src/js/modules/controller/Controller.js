/* eslint-disable class-methods-use-this */
import $ from 'jquery';
import { DataModel } from '../models/DataModel';
import { TableView } from '../views/TableView';
import { ModalView } from '../views/ModalView';
import { SearchView } from '../views/SearchView';
import { emitter } from '../common/EventEmitter';
import { Validator } from '../common/Validator';
import { Template } from '../templates/Template';
import { city } from '../common/Constants';

class Controller {
  constructor () {
    this.dataModel = new DataModel();
    this.tableView = new TableView();
    this.SearchView = new SearchView();
    this.ModalView = new ModalView();
    this.Validator = new Validator();
    this.searchProducts = [];
    this.searchMode = false;
    emitter.subscribe('sortPrice', (data) => this.sortPrice(data.sortPrice));
    emitter.subscribe('sortName', (data) => this.sortName(data.sortName));
    emitter.subscribe('openModal', (data) => this.openModal(data.submitBtn, data.id));
    emitter.subscribe('closeModal', () => this.closeModal());
    emitter.subscribe('search', (data) => this.search(data.value));
    emitter.subscribe('openCoutrySelect', () => this.openCountrySelect());
    emitter.subscribe('closeCoutrySelect', () => this.closeCountrySelect());
    emitter.subscribe('enableCityOption', () => this.enableCityOption());
    emitter.subscribe('openCitySelect', (data) => this.openCitySelect(data.value));
    emitter.subscribe('nameInputChanged', (data) => this.nameInputValidation(data.value));
    emitter.subscribe('emailInputChanged', (data) => this.emailInputValidation(data.value));
    emitter.subscribe('countInputChanged', (data) => this.countInputValidation(data.value));
    emitter.subscribe('priceInputChanged', (data) => this.priceInputValidation(data.value));
    emitter.subscribe('formSubmit', (data) => this.formSubmit(data.event, data.name, data.email, data.count, data.price, data.delivery, data.country, data.cities));
    emitter.subscribe('deleteProduct', (data) => this.deleteProduct(data.id));
    emitter.subscribe('openDeleteModal', (data) => this.openDeleteModal(data.id));
  }

  async init() {
    await this.initTable();
    this.tableView.initListeners();
    this.initSearch();
  }

  initSearch() {
    this.SearchView.render();
    this.SearchView.initListeners();
  }

  async initTable() {
    await this.dataModel.getProducts().then(
      (value) => this.tableView.renderTable(value),
      (error) => console.log(error),
    );
  }

  sortPrice(value) {
    if (value && !this.searchMode) {
      this.dataModel.products.sort(function(a, b) {
        return b.price - a.price;
      });
      this.tableView.renderTable(this.dataModel.products);
      $('#priceArrow').html('&#9660');
    } else if (value && this.searchMode) {
      this.searchProducts.sort(function(a, b) {
        return b.price - a.price;
      });
      this.tableView.renderTable(this.searchProducts);
      $('#priceArrow').html('&#9660');
    } else if (!value && !this.searchMode) {
      this.dataModel.products.sort(function (a, b) {
        return a.price - b.price;
      });
      this.tableView.renderTable(this.dataModel.products);
      $('#priceArrow').html('&#9650');
    } else if (!value && this.searchMode) {
      this.searchProducts.sort(function (a, b) {
        return a.price - b.price;
      });
      this.tableView.renderTable(this.searchProducts);
      $('#priceArrow').html('&#9650');
    }
  }

  sortName(value) {
    if (value && !this.searchMode) {
      this.dataModel.products.sort(function(a, b) {
        if (b.name.toLowerCase() < a.name.toLowerCase()) {
          return -1;
        }
      });
      this.tableView.renderTable(this.dataModel.products);
      $('#nameArrow').html('&#9660');
    } else if (!value && !this.searchMode) {
      this.dataModel.products.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
      });
      this.tableView.renderTable(this.dataModel.products);
      $('#nameArrow').html('&#9650');
    } else if (value && this.searchMode) {
      this.searchProducts.sort(function(a, b) {
        if (b.name.toLowerCase() < a.name.toLowerCase()) {
          return -1;
        }
      });
      this.tableView.renderTable(this.searchProducts);
      $('#nameArrow').html('&#9660');
    } else if (!value && this.searchMode) {
      this.searchProducts.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
      });
      this.tableView.renderTable(this.searchProducts);
      $('#nameArrow').html('&#9650');
    }
  }

  openModal(submitBtn, id) {
    const countryArray = [];
    for (const key in city) {
      countryArray.push(key);
    }
    if (id !== '') {
      const product = this.dataModel.products.find((product) => product.id === id);
      if (product.delivery.country === null) {
        this.ModalView.renderAddModal(submitBtn, product.name, product.email, product.count, product.price, countryArray, product.id);
      } else {
        this.ModalView.renderUpdateModal(submitBtn, product.name, product.email, product.count, product.price, product.delivery, countryArray, product.id);
      }
    } else {
      this.ModalView.renderAddModal(submitBtn, '', '', '', '', countryArray);
    }
    this.ModalView.initListeners();
    $('#modalWindow').removeClass('invisible');
    $('#wrapper').removeClass('invisible');
  }

  closeModal() {
    $('#modalSection').html('');
  }

  openCountrySelect() {
    $('#countrySelect').removeClass('invisible');
  }

  closeCountrySelect() {
    $('#countrySelect').addClass('invisible');
    $('#citySelect').addClass('invisible');
    $('.cityDisabled').prop('disabled', true);
    $('.countryDisabled').prop('disabled', false);
    $('#countrySelect').removeClass('flex-order-2');
    $('#citySelect').removeClass('flex-order-1');
  }

  enableCityOption() {
    $('.cityDisabled').prop('disabled', false);
  }

  openCitySelect(value) {
    for (const key in city) {
      if (key === value) {
        this.ModalView.renderCitySelect(city[key]);
      }
    }
    $('#citySelect').removeClass('invisible');
    $('#citySelect').addClass('flex-order-1');
    $('#countrySelect').addClass('invisible');
    $('#countrySelect').addClass('flex-order-2');
    $('.countryDisabled').prop('disabled', true);
  }

  search(value) {
    if (value.trim().length === 0) {
      this.tableView.renderTable(this.dataModel.products);
      this.searchMode = false;
    } else if (value.trim().length > 0) {
      this.searchProducts = [];
      this.searchProducts = this.dataModel.products.filter((product) => product.name.toLowerCase().indexOf(value.trim().toLowerCase()) !== -1);
      this.tableView.renderTable(this.searchProducts);
      this.searchMode = true;
    }
  }

  showValidationError(firstElem, secondElem) {
    $(`#${firstElem}`).addClass('error');
    $(`#${secondElem}`).removeClass('invisible');
  }

  hideValidationError(firstElem, secondElem) {
    $(`#${firstElem}`).removeClass('error');
    $(`#${secondElem}`).addClass('invisible');
  }

  nameInputValidation(name) {
    if (!this.Validator.checkName(name)) {
      this.showValidationError('productName', 'productNameError');
    } else {
      this.hideValidationError('productName', 'productNameError');
    }
  }

  emailInputValidation(email) {
    if (!this.Validator.checkEmail(email)) {
      this.showValidationError('productEmail', 'productEmailError');
    } else {
      this.hideValidationError('productEmail', 'productEmailError');
    }
  }

  countInputValidation(count) {
    if (!this.Validator.checkCount(count)) {
      this.showValidationError('productCount', 'productCountError');
    } else {
      this.hideValidationError('productCount', 'productCountError');
    }
  }

  priceInputValidation(price) {
    if (!this.Validator.checkPrice(price)) {
      this.showValidationError('productPrice', 'productPriceError');
    } else {
      this.hideValidationError('productPrice', 'productPriceError');
    }
  }

  async formSubmit(event, name, email, count, price, deliverySelect, country, cities) {
    if (!this.Validator.checkName(name)) {
      this.showValidationError('productName', 'productNameError');
    } else if (!this.Validator.checkEmail(email)) {
      this.showValidationError('productEmail', 'productEmailError');
    } else if (!this.Validator.checkCount(count)) {
      this.showValidationError('productCount', 'productCountError');
    } else if (!this.Validator.checkPrice(price)) {
      this.showValidationError('productPrice', 'productPriceError');
    } else {
      switch (deliverySelect) {
        case 'country':
          cities = [];
          $('#deliveryError').removeClass('invisible');
          break;
        case 'empty':
          $('#deliveryError').addClass('invisible');
          if (event.target.dataset.action === 'Add') {
            await this.addProduct(name, email, count, price, null, []);
          } else if (event.target.dataset.action === 'Update') {
            await this.updateProduct(name, email, count, price, null, [], event.target.dataset.productid);
          }
          break;
        case 'city':
          if (cities.length > 0) {
            $('#deliveryError').addClass('invisible');
            if (event.target.dataset.action === 'Add') {
              await this.addProduct(name, email, count, price, country, cities);
            } else if (event.target.dataset.action === 'Update') {
              await this.updateProduct(name, email, count, price, country, cities, event.target.dataset.productid);
            }
          } else {
            $('#deliveryError').removeClass('invisible');
          }
          break;
        default:
          break;
      }
    }
  }

  async addProduct(name, email, count, price, country, cities) {
    await this.dataModel.addProduct(name, email, count, price, country, cities).then(
      (value) => {
        if (value.Success) {
          emitter.emit('closeModal', {});
          this.tableView.$root.html(Template.renderPreloader());
          this.SearchView.$root.html('');
        } else if (!value.Success) {
          this.openMessageModal('Something goes wrong. Please try once agian.');
        }
      },
    );
    await this.initTable();
    this.initSearch();
  }

  async updateProduct(name, email, count, price, country, cities, id) {
    await this.dataModel.updateProduct(name, email, count, price, country, cities, id).then(
      (value) => {
        console.log(value);
        if (value.Success) {
          emitter.emit('closeModal', {});
          this.tableView.$root.html(Template.renderPreloader());
          this.SearchView.$root.html('');
        } else if (!value.Success) {
          this.openMessageModal('Something goes wrong. Please try once agian.');
        }
      },
    );
    await this.initTable();
    this.initSearch();
  }

  openDeleteModal(id) {
    const chosenProduct = this.dataModel.products.filter((product) => product.id === id);
    this.ModalView.renderDeleteModal(chosenProduct);
    this.ModalView.initListeners();
    $('#modalWindow').removeClass('invisible');
    $('#wrapper').removeClass('invisible');
  }

  async deleteProduct(id) {
    await this.dataModel.deleteProduct(id).then(
      (value) => {
        if (value.Success) {
          emitter.emit('closeModal', {});
          this.tableView.$root.html(Template.renderPreloader());
          this.SearchView.$root.html('');
        } else if (!value.Success) {
          this.openMessageModal('Something goes wrong. Please try once agian.');
        }
      },
    );
    await this.initTable();
    this.initSearch();
  }

  openMessageModal(message) {
    this.ModalView.renderMessageModal(message);
    this.ModalView.initListeners();
    $('#modalWindow').removeClass('invisible');
    $('#wrapper').removeClass('invisible');
  }
}

export {
  Controller,
};
