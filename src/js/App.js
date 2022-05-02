export default class App {
  constructor() {
    this.cards = [];
    this.anchor = null;
    this.clone = null;
  }

  init() {
    this.load();
    this.initEventListeners();
    this.renderCards();
  }

  initEventListeners() {
    this.columns = document.querySelectorAll('.column');
    const input = document.querySelectorAll('.card_input');
    document.addEventListener('mousedown', (evt) => this.columnOnmousedown(evt));
    document.addEventListener('mousemove', (evt) => this.columnOnmove(evt));
    document.addEventListener('mouseup', (evt) => this.columnOnmouseup(evt));
    this.columns.forEach((e) => {
      e.addEventListener('mouseleave', (evt) => this.columnOnmouseleave(evt));
      e.addEventListener('mouseenter', (evt) => this.columnOnmouseenter(evt));
      e.addEventListener('click', (evt) => App.columnOnclick(evt));
    });
    input.forEach((e) => e.addEventListener('keypress', (evt) => this.onCardInput(evt)));
  }

  renderCards() {
    [...this.columns].forEach((e) => {
      e.querySelector('.card_container').innerHTML = '';
    });
    this.cards.forEach((e) => {
      if (e.type === 'text') {
        const card = document.createElement('div');
        const cardText = document.createElement('span');
        const cardClose = document.createElement('span');
        card.classList.add('card');
        cardText.classList.add('card_text');
        cardClose.classList.add('card_close');
        cardClose.classList.add('hidden');
        cardClose.innerText = 'x';
        cardText.innerText = e.value;
        card.appendChild(cardText);
        card.appendChild(cardClose);
        this.columns[e.column].querySelector('.card_container').appendChild(card);
        card.addEventListener('mouseenter', (evt) => this.onCardMouseenter(evt));
        card.addEventListener('mouseleave', (evt) => this.onCardMouseleave(evt));
      }
    });
    this.save();
  }

  columnOnmousedown(evt) {
    const { target } = evt;
    if (target.classList.contains('card')) {
      this.clone = target.cloneNode(true);
      this.clone.classList.add('dragged');
      const rect = target.getBoundingClientRect();
      target.style.height = `${rect.height}px`;
      target.innerText = '';
      target.classList.add('anchor');
      target.classList.remove('card');
      this.clone.style.top = `${evt.pageY - this.clone.offsetHeight / 2}px`;
      this.clone.style.left = `${evt.pageX - this.clone.offsetWidth / 2}px`;
      document.body.appendChild(this.clone);
    }
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
      const cardText = this.clone.querySelector('.card_text').innerText;
      this.cards.find((e) => e.value === cardText).column = id;
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

  static columnOnclick(evt) {
    const { target } = evt;
    if (target.classList.contains('add_another_card')) {
      const input = target.closest('.column').querySelector('.card_input');
      input.classList.remove('hidden');
    }
  }

  onCardInput(evt) {
    if (evt.key === 'Enter') {
      const { target } = evt;
      const { id } = target.closest('.column').dataset;
      const newCard = {
        type: 'text', value: target.value, column: +id,
      };
      this.cards.push(newCard);
      this.renderCards();
      target.value = '';
      target.classList.add('hidden');
    }
  }

  onCardMouseenter(evt) {
    if (!evt.target.classList.contains('card')) return;
    const cross = evt.target.querySelector('.card_close');
    cross.classList.remove('hidden');
    cross.addEventListener('click', () => {
      const text = evt.target.querySelector('.card_text').innerText;
      for (let i = 0; i < this.cards.length; i += 1) {
        if (this.cards[i].value === text) {
          this.cards.splice(i, 1);
          break;
        }
      }
      this.renderCards();
    }, { once: true });
  }

  onCardMouseleave(evt) {
    if (!evt.target.classList.contains('card')) return;
    const cross = evt.target.querySelector('.card_close');
    cross.classList.add('hidden');
    this.renderCards();
  }

  save() {
    localStorage.cards = JSON.stringify(this.cards);
  }

  load() {
    if (localStorage.cards) {
      this.cards = JSON.parse(localStorage.cards);
    }
  }
}
