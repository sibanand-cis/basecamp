Template.configureLoginServiceDialogForBasecamp.siteUrl = function () {
  return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForBasecamp.fields = function () {
  return [
    {property: 'clientId', label: 'Client ID'},
    {property: 'secret', label: 'Client secret'}
  ];
};