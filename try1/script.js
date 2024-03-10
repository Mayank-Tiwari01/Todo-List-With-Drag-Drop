// Select the root element and the add todo list input/button
const root = document.getElementById('root');
const addTodoListInput = document.getElementById('addTodoListInput');
const addTodoListButton = document.getElementById('addTodoListButton');

// TodoList class
class TodoList {
  constructor(title) {
    this.title = title;
    this.cards = [];
    this.render();
  }

  render() {
    // Create elements
    this.listContainer = document.createElement('div');
    this.listContainer.classList.add('todoList');

    this.listTitle = document.createElement('h2');
    this.listTitle.textContent = this.title;

    this.addCardInput = document.createElement('input');
    this.addCardInput.classList.add('comment');
    this.addCardInput.placeholder = 'Add a new card';

    this.addCardButton = document.createElement('button');
    this.addCardButton.classList.add('btn-save');
    this.addCardButton.textContent = 'Add';

    this.cardsContainer = document.createElement('div');
    this.cardsContainer.classList.add('cardContainer');

    // Append elements
    this.listContainer.appendChild(this.listTitle);
    this.listContainer.appendChild(this.addCardInput);
    this.listContainer.appendChild(this.addCardButton);
    this.listContainer.appendChild(this.cardsContainer);

    // Add event listeners
    this.addCardButton.addEventListener('click', () => this.addCard());
    root.appendChild(this.listContainer);

    // Enable drag and drop
    this.enableDragAndDrop();
  }

  addCard() {
    const cardText = this.addCardInput.value.trim();
    if (cardText) {
        const card = new Card(cardText, this);
        card.cardData = card; // Store a reference to the card instance
        this.cards.push(card);
        this.addCardInput.value = '';
    }
}

enableDragAndDrop() {
    const dragStartHandler = (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.style.opacity = '0.4';
    };

    const dragOverHandler = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const dragEndHandler = (e) => {
        e.target.style.opacity = '1';
    };

    const dropHandler = (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain');
        const card = document.getElementById(cardId);
        const targetList = e.currentTarget.closest('.todoList');

        if (targetList && targetList !== card.parentNode.parentNode) {
            const sourceList = card.parentNode.parentNode.todoList;
            const sourceIndex = sourceList.cards.indexOf(card.cardData);
            sourceList.cards.splice(sourceIndex, 1);

            const targetCardsContainer = targetList.querySelector('.cardContainer');
            targetCardsContainer.appendChild(card);

            const targetListInstance = lists.find((list) => list.listContainer === targetList);
            targetListInstance.cards.push(card.cardData);
        }
    };

    const cards = Array.from(this.cardsContainer.getElementsByClassName('card'));
    cards.forEach((card) => {
        card.draggable = true;
        card.addEventListener('dragstart', dragStartHandler);
        card.addEventListener('dragover', dragOverHandler);
        card.addEventListener('dragend', dragEndHandler);
    });

    this.cardsContainer.addEventListener('dragover', dragOverHandler);
    this.cardsContainer.addEventListener('drop', dropHandler);
}
}

// Card class
class Card {
    constructor(text, todoList) {
        this.text = text;
        this.todoList = todoList;
        this.render();
    }
  render() {
    this.cardElement = document.createElement('div');
    this.cardElement.classList.add('card');
    this.cardElement.id = `card-${Date.now()}`;
    this.cardElement.textContent = this.text;

    this.deleteButton = document.createElement('button');
    this.deleteButton.textContent = 'X';
    this.deleteButton.addEventListener('click', () => this.deleteCard());

    this.cardElement.appendChild(this.deleteButton);
    this.todoList.cardsContainer.appendChild(this.cardElement);

    this.cardData = this; // Store a reference to the card instance
  }

  deleteCard() {
    this.cardElement.remove();
    const index = this.todoList.cards.indexOf(this.cardData);
    this.todoList.cards.splice(index, 1);
  }
}

// Create initial todo lists
const lists = [
  new TodoList('Not Started'),
  new TodoList('In Progress'),
  new TodoList('Completed'),
];

// Add event listener for creating new todo lists
addTodoListButton.addEventListener('click', () => {
  const newListTitle = addTodoListInput.value.trim();
  if (newListTitle) {
    const newList = new TodoList(newListTitle);
    lists.push(newList);
    addTodoListInput.value = '';
  }
});