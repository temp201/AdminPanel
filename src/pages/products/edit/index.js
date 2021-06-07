import ProductForm from "../../../components/product-form";

export default class Page {
  element;
  subElements = {};
  components = {};

  constructor() {
    const paths = window.location.pathname.split('/').reverse();
    if (paths.length && paths[0] && paths[0] !== 'add') {
      this.productId = paths[0];
    }
    this.render();
  }

  async render() {
    const element = document.createElement('div');

    this.form = new ProductForm(this.productId);

    this.element = await this.form.render();

    return this.element;
  }

  destroy() {
    this.element.remove();
    this.form.destroy();
    this.form = null;
  }
}
