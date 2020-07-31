const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const routes = require("./routes/register");

require("dotenv").config();

const startServer = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  try {
    const res = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `Connected to Mongo! Database name: "${res.connections[0].name}"`
    );
  } catch (err) {
    console.error(`Error connecting to mongo ${err}`);
  }

  const server = new ApolloServer({ typeDefs, resolvers });

  const app = express();
  server.applyMiddleware({ app });

  app.use(
    cors({
      credentials: true,
      origin: [
        "http://localhost:3000",
        "https://distracted-noyce-fee0e2.netlify.com",
        "https://leadminerapp.herokuapp.com",
      ], //Swap this with the client url
    })
  );

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use("/", routes);

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
