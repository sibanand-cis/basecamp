Package.describe({
  summary: "Basecamp OAuth flow and client implementation of the Basecamp API"
});

Npm.depends( {
  "basecamp" : "0.2.0"
} );

Package.on_use(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Basecamp');

  api.add_files(
    ['basecamp_configure.html', 'basecamp_configure.js'],
    'client');

  api.add_files("basecamp-api.js", "server");

  api.add_files('basecamp_common.js', ['client', 'server']);
  api.add_files('basecamp_server.js', 'server');
  api.add_files('basecamp_client.js', 'client');
});