import { createElement, EventEmitter } from './helpers';

/**
 * Представление отвечает за внешний вид, за взаимодействие
 * с HTML.
 * Представление как и модель ничего незнает о своем окружении. Всё что знает
 * представление это как работать с DOM элементами.
 */
class View extends EventEmitter {
  constructor() {
    super();

    this.form = document.getElementById('todo-form');
    this.input = document.getElementById('add-input');
    this.list = document.getElementById('todo-list');

    this.form.addEventListener('submit', this.handleAdd.bind(this));
  }

  createElement(todo) {
    const checkbox = createElement('input', {
      type: 'checkbox',
      className: 'checkbox',
      checked: todo.completed ? 'checked' : '',
    });
    const label = createElement('label', { className: 'title' }, todo.title);
    const editInput = createElement('input', { type: 'text', className: 'textfield' });
    const editButton = createElement('button', { className: 'edit' }, 'Edit');
    const removeButton = createElement('button', { className: 'remove' }, 'Remove');
    const item = createElement('li', {
      className: `todo-item${todo.completed ? ' completed' : ''}`,
      'data-id': todo.id,
    }, checkbox, label, editInput, editButton, removeButton);

    return this.addEventListeners(item);
  }

  addEventListeners(listItem) {
    const checkbox = listItem.querySelector('.checkbox');
    const editButton = listItem.querySelector('button.edit');
    const removeButton = listItem.querySelector('button.remove');

    checkbox.addEventListener('change', this.hancleToggle.bind(this));
    editButton.addEventListener('click', this.handleEdit.bind(this));
    removeButton.addEventListener('click', this.handleRemove.bind(this));

    return listItem;
  }

  handleAdd(event) {
    event.preventDefault();

    if (!this.input.value) return alert('Enter task name');

    const value = this.input.value;

    this.emit('add', value);
  }

  hancleToggle({ target }) {
    const listItem = target.parentNode;
    const id = listItem.getAttribute('data-id');
    const completed = target.checked;

    this.emit('toggle', { id, completed });
  }

  handleEdit({ target }) {
    const listItem = target.parentNode;
    const id = listItem.getAttribute('data-id');
    const label = listItem.querySelector('.title');
    const input = listItem.querySelector('.textfield');
    const editButton = listItem.querySelector('button.edit');
    const title = input.value;
    const isEditing = listItem.classList.contains('editing');

    if (isEditing) {
      this.emit('edit', { id, title });
    } else {
      input.value = label.textContent;
      editButton.textContent = 'Save';
      listItem.classList.add('editing');
    }
  }

  handleRemove({ target }) {
    const listItem = target.parentNode;
    const id = listItem.getAttribute('data-id');

    this.emit('remove', id);
  }

  findListItem(id) {
    return this.list.querySelector(`[data-id="${id}"]`);
  }

  show(todos) {
    todos.forEach((todo) => {
      const listItem = this.createElement(todo);

      this.list.appendChild(listItem);
    });
  }

  addItem(todo) {
    const listItem = this.createElement(todo);

    this.input.value = '';
    this.list.appendChild(listItem);
  }

  toggleItem(todo) {
    const listItem = this.findListItem(todo.id);
    const checkbox = listItem.querySelector('.checkbox');

    checkbox.checked = todo.completed;

    if (todo.completed) {
      listItem.classList.add('completed');
    } else {
      listItem.classList.remove('completed');
    }
  }

  editItem(todo) {
    const listItem = this.findListItem(todo.id);
    const label = listItem.querySelector('.title');
    const editButton = listItem.querySelector('button.edit');

    label.textContent = todo.title;
    editButton.textContent = 'Edit';
    listItem.classList.remove('editing');
  }

  removeItem(id) {
    const listItem = this.findListItem(id);

    this.list.removeChild(listItem);
  }
}

export default View;
