// swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TOY PROJECT 1 API",
      version: "1.0.0",
      description: "API for TOY PROJECT 1",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["server/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
