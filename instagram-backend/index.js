const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');
const cors = require(`cors`);

const { makeExecutableSchema } = require('@graphql-tools/schema');

const { createServer } = require('http');

const { graphqlUploadExpress } = require('graphql-upload');

const { typeDefs, resolvers } = require('./src/graphql/schema');

require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

async function startServer() {
  const app = express();
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const httpServer = createServer(app);

  const server = new ApolloServer({
    schema,
  });
  app.use(graphqlUploadExpress());

  await server.start();
  server.applyMiddleware({ app, path: '/' });
  // Modified server startup
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();

// server.listen().then(({ url }) => {
//   console.log(`Server ready at ${url}`);
// });
