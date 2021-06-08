import DoubleSlider from '../../../components/double-slider/index.js';
import SortableTable from '../../../components/sortable-table/index.js';
import header from './products-header.js';

export default class Page {
  element;
  subElements = {};
  components = [];

  constructor () {
    this.minPrice = 0;
    this.maxPrice = 4000;
    this.render();
  }

  async render() {
    const element = document.createElement('div');

    element.innerHTML = `
    <div class="products-list">
    <div class="content__top-panel">
      <h1 class="page-title">Товары</h1>
      <a href="/products/add" class="button-primary">Добавить товар</a>
    </div>
    <div class="content-box content-box_small">
      <form class="form-inline">
        <div class="form-group">
          <label class="form-label">Сортировать по:</label>
          <input type="text" data-element="filterName" class="form-control" placeholder="Название товара">
        </div>
        <div class="form-group" data-element="sliderContainer">
          <label class="form-label">Цена:</label>
        </div>
        <div class="form-group">
          <label class="form-label">Статус:</label>
          <select class="form-control" data-element="filterStatus">
            <option value="" selected="">Любой</option>
            <option value="1">Активный</option>
            <option value="0">Неактивный</option>
          </select>
        </div>
      </form>
    </div>
    <div data-element="productsContainer" class="products-list__container"></div>
  </div>`;

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);

    const slider = new DoubleSlider({min: this.minPrice, max: this.maxPrice});
    this.components.push(slider);
    this.subElements.sliderContainer.append(slider.element);

    const filter = {
      _embed: 'subcategory.category',
      price_gte: this.minPrice,
      price_lte: this.maxPrice,
    };

    const table = new SortableTable(header, {url: '/api/rest/products', filter, linkUrl: '/products/', linkId: 'id'});
    this.components.push(table);
    this.subElements.productsContainer.append(table.element);

    this.element.addEventListener('range-select', this.handleSliderChanged);
    this.subElements.filterName.addEventListener('input', this.refreshTableData);
    this.subElements.filterStatus.addEventListener('change', this.refreshTableData);

    return this.element;
  }

  refreshTableData = () => {
    const filter = {
      _embed: 'subcategory.category',
      price_gte: this.minPrice,
      price_lte: this.maxPrice,
    };
    if (this.subElements.filterName.value) {
      filter.title_like = this.subElements.filterName.value;
    }
    if (this.subElements.filterStatus.value) {
      filter.status = this.subElements.filterStatus.value;
    }
    this.components.forEach(component => {
      if (component['changeFilter']) {
        component.changeFilter(filter);
      }
    });
  }

  handleSliderChanged = (event) => {
    this.minPrice = event.detail.from;
    this.maxPrice = event.detail.to;
    this.refreshTableData();
  };

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }
  
  remove() {
    this.components.forEach(component => component.destroy());  
    this.components = null;
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
    
  destroy() {
    this.remove();
  }
}
