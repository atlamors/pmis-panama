const { withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
    name: 'host',
    remotes: {
        'scheduling': 'http://localhost:4201/remoteEntry.js'
    },
    shared: {
        '@angular/core': { singleton: true, strictVersion: true, requiredVersion: '20.3.0' },
        '@angular/common': { singleton: true, strictVersion: true, requiredVersion: '20.3.0' },
        '@angular/router': { singleton: true, strictVersion: true, requiredVersion: '20.3.0' },
        'rxjs': { singleton: true, strictVersion: true, requiredVersion: '7.8.2' },
        'zone.js': { singleton: true, strictVersion: true, requiredVersion: '0.15.1' },
    },
});


