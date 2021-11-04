const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

//$ models
const User = require('./src/models/user');
const Post = require('./src/models/post');
const Comment = require('./src/models/comment');
const Notification = require('./src/models/notification');
const Message = require('./src/models/message');
const MessageThread = require('./src/models/messageThread');

require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const typeDefs = gql`
  type User {
    username: String!
    displayName: String!
    password: String!
    theme: String
    bio: String
    avatar: String
    banner: String
    id: ID!
    posts: [Post]
    notifications: [Notification]
    messages: [MessageThread]
    followers: [User]
    following: [User]
  }

  type Post {
    id: ID!
    image: String!
    caption: String
    likes: [User]
    comments: [Comment]
    user: User!
  }

  type Comment {
    id: ID!
    comment: String!
    date: String!
    user: User!
    post: Post!
  }

  type Notification {
    id: ID!
    type: String!
    user: User!
    post: Post!
  }

  type Message {
    id: ID!
    message: String!
    date: String!
    user: User!
  }

  type MessageThread {
    id: ID!
    messages: [Message]
    user: User!
    date: String!
  }

  type Mutation {
    addUser(
      username: String!
      displayName: String!
      password: String!
      theme: String!
      bio: String!
      avatar: String!
      banner: String!
    ): User

    addPost(image: String!, caption: String, user: ID!): Post
    addComment(comment: String!, post: ID!, user: ID!): Comment

    addMessage(message: String!, user: ID!, date: String!): Message
  }

  type Query {
    usersCount: Int!
    allUsers: [User!]!
    findUser(username: String, id: ID): User

    findUserPosts(user: ID!): [Post]
    findPost(id: ID!): Post

    findPostComments(post: ID!): [Comment]

    findMessageThreads(user: ID!): [MessageThread]
    findMessages(user: ID!): [Message]

    findNotifications(user: ID!): [Notification]
  }
`;

const resolvers = {
  //! QUERIES
  Query: {
    //$ user queries
    usersCount: () => User.collection.countDocuments(),
    allUsers: async (root, args) => {
      try {
        const result = await User.find({});
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    findUser: async (root, args) => {
      if (args.id) {
        try {
          const result = await User.findById(args.id).populate({
            path: 'posts',
            limit: 9,
            options: { sort: { date: -1 } },
          });
          return result;
        } catch (error) {
          console.log(error);
        }
      } else if (args.username) {
        try {
          const result = await User.findOne({ username: args.username });
          return result;
        } catch (error) {
          console.log(error);
        }
      }
    },
    //# post queries
    findUserPosts: async (root, args) => {
      const result = await Post.find({ user: args.user })
        .limit(9)
        .sort({ date: -1 });
      return result;
    },
    findPost: async (root, args) => {
      const result = await Post.findOne({ id: args.id })
        .populate('user')
        .populate({
          path: 'comments',
          limit: 10,
          options: { sort: { date: -1 } },
          populate: {
            path: 'user',
          },
        });
      return result;
    },
    //% comment queries
    findPostComments: async (root, args) => {
      const result = await Comment.find({ post: args.post })
        .populate('user')
        .sort({
          date: -1,
        })
        .limit(10);
      return result;
    },
    //+ message queries
    findMessageThreads: async (root, args) => {
      const result = await MessageThread.find({ user: args.user }).sort({
        date: -1,
      });
      return result;
    },
    findMessages: async (root, args) => {
      const result = await Message.find({ user: args.user })
        .limit(20)
        .sort({ date: -1 });
      return result;
    },
    //- notification queries
    findNotifications: async (root, args) => {
      const result = await Notification.find({ user: args.user }).sort({
        date: -1,
      });
      return result;
    },
  },
  //! MUTATIONS
  Mutation: {
    //$ user mutations
    addUser: (root, args) => {
      const user = new User({ ...args });
      return user.save();
    },
    //# post mutations
    addPost: async (root, args) => {
      const post = new Post({ ...args });
      const result = await post.save();
      const user = await User.findOneAndUpdate(
        { _id: args.user },
        { $push: { posts: result._id } },
        { new: true }
      );
      return result;
    },
    //& comment mutations
    addComment: async (root, args) => {
      const comment = new Comment({ ...args });
      const result = await comment.save();
      const post = await Post.findOneAndUpdate(
        { id: args.post },
        { $push: { comments: result._id } },
        { new: true }
      );
      return post;
    },
    //- message mutations
    addMessage: async (root, args) => {
      const message = new Message({ ...args });
      const result = await message.save();
      return result;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
