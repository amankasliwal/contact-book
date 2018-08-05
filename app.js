const express = require('express')
const app = express()
const models = require('./db/models');
const port = process.env.PORT || 8081;
const env = process.env.NODE_ENV || "development";
const contactRoute = require("./routes/contact")
var bodyParser = require('body-parser');
var authMiddleware = require('./middlewares/auth');

startServer = () => {
  models.sequelize.sync().then(function () {
    app.listen(port, function () {
      console.info("Contacts server listening on port " + port + " in " + env + " mode");
    })
  });
};

initMiddlewares = () => {
  app.use(bodyParser.urlencoded({ extended: true }));// configure app to use bodyParser()
  app.use(bodyParser.json());
  app.use('/', authMiddleware);

}

initRoutes = () => {
  app.get('/', (req, res) => res.send('UP'));
  app.use("/contacts", contactRoute);
}

startServer();
initMiddlewares();
initRoutes();

