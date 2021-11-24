const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./src/models/user');
const Post = require('./src/models/post');
const Notification = require('./src/models/notification');
require('dotenv').config();

const { makeExecutableSchema } = require('@graphql-tools/schema');
const { createServer } = require('http');

const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');

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
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET_KEY);
        try {
          const result = await User.findById(decodedToken.userId);
          // get noti
          const noti = await Notification.find({
            user: result._id,
            seen: false,
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
          result.notiCount = noti.length;
          return { currentUser: result };
        } catch (error) {
          throw new Error(error);
        }
      }
    },
  });

  //$ subscription
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      async onConnect(connectionParams, webSocket) {
        console.log('subscription auth');
        if (connectionParams.authorization) {
          const decodedToken = jwt.verify(
            connectionParams.authorization.substring(7),
            JWT_SECRET_KEY
          );
          const userId = decodedToken.userId;
          return { userId };
        }
      },
      onDisconnect: () => console.log('Websocket CONNECTED'),
    },

    {
      server: httpServer,
      // This `server` is the instance returned from `new ApolloServer`.
      path: server.graphqlPath,
    }
  );

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb' }));

  await server.start();
  server.applyMiddleware({ app, path: '/' });
  // Modified server startup
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();
