export default class App {
  constructor() {
    this.cards = [{ type: 'text', value: 'Test 123', column: 2 }, { type: 'text', value: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat culpa repellat, eum assumenda veniam sapiente a minima, ipsum fugit magnam fuga vel! Laboriosam iusto eos a atque vitae officiis ratione?', column: 2 }];
    this.anchor = null;
    this.clone = null;
  }

  init() {
    this.initEventListeners();
    this.renderCards();
  }

  initEventListeners() {
    this.columns = document.querySelectorAll('.column');
    document.addEventListener('mousedown', (evt) => this.columnOnmousedown(evt));
    document.addEventListener('mousemove', (evt) => this.columnOnmove(evt));
    document.addEventListener('mouseup', (evt) => this.columnOnmouseup(evt));
    this.columns.forEach((e) => e.addEventListener('mouseleave', (evt) => this.columnOnmouseleave(evt)));
    this.columns.forEach((e) => e.addEventListener('mouseenter', (evt) => this.columnOnmouseenter(evt)));
  }

  renderCards() {
    [...this.columns].forEach((e) => {
      e.querySelector('.card_container').innerHTML = '';
    });
    this.cards.forEach((e) => {
      if (e.type === 'text') {
        this.columns[e.column].querySelector('.card_container').innerHTML += `
          <div class="card">${e.value}</div>
        `;
      }
    });
  }

  columnOnmousedown(evt) {
    const { target } = evt;
    if (target.classList.contains('card')) {
      this.clone = target.cloneNode(true);
      this.clone.classList.add('dragged');
      this.clone.style.top = `${evt.pageY - this.clone.offsetHeight / 2}px`;
      this.clone.style.left = `${evt.pageX - this.clone.offsetWidth / 2}px`;
    }
    document.body.appendChild(this.clone);
  }

  columnOnmove(evt) {
    if (this.clone === null) return;
    if (!this.clone.classList.contains('dragged')) return;
    if (evt.target.closest('.column') !== null) {
      this.cardContainer = evt.target.closest('.column').querySelector('.card_container');
    }
    this.clone.style.top = `${evt.pageY - this.clone.offsetHeight / 2}px`;
    this.clone.style.left = `${evt.pageX - this.clone.offsetWidth / 2}px`;
  }

  columnOnmouseup(evt) {
    if (this.clone !== null) {
      const { id } = evt.target.closest('.column').dataset;
      this.cards.find((e) => e.value === this.clone.innerText).column = id;
      this.renderCards();
      this.clone.remove();
      this.clone = null;
    }
  }

  columnOnmouseleave() {
    if (this.anchor) {
      this.anchor.remove();
    }
  }

  columnOnmouseenter(evt) {
    if (!this.clone) return;
    this.cardContainer = evt.target.querySelector('.card_container');
    this.anchor = document.createElement('div');
    this.anchor.classList.add('anchor');
    this.anchor.style.width = '300px';
    this.anchor.style.height = `${this.clone.getBoundingClientRect().height}px`;
    if (this.cardContainer.querySelector('.anchor') === null) {
      this.cardContainer.appendChild(this.anchor);
    }
  }
}
