Package.describe({
  name: 'nom-browser',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('angular');
  api.use('less');

  api.addFiles([
    'client/lib/module.js',
    'client/auth/login/login.component.js',
    'client/auth/login/login.html',
    'client/auth/register/register.component.js',
    'client/auth/register/register.html',
    'client/auth/reset-password/reset-password.component.js',
    'client/auth/reset-password/reset-password.html',
    'client/nom/nom.html',
    'client/dishes/add-new-dish-modal/add-new-dish-modal.component.js',
    'client/dishes/add-new-dish-modal/add-new-dish-modal.html',
    'client/dishes/dishes-list/dishes-list.html',
    'client/dishes/dish-details/dish-details.component.js',
    'client/dishes/dish-details/dish-details.html',
    'client/dishes/styles/google-maps.css',
    'client/styles/navbar.import.less',
    'client/dishes/dish-details/dish-details.import.less',
    'client/dishes/dishes-list/dishes-list.import.less',
    'client/dishes/add-new-dish-modal/add-new-dish-modal.import.less',
    'client/styles/main.less'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('nom-mobile');
});
