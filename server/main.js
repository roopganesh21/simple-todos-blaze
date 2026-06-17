// server/main.js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '../imports/api/TasksCollection';
import '../imports/api/tasksMethods.js';
import '../imports/api/tasksPublications.js';

Meteor.startup(async () => {
  // Ensure default user exists and retrieve their ID
  let userId = null;
  const defaultUser = await Meteor.users.findOneAsync({ username: 'meteorite' });
  
  if (defaultUser) {
    userId = defaultUser._id;
  } else {
    userId = await Accounts.createUserAsync({
      username: 'meteorite',
      password: 'password',
    });
  }

  // Seed default tasks for the user with order indices if task collection is empty
  if (await TasksCollection.find().countAsync() === 0) {
    await TasksCollection.insertAsync({
      text: 'Buy groceries',
      order: 0,
      createdAt: new Date(),
      userId,
    });
    await TasksCollection.insertAsync({
      text: 'Walk the dog',
      order: 1,
      createdAt: new Date(),
      userId,
    });
    await TasksCollection.insertAsync({
      text: 'Code review',
      order: 2,
      createdAt: new Date(),
      userId,
    });
  }

  // Migration: Fix any existing tasks that don't have an order field
  const tasksWithoutOrder = await TasksCollection.find({ order: { $exists: false } }).fetchAsync();
  if (tasksWithoutOrder.length > 0) {
    console.log(`Migrating ${tasksWithoutOrder.length} tasks without an order field...`);
    for (let i = 0; i < tasksWithoutOrder.length; i++) {
      await TasksCollection.updateAsync(tasksWithoutOrder[i]._id, {
        $set: { order: i },
      });
    }
    console.log("Migration complete!");
  }
});
