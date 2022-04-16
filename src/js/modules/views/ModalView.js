/* eslint-disable class-methods-use-this */
import $ from 'jquery';
import { emitter } from '../common/EventEmitter';
import { city } from '../common/Constants';

class ModalView {
  constructor() {
    this.$root = $('#modalSection');
    this.allSelectorCounter = true;
  }

  renderAddModal(submitBtn, productName, productEmail, productCount, productPrice, countries, productID = '') {
    const countrySelect = this.renderCountrySelect(countries);
    const modalDelivery = this.renderAddModalDelivery(countrySelect);
    const modal = this.renderModal(submitBtn, productName, productEmail, productCount, productPrice, modalDelivery, productID);
    this.$root.html(modal);
  }

  renderUpdateModal(submitBtn, productName, productEmail, productCount, productPrice, productDelivery, countries, productID = '') {
    const countrySelect = this.renderCountrySelect(countries, productDelivery.country);
    const citySelect = this.renderCitySelectTemplate(city[productDelivery.country], productDelivery.city);
    const modalDelivery = this.renderUpdateModalDelivery(countrySelect, citySelect);
    const modal = this.renderModal(submitBtn, productName, productEmail, productCount, productPrice, modalDelivery, productID);
    this.$root.html(modal);
  }

  renderCitySelect (cities) {
    const citiesSelect = this.renderCitySelectTemplate(cities);
    $('#citySelect').html(citiesSelect);
  }

  renderDeleteModal(product) {
    const modal = this.renderDeleteModalTemplate(product);
    this.$root.html(modal);
  }

  renderMessageModal(message) {
    const modal = `
      <div class="wrap invisible" id="wrapper">
      </div>
      <div class="modal-window invisible" id="modalWindow">
        <div class="modal-window__delete-container">
          <p>${message}</p>
          <button type="button" class="btn btn-success" id="closeBtn">Ok</button>
        </div>
      </div>
    `;
    this.$root.html(modal);
  }

  initListeners() {
    $('#closeBtn').on('click', () => {
      emitter.emit('closeModal', {});
    });
    $('#closeDeleteModal').on('click', () => {
      emitter.emit('closeModal', {});
    });
    $('#confirmDeleting').on('click', (event) => {
      emitter.emit('deleteProduct', { id: event.target.dataset.productid });
    });
    $('#deliverySelect').change(function () {
      if ($(this).val() === 'country') {
        emitter.emit('openCoutrySelect', {});
      } else if ($(this).val() === 'empty') {
        emitter.emit('closeCoutrySelect', {});
      } else if ($(this).val() === 'city') {
        emitter.emit('openCitySelect', { value: $('input[name=countryRadioBtn]:radio:checked').val() });
      }
    });
    $('#countrySelect').change(function () {
      emitter.emit('enableCityOption', {});
    });
    $('#citySelect').on('change', (event) => {
      if (event.target.id === 'selectAll' && this.allSelectorCounter) {
        $('.cityCheckbox:checkbox').prop('checked', true);
      } else if (event.target.id === 'selectAll' && !this.allSelectorCounter) {
        $('.cityCheckbox:checkbox').prop('checked', false);
      }
      this.allSelectorCounter = !this.allSelectorCounter;
    });
    $('#form').submit(function (event) {
      event.preventDefault();
      const cities = [];
      $('.cityCheckbox:checkbox:checked').each(function () {
        if (this.value !== '') {
          cities.push(this.value);
        }
      });
      emitter.emit('formSubmit', {
        event: event,
        name: $('#productName').val(),
        email: $('#productEmail').val(),
        count: parseFloat($('#productCount').val()),
        price: parseFloat($('#productPrice').val().replace(/[^\d^.^-]/g, '')),
        delivery: $('#deliverySelect').val(),
        country: $('input[name=countryRadioBtn]:radio:checked').val(),
        cities: cities,
      });
    });
    $('#productName').blur(function () {
      emitter.emit('nameInputChanged', { value: $('#productName').val() });
    });
    $('#productEmail').blur(function () {
      emitter.emit('emailInputChanged', { value: $('#productEmail').val() });
    });
    $('#productCount').blur(function () {
      emitter.emit('countInputChanged', { value: parseFloat($('#productCount').val()) });
    });
    $('#productPrice').blur(function () {
      if ($('#productPrice').val() === '' || $('#productPrice').val().match(/[^\d^.]/g)) {
        $('#productPrice').val(0);
      }
      emitter.emit('priceInputChanged', { value: parseFloat($('#productPrice').val()) });
      $('#productPrice').val(parseFloat($('#productPrice').val()).toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
    });
  }

  renderModal (submitBtn, productName, productEmail, productCount, productPrice, modalDelivery, productID) {
    return `
      <div class="wrap invisible" id="wrapper">
      </div>
      <div class="modal-window invisible" id="modalWindow">
        <form action="" class="form" id="form" data-action="${submitBtn}" ${productID === '' ? 'data-productId=' : `data-productId="${productID}"`}>
          <div class="form__input-container">
            <div class="mb-3 form__input_large">
              <label for="productName" class="form-label">Name:</label>
              <input type="text" class="form-control" id="productName" value="${productName}" required>
            </div>
            <div class="form__error-div invisible" role="alert" id="productNameError">
              <span>Name can't be more then 15 symbols or consists only of white spaces</span>
            </div>
          </div>
          <div class="form__input-container">
            <div class="mb-3 form__input_large">
              <label for="productEmail" class="form-label">Supplier email:</label>
              <input type="text" class="form-control" id="productEmail" value="${productEmail}" required>
            </div>
            <div class="form__error-div invisible" role="alert" id="productEmailError">
              <span>Incorrect Email</span>
            </div>
          </div>
          <div class="form__input-container">
            <div class="mb-3 form__input_small">
              <label for="productCount" class="form-label">Count:</label>
              <input type="number" class="form-control" id="productCount" value="${productCount}" required>
            </div>
            <div class="form__error-div invisible" role="alert" id="productCountError">
              <span>Count can't be less then 0</span>
            </div>
          </div>
          <div class="form__input-container">
            <div class="mb-3 form__input_large">
              <label for="productPrice" class="form-label">Price:</label>
              <input type="text" class="form-control" id="productPrice" value="${productPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}" required>
            </div>
            <div class="form__error-div invisible" role="alert" id="productPriceError">
              <span>Price can't be less or equal 0</span>
            </div>
          </div>
          <label for="deliverySelect" class="form-label">Delivery:</label>
          <div class="form__selectors-group">
            ${modalDelivery}
          </div>
          <div class="form__input-container">
            <button type="submit" class="btn btn-success">${submitBtn}</button>
            <div class="form__error-div form__error-div_large invisible" role="alert" id="deliveryError">
              <span>You haven't chosen city yet.</span>
            </div>
          </div>  
          <div class="form__error-div invisible" role="alert" id="successMessage">
          </div>
        </form>
        <button class="btn btn-danger modal-window__close-btn" id="closeBtn">X</button>
      </div>
    `;
  }

  renderAddModalDelivery(countrySelect) {
    return `
      <select class="form__selectors-group__select" aria-label=".form-select-lg example" id="deliverySelect">
        <option value="empty" selected> </option>
        <option value="country" class="countryDisabled" > Страна </option>
        <option value="city" class="cityDisabled" disabled="disabled"> Город </option>
      </select>
      <div class="form__selectors-group__country-checkbox invisible" id="countrySelect">
        ${countrySelect}
      </div>
      <div class="form__selectors-group__city-checkbox invisible" id="citySelect">
      </div>
    `;
  }

  renderUpdateModalDelivery(countrySelect, citySelect) {
    return `
      <select class="form__selectors-group__select" aria-label=".form-select-lg example" id="deliverySelect">
        <option value="empty"> </option>
        <option value="country" class="countryDisabled" disabled="disabled"> Страна </option>
        <option value="city" class="cityDisabled" selected> Город </option>
      </select>
      <div class="form__selectors-group__country-checkbox invisible flex-order-2" id="countrySelect">
        ${countrySelect}
      </div>
      <div class="form__selectors-group__city-checkbox flex-order-1" id="citySelect">
        ${citySelect}
      </div>
    `;
  }

  renderCountrySelect(countries, selectedCountry = '') {
    let countryCheckBox = '';
    countries.forEach((country) => {
      if (country === selectedCountry) {
        countryCheckBox += `
          <div class="container">
            <input type="radio" name="countryRadioBtn" value="${country}" checked>
            <label class="form-check-label" for="${country}">
              ${country}
            </label>
          </div>
        `;
      } else {
        countryCheckBox += `
          <div class="container">
            <input type="radio" name="countryRadioBtn" value="${country}">
            <label class="form-check-label" for="${country}">
              ${country}
            </label>
          </div>
        `;
      }
    });
    return countryCheckBox;
  }

  renderCitySelectTemplate(cities, selectedCityArray = ['']) {
    let citiesCheckBox = `
      <div class="container">
        <input class="cityCheckbox" type="checkbox" value="" id="selectAll">
        <label class="form-check-label" for="selectAll">
          Select All
        </label>
      </div>
    `;
    cities.forEach((city) => {
      if (selectedCityArray.includes(city)) {
        citiesCheckBox += `
            <div class="container">
              <input class="cityCheckbox" type="checkbox" value="${city}" checked>
              <label class="form-check-label" for="${city}">
              ${city}
              </label>
            </div>  
          `;
      } else {
        citiesCheckBox += `
            <div class="container">
              <input class="cityCheckbox" type="checkbox" value="${city}">
              <label class="form-check-label" for="${city}">
              ${city}
              </label>
            </div>  
          `;
      }
    });
    return citiesCheckBox;
  }

  renderDeleteModalTemplate(product) {
    return `
      <div class="wrap invisible" id="wrapper">
      </div>
      <div class="modal-window invisible" id="modalWindow">
        <div class="modal-window__delete-container">
          <p>Would you like to delete ${product[0].name}?</p>
          <button type="button" class="btn btn-warning" id="confirmDeleting" data-productid="${product[0].id}">Yes</button>
          <button type="button" class="btn btn-warning" id="closeDeleteModal">No</button>
        </div>
      </div>
    `;
  }
}

export {
  ModalView,
}