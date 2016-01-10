angular.module('nom').directive('dishesList', function () {
  return {
    restrict: 'E',
    templateUrl: () => {
      if (Meteor.isCordova) {
        return '/packages/nom-mobile/client/dishes/dishes-list/dishes-list.html';
      }

      return '/packages/nom-browser/client/dishes/dishes-list/dishes-list.html';
    },
    controllerAs: 'dishesList',
    controller: function ($scope, $reactive, $mdDialog, $filter) {
      $reactive(this).attach($scope);

      this.perPage = 3;
      this.page = 1;
      this.sort = {
        name: 1
      };
      this.orderProperty = '1';
      this.searchText = '';

      this.helpers({
        dishes: () => {
          return Dishes.find({}, { sort : this.getReactively('sort') });
        },
        users: () => {
          return Meteor.users.find({});
        },
        dishesCount: () => {
          return Counts.get('numberOfDishes');
        },
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        },
        currentUserId: () => {
          return Meteor.userId();
        },
        images: () => {
          return Images.find({});
        }
      });

      this.subscribe('images');

      this.map = {
        center: {
          latitude: 45,
          longitude: -73
        },
        options: {
          maxZoom: 10,
          styles: [{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#444444"}]
          }, {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{"color": "#f2f2f2"}]
          }, {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
          }, {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{"saturation": -100}, {"lightness": 45}]
          }, {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{"visibility": "simplified"}]
          }, {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{"visibility": "off"}]
          }, {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
          }, {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
          }]
        },
        zoom: 8
      };

      this.subscribe('users');

      this.subscribe('dishes', () => {
        return [
          {
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText')
        ]
      });

      this.removeDish = (dish) => {
        Dishes.remove({_id: dish._id});
      };

      this.pageChanged = (newPage) => {
        this.page = newPage;
      };

      this.updateSort = () => {
        this.sort = {
          name: parseInt(this.orderProperty)
        }
      };

      this.getDishCreator = function (dish) {
        if (!dish) {
          return '';
        }

        let owner = Meteor.users.findOne(dish.owner);

        if (!owner) {
          return 'nobody';
        }

        if (Meteor.userId() !== null && owner._id === Meteor.userId()) {
          return 'me';
        }

        return owner;
      };

      this.heart = (dishId, heart) => {
        Meteor.call('heart', dishId, heart, (error) => {
          if (error) {
            console.log('Oops, unable to heart!');
          }
          else {
            console.log('Heart Done!');
          }
        });
      };

      this.getUserById = (userId) => {
        return Meteor.users.findOne(userId);
      };

      this.outstandingInvitations = (dish) => {
        return _.filter(this.users, (user) => {
          return (_.contains(dish.invited, user._id) && !_.findWhere(dish.hearts, {user: user._id}));
        });
      };

      this.openAddNewDishModal = function () {
        $mdDialog.show({
          template: '<add-new-dish-modal></add-new-dish-modal>',
          clickOutsideToClose: true
        });
      };

      this.isHEART = (heart, dish) => {
        if (Meteor.userId() == null) {
          return false;
        }

        let heartIndex = dish.myHeartIndex;
        heartIndex = heartIndex || _.indexOf(_.pluck(dish.hearts, 'user'), Meteor.userId());

        if (heartIndex !== -1) {
          dish.myHeartIndex = heartIndex;
          return dish.hearts[heartIndex].heart === heart;
        }
      };

      this.getMainImage = (images, onlyUrl) => {
        if (images && images.length && images[0] && images[0]) {
          var url = $filter('filter')(this.images, {_id: images[0]})[0].url();

          if (onlyUrl) {
            return url;
          }

          return {
            "background-image": "url('" + url + "')"
          }
        }
      };
    }
  }
});
