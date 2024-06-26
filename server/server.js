const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;

// instance of Apollo server
const { ApolloServer } = require("@apollo/server");

// provide middleware function to hook into express
const { expressMiddleware } = require("@apollo/server/express4");

const { authMiddleWare } = require("./utils/auth");

// import the 2 parts of a Graphql schema
const { typeDefs, resolvers } = require("./schemas");

// create our Apollo server
const server = new ApolloServer({
  // need these 2 to create an apollo server
  typeDefs,
  resolvers,
});

// start the server
const startApolloServer = async () => {
  await server.start();

  // app.use registers the middleware with Express
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // here's where we using the middleware that the server provided us
  // mount the middleware onto the graphql endpoint
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleWare,
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  //app.use(routes);
  // open the db and start the mobil app
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();
