// Request Basecamp credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Basecamp.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  } else if (!options) {
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'basecamp'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError("Service not configured"));
    return;
  }

  /*var credentialToken = Random.id();*/
  var credentialToken = Random.secret();
  var loginUrl =
        'https://launchpad.37signals.com/authorization/new' +
        '?type=web_server' +
        '&client_id=' + config.clientId +
        '&redirect_uri=' + Meteor.absoluteUrl('_oauth/basecamp?close')+
        '&state=' + credentialToken ;

  Oauth.initiateLogin(credentialToken, loginUrl, credentialRequestCompleteCallback);
};