const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MEVN Learning Platform API",
      version: "1.0.0",
      description: "Documentation de l'API backend pour la plateforme MEVN",
    },
    servers: [{ url: "http://localhost:5000/api" }],
  },
  apis: ["./routes/*.js", "./models/*.js"],
};

module.exports = swaggerJsdoc(options);
