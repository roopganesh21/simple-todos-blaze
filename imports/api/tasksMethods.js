// imports/api/tasksMethods.js
import { Meteor } from 'meteor/meteor';
import { TasksCollection } from './TasksCollection.js';

Meteor.methods({
  async 'tasks.insert'({ text, category }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Determine the next order index for sequential drag-and-drop
    const lastTask = await TasksCollection.findOneAsync(
      { userId: this.userId },
      { sort: { order: -1 } }
    );
    const order = lastTask && lastTask.order !== undefined ? lastTask.order + 1 : 0;

    await TasksCollection.insertAsync({
      text,
      category,
      isChecked: false,
      createdAt: new Date(),
      userId: this.userId,
      order,
    });
  },

  async 'tasks.remove'({ taskId }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const task = await TasksCollection.findOneAsync({ _id: taskId });

    if (!task || task.userId !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    await TasksCollection.removeAsync(taskId);
  },

  async 'tasks.setIsChecked'({ taskId, isChecked }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const task = await TasksCollection.findOneAsync({ _id: taskId });

    if (!task || task.userId !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    await TasksCollection.updateAsync(taskId, {
      $set: { isChecked },
    });
  },

  async 'tasks.updateOrder'({ taskId, newOrder }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const task = await TasksCollection.findOneAsync({ _id: taskId });

    if (!task || task.userId !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    await TasksCollection.updateAsync(taskId, {
      $set: { order: newOrder },
    });
  },
});
