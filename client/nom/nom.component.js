angular.module('nom').directive('nom', function () {
  return {
    restrict: 'E',
    templateUrl: () => {
      if (Meteor.isCordova) {
        return '/packages/nom-mobile/client/nom/nom.html';
      }
      else {
        return '/packages/nom-browser/client/nom/nom.html';
      }
    },
    controllerAs: 'nom',
    controller: function ($scope, $reactive) {
      $reactive(this).attach($scope);

      this.helpers({
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        },
        currentUser: () => {
          return Meteor.user();
        }
      });

      this.logout = () => {
        Accounts.logout();
      }
    }
  }
});
