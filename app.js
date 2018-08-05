const express = require('express')
// const app = express()
const models = require('./db/models');
const port = process.env.PORT || 8081;
const env = process.env.NODE_ENV || "development";
const contactRoute = require("./routes/contact")
var bodyParser = require('body-parser');
var authMiddleware = require('./middlewares/auth');
const cluster = require("cluster");

initMiddlewares = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));// configure app to use bodyParser()
  app.use(bodyParser.json());
  app.use('/contacts', authMiddleware);

}

initRoutes = (app) => {
  app.get('/', (req, res) => res.send('UP'));
  app.use("/contacts", contactRoute);
}

startCluster = () => {
  if(cluster.isMaster) {
    let cpuCount = require('os').cpus().length;
    for (let i = 0; i < cpuCount; i += 1) {
      console.log("Forking worker ", i);
      cluster.fork();
    }
    models.sequelize.sync();
  } else {
    var app = express();
    initMiddlewares(app);
    initRoutes(app);
    app.disable('x-powered-by');
    app.listen(port, function () {
      console.info("Contacts server listening on port " + port + " in " + env + " mode");
    })
  }
};
startCluster();
