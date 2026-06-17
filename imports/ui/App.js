import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import Sortable from 'sortablejs';
import { TasksCollection } from '../api/TasksCollection.js';
import './App.html';
import './Task.js';
import './Login.js';

const state = new ReactiveDict();

Template.todoList.onCreated(function() {
  this.subscribe('tasks');
  state.set('hideCompleted', false);
});

Template.todoList.onRendered(function() {
  console.log("todoList onRendered executed!");
  const list = this.find('.task-list');
  console.log("List element:", list);
  console.log("Sortable object:", Sortable);
  if (!list) return;

  try {
    const sortableInstance = Sortable.create(list, {
      animation: 150,
      draggable: '.task-item',
      async onEnd(evt) {
        console.log("Drag ended, updating order...");
        const items = list.querySelectorAll('.task-item');
        items.forEach(async (item, index) => {
          const taskId = item.dataset.id;
          if (taskId) {
            console.log(`Setting order of task ${taskId} to ${index}`);
            await Meteor.callAsync('tasks.updateOrder', { taskId, newOrder: index });
          }
        });
      }
    });
    console.log("Sortable instance created successfully:", sortableInstance);
  } catch (err) {
    console.error("Error creating Sortable instance:", err);
  }
});

Template.todoList.helpers({
  tasks() {
    if (state.get('hideCompleted')) {
      return TasksCollection.find({ isChecked: { $ne: true } }, { sort: { order: 1 } });
    }
    return TasksCollection.find({}, { sort: { order: 1 } });
  },
  hideCompleted() {
    return state.get('hideCompleted');
  },
  pendingTasksCount() {
    return TasksCollection.find({ isChecked: { $ne: true } }).count();
  },
  isLoading() {
    return !Template.instance().subscriptionsReady();
  },
});

Template.todoList.events({
  'click .logout-btn'() {
    Meteor.logout();
  },
  'click .hide-completed'() {
    state.set('hideCompleted', !state.get('hideCompleted'));
  },
  async 'submit form'(event) {
    event.preventDefault();
    const target = event.target;
    if (!target.text) return;
    const text = target.text.value.trim();
    const category = target.category.value;

    if (text) {
      await Meteor.callAsync('tasks.insert', { text, category });

      target.text.value = '';
      target.category.value = '';
    }
  },
});
