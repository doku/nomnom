Dishes = new Mongo.Collection("dishes");

Dishes.allow({
  insert: function (userId, dish) {
    return userId && dish.owner === userId;
  },
  update: function (userId, dish, fields, modifier) {
    return userId && dish.owner === userId;
  },
  remove: function (userId, dish) {
    return userId && dish.owner === userId;
  }
});

let getContactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;

  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;

  return null;
};

Meteor.methods({
  invite: function (dishId, userId) {
    check(dishId, String);
    check(userId, String);

    let dish = Dishes.findOne(dishId);

    if (!dish)
      throw new Meteor.Error(404, "No such dish!");

    if (dish.owner !== this.userId)
      throw new Meteor.Error(404, "No permissions!");

    if (dish.public)
      throw new Meteor.Error(400, "That dish is public. No need to invite people.");

    if (userId !== dish.owner && !_.contains(dish.invited, userId)) {
      Dishes.update(dishId, {$addToSet: {invited: userId}});

      let from = getContactEmail(Meteor.users.findOne(this.userId));
      let to = getContactEmail(Meteor.users.findOne(userId));

      if (Meteor.isServer && to) {
        Email.send({
          from: "noreply@socially.com",
          to: to,
          replyTo: from || undefined,
          subject: "DISH: " + dish.title,
          text: "Hey, I just invited you to '" + dish.title + "' on Nom." +
          "\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
        });
      }
    }
  },
  heart: function (dishId, heart) {
    check(dishId, String);
    check(heart, String);

    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in to RSVP");

    if (!_.contains(['1', '2', '3', '4', '5'], heart))
      throw new Meteor.Error(400, "Invalid Hearts");

    let dish = Dishes.findOne(dishId);

    if (!dish)
      throw new Meteor.Error(404, "No such dish");

    if (!dish.public && dish.owner !== this.userId )
      throw new Meteor.Error(403, "No such dish"); // its private, but let's not tell this to the user

    let heartIndex = _.indexOf(_.pluck(dish.hearts, 'user'), this.userId);

    if (heartIndex !== -1) {
      // update existing heart entry
      if (Meteor.isServer) {
        // update the appropriate heart entry with $
        Dishes.update(
          {_id: dishId, "hearts.user": this.userId},
          {$set: {"hearts.$.heart": heart}});
      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        let modifier = {$set: {}};
        modifier.$set["hearts." + heartIndex + ".heart"] = heart;

        Dishes.update(dishId, modifier);
      }
    } else {
      // add new heart entry
      Dishes.update(dishId,
        {$push: {hearts: {user: this.userId, heart: heart}}});
    }
  }
});
