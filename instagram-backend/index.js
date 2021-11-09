const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');
const cors = require(`cors`);
const jwt = require('jsonwebtoken');
const User = require('./src/models/user');
require('dotenv').config();

const { makeExecutableSchema } = require('@graphql-tools/schema');
const { createServer } = require('http');
const { graphqlUploadExpress } = require('graphql-upload');

const { typeDefs, resolvers } = require('./src/graphql/schema');

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

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
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET_KEY);
        const currentUser = await User.findById(decodedToken.userId);
        return { currentUser };
      }
    },
  });
  app.use(graphqlUploadExpress());

  await server.start();
  server.applyMiddleware({ app, path: '/' });
  // Modified server startup
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();
