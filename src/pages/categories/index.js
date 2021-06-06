const BACKEND_URL = 'https://course-js.javascript.ru';
import fetchJson from '../../utils/fetch-json.js';
import SortableList from '../../components/sortable-list/index.js';

export default class CategoriesPage { 

  constructor () {
    this.components = [];
    this.render();
  }

  async loadCategories () {
    return await fetchJson(`${BACKEND_URL}/api/rest/categories?_sort=weight&_refs=subcategory`);
  }

  renderCategory(item) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div class="category category_open" data-id="${item.id}">
      <header class="category__header">
      ${item.title}
      </header>
      <div class="category__body">
        <div class="subcategory-list"></div>
      </div>  
    </div>`;
    const container = wrapper.querySelector('.subcategory-list');
    const listItems = [];
    item.subcategories.forEach(sub => {
      const liWrapper = document.createElement('div');
      liWrapper.innerHTML = `<li class="categories__sortable-list-item sortable-list__item" data-grab-handle="" data-id="${sub.id}">
        <strong>${sub.title}</strong>
        <span><b>${sub.count}</b> products</span>
        </li>`;
      listItems.push(liWrapper.firstElementChild);
    });
    const sortList = new SortableList({items: listItems});
    this.components.push(sortList);
    container.append(sortList.element);

    return wrapper.firstElementChild;
  }

  async render() {

    this.categoriesData = await this.loadCategories();

    const element = document.createElement('div');


    element.innerHTML = `
    <div class="categories">
      <div class="content__top-panel">
        <h1 class="page-title">Категории товаров</h1>
      </div>
      <div data-element="categoriesContainer">
      </div>
    </div>`; 
    this.element = element.firstElementChild;  

    this.subElements = this.getSubElements(this.element);
    this.categoriesData.forEach(item => {
      this.subElements.categoriesContainer.append(this.renderCategory(item));
    });

    this.element.addEventListener('click', this.handleClick);

    return this.element;
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  handleClick = (event) => {
    const element = event.target.closest('.category');
    if (element) {
        element.classList.toggle('category_open');
    }
  };

  remove() {
    this.components.forEach(component => component.destroy());  
    this.element.removeEventListener('click', this.handleClick);
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  destroy() {
    this.remove();
  }
}