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
          for (const post of result.posts) {
            const id = mongoose.Types.ObjectId(decodedToken.userId);
            const postStats = await Post.aggregate([
              { $match: { _id: id } },
              {
                $project: {
                  id: 1,
                  total_likes: { $size: '$likes' },
                  total_comments: { $size: '$comments' },
                },
              },
            ]);
            post.likeCount = postStats[0].total_likes;
            post.commentCount = postStats[0].total_comments;
          }
          return { currentUser: result };
        } catch (error) {
          console.log(error);
        }
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
