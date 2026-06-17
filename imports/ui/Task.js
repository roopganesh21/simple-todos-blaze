// imports/ui/Task.js
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './Task.html';

Template.task.events({
  async 'click input[type=checkbox]'() {
    // Toggle checked status via Meteor Method
    await Meteor.callAsync('tasks.setIsChecked', {
      taskId: this._id,
      isChecked: !this.isChecked,
    });
  },
  async 'click .delete'() {
    // Remove task via Meteor Method
    await Meteor.callAsync('tasks.remove', { taskId: this._id });
  },
});
