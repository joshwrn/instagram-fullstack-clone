const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./src/models/user');
const Post = require('./src/models/post');
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
      console.log('auth attempt', auth);
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET_KEY);
        try {
          const result = await User.findById(decodedToken.userId).populate({
            path: 'posts',
            limit: 9,
            options: { sort: { date: -1 } },
          });
          // convert id to mongoose object, for aggregation
          const id = mongoose.Types.ObjectId(decodedToken.userId);
          const stats = await User.aggregate([
            { $match: { _id: id } },
            {
              $project: {
                id: 1,
                total_followers: { $size: '$followers' },
                total_following: { $size: '$following' },
                total_posts: { $size: '$posts' },
              },
            },
          ]);
          result.followerCount = stats[0].total_followers;
          result.followingCount = stats[0].total_following;
          result.postCount = stats[0].total_posts;
          return { currentUser: result };
        } catch (error) {
          console.log(error);
        }
      }
    },
  });
  app.use(graphqlUploadExpress());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb' }));

  await server.start();
  server.applyMiddleware({ app, path: '/' });
  // Modified server startup
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();
