// imports/ui/Task.js
import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/TasksCollection';
import './Task.html';

Template.task.events({
  'click input[type=checkbox]'() {
    // Toggle checked status in MongoDB
    TasksCollection.updateAsync(this._id, {
      $set: { isChecked: !this.isChecked },
    });
  },
  'click .delete'() {
    // Remove task from MongoDB
    TasksCollection.removeAsync(this._id);
  },
});
