// server/main.js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '../imports/api/TasksCollection';
import '../imports/api/tasksMethods.js';

async function insertTask({ text }) {
  await TasksCollection.insertAsync({ text, createdAt: new Date() });
}

Meteor.startup(async () => {
  if (await TasksCollection.find().countAsync() === 0) {
    await insertTask({ text: 'Buy groceries' });
    await insertTask({ text: 'Walk the dog' });
    await insertTask({ text: 'Code review' });
  }

  if (await Meteor.users.find().countAsync() === 0) {
    await Accounts.createUserAsync({
      username: 'meteorite',
      password: 'password',
    });
  }
});
