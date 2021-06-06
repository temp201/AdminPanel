import ProductForm from "../../../components/product-form";

export default class Page {
  element;
  subElements = {};
  components = {};

  constructor() {
    this.productId = window.location.pathname.split('/').reverse()[0];
    this.render();
  }

  async render() {
    console.log(this.productId);
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
