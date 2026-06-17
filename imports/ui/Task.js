import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './Task.html';

Template.task.helpers({
  categoryClass() {
    const map = { Work: 'category-work', Personal: 'category-personal', Urgent: 'category-urgent' };
    return map[this.category] || '';
  }
});

Template.task.events({
  async 'click input[type=checkbox]'() {
    await Meteor.callAsync('tasks.setIsChecked', {
      taskId: this._id,
      isChecked: !this.isChecked,
    });
  },
  async 'click .delete'() {
    await Meteor.callAsync('tasks.remove', { taskId: this._id });
  },
});
