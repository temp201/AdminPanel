import RangePicker from '../../components/range-picker/index.js';
import SortableTable from '../../components/sortable-table/index.js';
import header from './sales-header.js';

export default class SalesPage {
  constructor() {
    this.from = new Date();
    this.from.setMonth(this.from.getMonth() - 1);
    this.to = new Date();  
    this.components = [];
    this.render();
  }

  async render() {

    const element = document.createElement('div');


    element.innerHTML = `
    <div class="sales full-height flex-column">
      <div class="content__top-panel" data-element="topPanel">
        <h1 class="page-title">Продажи</h1>
      </div>
      <div data-element="salesContainer" class="full-height flex-column"></div>
    </div>`; 
    this.element = element.firstElementChild;  

    this.subElements = this.getSubElements(this.element);

    const picker = new RangePicker({from: this.from, to: this.to});
    this.components.push(picker);
    this.subElements.topPanel.append(picker.element);

    const table = new SortableTable(header, {url: '/api/rest/orders', sorted: {id: 'createdAt', order: 'desc'}, filter: {createdAt_gte: this.from.toISOString(), createdAt_lte: this.to.toISOString()}});
    this.components.push(table);
    this.subElements.salesContainer.append(table.element);

    this.element.addEventListener('date-select', event => {
      this.from = event.detail.from;
      this.to = event.detail.to;
      this.components.forEach(component => {
        if (component['changeFilter']) {
          component.changeFilter({createdAt_gte: this.from.toISOString(), createdAt_lte: this.to.toISOString()});
        }
      });
    });

    return this.element;
    
  }

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