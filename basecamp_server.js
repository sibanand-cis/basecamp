var Oauth = Package.oauth.Oauth;

Basecamp = {};

Basecamp.whitelistedFields = ['first_name','last_name','email_address'];

Oauth.registerService('basecamp', 2, null, function(query) {
  var response = getTokens(query);
  var accessToken = response.accessToken;
  var identity = getIdentity(accessToken);

  var serviceData = {
    accessToken: accessToken,
    expiresAt: (+new Date) + (1000 * response.expiresIn),
    id: identity.accounts[0].id
  };


  var fields = _.pick(identity, Basecamp.whitelistedFields);
  _.extend(serviceData, fields);


  // only set the token in serviceData if it's there. this ensures
  // that we don't lose old ones (since we only get this on the first
  // log in attempt)
  if (response.refreshToken){
    serviceData.refreshToken = response.refreshToken;
  }
  return {
    serviceData: serviceData,
    options: {profile: {first_name: identity.first_name,last_name: identity.last_name}}
  };

});

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
// - refreshToken, if this is the first authorization request
var getTokens = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'basecamp'});
  if (!config)
    throw new ServiceConfiguration.ConfigError("Service not configured");

  var response;
  try {
    response = Meteor.http.post(
      "https://launchpad.37signals.com/authorization/token", {params: {
        type: "web_server",
        code: query.code,
        client_id: config.clientId,
        client_secret: config.secret,
        redirect_uri: Meteor.absoluteUrl("_oauth/basecamp?close"),
        grant_type: 'authorization_code'
      }});
  } catch (err) {
    throw new Error("Failed to complete OAuth handshake with Basecamp. " + err.message);
  }

  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Basecamp. " + response.data.error);
  } else {
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in
    };
  }
};

var getIdentity = function(accessToken){
  try {
    return HTTP.get(
      "https://launchpad.37signals.com/authorization.json",
      {params: {access_token: accessToken}}).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Basecamp. " + err.message),
                   {response: err.response});
  }
};

Basecamp.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
