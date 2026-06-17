import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import './main.html';
import '../imports/ui/App.js';
import '../imports/api/tasksMethods.js';

Meteor.startup(() => {
  Blaze.render(Template.mainContainer, document.getElementById('app'));
});
