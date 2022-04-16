/* eslint-disable class-methods-use-this */
import $ from 'jquery';
import { emitter } from '../common/EventEmitter';

class TableView {
  constructor() {
    this.$root = $('#tableSection');
    this.sortPriceCounter = true;
    this.sortNameCounter = true;
  }

  renderTable(products) {
    let rows = '';
    products.forEach((product) => {
      rows += this.renderRow(product);
    });
    const table = this.renderTableTemplate(rows);
    this.$root.html(table);
  }

  initListeners() {
    this.$root.on('click', (event) => {
      switch (event.target.dataset.action) {
        case 'sortPrice':
          emitter.emit('sortPrice', { sortPrice: this.sortPriceCounter });
          this.sortPriceCounter = !this.sortPriceCounter;
          break;
        case 'sortName':
          emitter.emit('sortName', { sortName: this.sortNameCounter });
          this.sortNameCounter = !this.sortNameCounter;
          break;
        case 'edit':
          emitter.emit('openModal', { submitBtn: 'Update', id: event.target.dataset.productid });
          break;
        case 'delete':
          emitter.emit('openDeleteModal', { id: event.target.dataset.productid });
          break;
        default:
          break;
      }
    });
  }

  renderRow(product) {
    return `
      <tr>
        <td>
          <div class="table__body_firstCell">
            <div>
              <a data-productId="${product.id}" data-action="edit" href="#">${product.name}</a>
            </div>
            <div>
            ${product.count}
            </div>
          </div>
        </td>
        <td>${product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
        <td>
            <button data-productId="${product.id}" class="btn btn-success" data-action="edit">Edit</button>
            <button data-productId="${product.id}" class="btn btn-danger" data-action="delete">Delete</button>
        </td>
      </tr>`;
  }

  renderTableTemplate(rows) {
    return `
      <table class="table">
        <thead class="table__head">
          <tr>
            <th scope="col">
              <div class="table__head_Cell">
                <div>
                  <span data-action="sortName">Name</span>
                </div>
                <span id="nameArrow"></span>
              </div>
            </th>
            <th scope="col">
              <div class="table__head_Cell">
                <div>
                  <span data-action="sortPrice">Price</span>
                </div>
                <span id="priceArrow"></span>
              </div>
            </th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody class="table__body">
          ${rows}
        </tbody>
      </table>
    `;
  }
}

export {
  TableView,
}