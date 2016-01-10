Meteor.startup(function () {
  if (Dishes.find().count() === 0) {
    var dishes = [
      {
        'name': 'Dubstep-Free Zone',
        'description': 'Fast just got faster with Nexus S.'
      },
      {
        'name': 'All dubstep all the time',
        'description': 'Get it on!'
      },
      {
        'name': 'Savage lounging',
        'description': 'Leisure suit required. And only fiercest manners.'
      }
    ];

    for (var i = 0; i < dishes.length; i++) {
      Dishes.insert(dishes[i]);
    }
  }
});
