// imports/ui/App.js
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TasksCollection } from '../api/TasksCollection.js';
import './App.html';
import './Task.js';
import './Login.js';

const state = new ReactiveDict();

Template.mainContainer.onCreated(function() {
  state.set('hideCompleted', false);
});

Template.mainContainer.helpers({
  tasks() {
    if (state.get('hideCompleted')) {
      return TasksCollection.find({ isChecked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    return TasksCollection.find({}, { sort: { createdAt: -1 } });
  },
  hideCompleted() {
    return state.get('hideCompleted');
  },
  pendingTasksCount() {
    return TasksCollection.find({ isChecked: { $ne: true } }).count();
  },
});

Template.mainContainer.events({
  'click .logout-btn'() {
    Meteor.logout();
  },
  'click .hide-completed'() {
    state.set('hideCompleted', !state.get('hideCompleted'));
  },
  async 'submit form'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    if (!target.text) return;
    const text = target.text.value.trim();

    if (text) {
      await Meteor.callAsync('tasks.insert', { text });

      // Clear form input
      target.text.value = '';
    }
  },
});
