/* eslint-disable class-methods-use-this */
import $ from 'jquery';
import { emitter } from '../common/EventEmitter';

class SearchView {
  constructor() {
    this.$root = $('#searchSection');
  }

  render() {
    const search = this.renderSearchTemplate();
    this.$root.html(search);
  }

  initListeners() {
    $('#addBtn').on('click', () => {
      emitter.emit('openModal', { submitBtn: 'Add', id: '' });
    });
    $('#searchBtn').on('click', () => {
      emitter.emit('search', { value: $('#searchInput').val() });
    });
  }

  renderSearchTemplate () {
    return `
      <input type="text" class="search__input" placeholder="Введите наименование товара" id="searchInput">
      <button type="button" class="btn btn-warning" id="searchBtn">Search</button>
      <button type="button" class="btn btn-success" id="addBtn">Add New</button>
    `;
  }
}

export {
  SearchView,
};
