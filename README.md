# SchematicsTesting

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.3.

This is a showcase repository on how to test or debug schematics.

It was created to follow this blog post: TODO:link

## Build

Run `yarn build:schematics` to build the projects/schematics. The build artifacts will be stored in the `dist/` directory.

## Publishing

To locally publish the projects/schematics to verdaccio, run `./node_modules/ts-node/dist/bin.js ./scripts/publish.js`.
The script will build and publish projects/schematics to verdaccio.

## Running unit tests

Run `yarn test` to execute the unit tests via [Jest](https://jestjs.io).
