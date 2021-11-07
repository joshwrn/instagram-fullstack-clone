const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');
import * as path from 'path';
import * as fs from 'fs';

const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload');

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();
  const app = express();
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });
  app.use(express.static(path.join(__dirname, './upload')));
  await new Promise((r) => app.listen({ port: 4000 }, r));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();

// server.listen().then(({ url }) => {
//   console.log(`Server ready at ${url}`);
// });
