angular.module('nom').filter('uninvited', function () {
  return function (users, dish) {
    if (!dish) {
      return false;
    }

    return _.filter(users, function (user) {
      return !(user._id == dish.owner || _.contains(dish.invited, user._id));
    });
  }
});
