const dateFormat = {dateStyle: 'short'};
const header = [
  {
    id: 'id',
    title: 'ID',
    sortable: false,
  },
  {
    id: 'user',
    title: 'Клиент',
    sortable: false,
  },
  {
    id: 'createdAt',
    title: 'Дата',
    sortable: true,
    sortType: 'date',
    template: (val) => {
      return `<div class="sortable-table__cell">${new Date(val).toLocaleString('ru', dateFormat)}</div>`;
    },
  },
  {
    id: 'totalCost',
    title: 'Стоимость',
    sortable: true,
    sortType: 'number',
    template: (val) => `<div class="sortable-table__cell">$${val}</div>`,
  },
  {
    id: 'delivery',
    title: 'Статус',
    sortable: false,
  },
];
  
export default header;
  