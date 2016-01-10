angular.module('nom.browser').directive('dishDetails', function () {
  return {
    restrict: 'E',
    templateUrl: '/packages/nom-browser/client/dishes/dish-details/dish-details.html',
    controllerAs: 'dishDetails',
    controller: function ($scope, $stateParams, $reactive) {
      $reactive(this).attach($scope);

      this.subscribe('dishes');
      this.subscribe('users');

      this.helpers({
        dish: () => {
          return Dishes.findOne({_id: $stateParams.dishId});
        },
        users: () => {
          return Meteor.users.find({});
        },
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        },
        currentUserId: () => {
          return Meteor.userId();
        }
      });

      this.map = {
        center: {
          latitude: 45,
          longitude: -73
        },
        zoom: 8,
        events: {
          click: (mapModel, eventName, originalEventArgs) => {
            if (!this.dish)
              return;

            if (!this.dish.location)
              this.dish.location = {};

            this.dish.location.latitude = originalEventArgs[0].latLng.lat();
            this.dish.location.longitude = originalEventArgs[0].latLng.lng();

            //scope apply required because this event handler is outside of the angular domain
            $scope.$apply();
          }
        },
        marker: {
          options: { draggable: true },
          events: {
            dragend: (marker, eventName, args) => {
              if (!this.dish.location)
                this.dish.location = {};

              this.dish.location.latitude = marker.getPosition().lat();
              this.dish.location.longitude = marker.getPosition().lng();
            }
          }
        }
      };

      this.save = () => {
        Dishes.update({_id: $stateParams.dishId}, {
          $set: {
            name: this.dish.name,
            description: this.dish.description,
            'public': this.dish.public,
            location: this.dish.location
          }
        }, (error) => {
          if (error) {
            console.log('Oops, unable to update the dish...');
          }
          else {
            console.log('Done!');
          }
        });
      };

      this.invite = (user) => {
        Meteor.call('invite', this.dish._id, user._id, (error) => {
          if (error) {
            console.log('Oops, unable to invite!');
          }
          else {
            console.log('Invited!');
          }
        });
      };

      this.canInvite = () => {
        if (!this.dish)
          return false;

        return !this.dish.public && this.dish.owner === Meteor.userId();
      };
    }
  }
});
