const { gql, AuthenticationError } = require('apollo-server-express');

const { GraphQLUpload } = require('graphql-upload');
const { pubsub } = require('../subscriptions/pubSub');

const User = require('../../models/user');
const Post = require('../../models/post');
const Notification = require('../../models/notification');

// aws s3
const s3 = require('../../utils/config');
require('dotenv').config();

const typeDefs = gql`
  scalar Upload
  type Mutation {
    postUpload(caption: String, file: String!): ProfilePost!
    deletePost(id: ID!): String
    likePost(id: ID!, type: String!): String
  }
`;

const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    postUpload: async (parent, { file, caption }, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      console.log('uploading post');
      //@ upload to aws storage
      const bucketName = process.env.BUCKETNAME;
      const params = {
        Bucket: bucketName,
        Key: '',
        Body: '',
        ACL: 'public-read',
      };

      const buff = Buffer.from(file, 'base64');
      params.Body = buff;

      let timestamp = new Date().getTime();
      params.Key = `images/${context.currentUser.id}/${timestamp}.jpeg`;

      // upload the object.
      let imageFile = await s3.upload(params).promise().catch(console.log);

      // structure the response.
      let object = {
        key: params.Key,
        url: imageFile.Location,
      };

      //$ send to mongoDB
      const post = new Post({
        image: object.url,
        imageKey: object.key,
        caption: caption,
        user: context.currentUser.id,
      });
      const result = await post.save();
      await User.findOneAndUpdate(
        { _id: context.currentUser.id },
        { $push: { posts: result._id } },
        { new: true }
      );
      await result.populate('user');
      result.likeCount = 0;
      result.commentCount = 0;
      return result;
    },

    deletePost: async (parent, { id }, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      try {
        const post = await Post.findById(id);
        if (post.user.toString() !== currentUser.id) {
          throw new AuthenticationError('not authenticated');
        }

        const params = {
          Bucket: process.env.BUCKETNAME,
          Key: post.imageKey,
        };

        await s3.deleteObject(params).promise().catch(console.log);

        await post.remove();
        await User.findOneAndUpdate(
          { _id: currentUser.id },
          { $pull: { posts: id } }
        );
        return 'success';
      } catch (err) {
        throw new Error(err);
      }
    },

    likePost: async (parent, { id, type }, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      try {
        if (type === 'like') {
          const post = await Post.findById(id);
          if (post.likes.includes(currentUser.id)) {
            throw new AuthenticationError('already liked');
          }
          const curPost = await Post.findByIdAndUpdate(
            id,
            {
              $push: { likes: currentUser.id },
            },
            { new: true }
          );
          const noti = new Notification({
            user: post.user,
            post: curPost._id,
            type: 'like',
            from: currentUser.id,
            seen: false,
          });
          const savedNotification = await noti.save();
          await savedNotification.populate('user');
          pubsub.publish('NEW_NOTIFICATION', {
            newNotification: savedNotification,
          });
        } else if (type === 'unlike') {
          await Post.findByIdAndUpdate(id, {
            $pull: { likes: currentUser.id },
          });
        }
      } catch (err) {
        console.log(err);
        return 'error';
      }
      return 'success';
    },
  },
};

module.exports = { resolvers, typeDefs };
