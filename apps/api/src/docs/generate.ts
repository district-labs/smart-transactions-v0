import swaggerAutogen from 'swagger-autogen';

const doc = {
openapi: "3.1.0",
    info: {
      title: "Intentify API",
      version: "0.1.0",
      description:
        "This is the API for Intentify, an app that enables the creation of web3 intents.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "District Labs",
        url: "https://districtfinance.io/",
        email: "contact@districtlabs.org",
      },
    },
    servers: [
      {
        url: "https://api.districtfinance.io/",
        description: "Production server",
      },
      {
        url: "http://localhost:3002/",
        description: "Local server",
      }
    ],
};

const outputFile = './src/docs/swagger-output.json';
const routes = ['./src/server.ts'];


/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc);