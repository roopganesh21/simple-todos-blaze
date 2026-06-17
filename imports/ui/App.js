// imports/ui/App.js
import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/TasksCollection';
import './App.html';
import './Task.js';

Template.mainContainer.helpers({
  tasks() {
    return TasksCollection.find({}, { sort: { createdAt: -1 } });
  },
});

Template.mainContainer.events({
  async 'submit form'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value.trim();

    if (text) {
      await TasksCollection.insertAsync({
        text,
        createdAt: new Date(),
        isChecked: false,
      });

      // Clear form input
      target.text.value = '';
    }
  },
});
