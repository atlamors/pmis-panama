const { withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

/**
 * 1) MF plugin options
 * 2) Top-level webpack config
 */
module.exports = withModuleFederationPlugin({
    name: 'scheduling',
    filename: 'remoteEntry.js',
    exposes: { './Module': './src/remote-entry.ts' },
    shared: {
        '@angular/core': { singleton: true, strictVersion: true, requiredVersion: '20.3.0' },
        '@angular/common': { singleton: true, strictVersion: true, requiredVersion: '20.3.0' },
        '@angular/router': { singleton: true, strictVersion: true, requiredVersion: '20.3.0' },
        'rxjs': { singleton: true, strictVersion: true, requiredVersion: '7.8.2' },
        // do NOT share zone.js
    },
});
