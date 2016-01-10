angular.module('nom.browser').directive('addNewDishModal', function () {
  return {
    restrict: 'E',
    templateUrl: '/packages/nom-browser/client/dishes/add-new-dish-modal/add-new-dish-modal.html',
    controllerAs: 'addNewDishModal',
    controller: function ($scope, $stateParams, $reactive, $mdDialog) {
      $reactive(this).attach($scope);

      this.helpers({
        isLoggedIn: () => {
          return Meteor.userId() !== null;
        }
      });

      this.newDish = {};

      this.addNewDish = () => {
        this.newDish.owner = Meteor.userId();
        this.newDish.images = (this.newDish.images || {}).map((image) => {
          return image._id;
        });

        Dishes.insert(this.newDish);
        this.newDish = {};
        $mdDialog.hide();
      };

      this.close = () => {
        $mdDialog.hide();
      };

      this.addImages = (files) => {
        if (files.length > 0) {
          let reader = new FileReader();

          reader.onload = (e) => {
            $scope.$apply(() => {
              this.cropImgSrc = e.target.result;
              this.myCroppedImage = '';
            });
          };

          reader.readAsDataURL(files[0]);
        }
        else {
          this.cropImgSrc = undefined;
        }
      };

      this.saveCroppedImage = () => {
        if (this.myCroppedImage !== '') {
          Images.insert(this.myCroppedImage, (err, fileObj) => {
            if (!this.newDish.images) {
              this.newDish.images = [];
            }

            this.newDish.images.push(fileObj);
            this.cropImgSrc = undefined;
            this.myCroppedImage = '';
          });
        }
      };

      this.updateDescription = ($data, image) => {
        Images.update({_id: image._id}, {$set: {'metadata.description': $data}});
      };
    }
  }
});
