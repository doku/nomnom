angular.module('nom')
  .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('dishes', {
        url: '/dishes',
        template: '<dishes-list></dishes-list>'
      })
      .state('dishDetails', {
        url: '/dishes/:dishId',
        template: '<dish-details></dish-details>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            }
            else {
              return $q.resolve();
            }
          }
        }
      })
      .state('login', {
        url: '/login',
        template: '<login></login>'
      })
      .state('register', {
        url: '/register',
        template: '<register></register>'
      })
      .state('resetpw', {
        url: '/resetpw',
        template: '<resetpw></resetpw>'
      });

    $urlRouterProvider.otherwise("/dishes");
  })
  .run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      if (error === 'AUTH_REQUIRED') {
        $state.go('dishes');
      }
    });
  });
