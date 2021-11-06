const { gql } = require('apollo-server');
const User = require('../../models/user');
const Post = require('../../models/post');
const mongoose = require('mongoose');

// returns userProfile type which uses profilePost type

const typeDefs = gql`
  type Query {
    findUser(id: ID): UserProfile
  }
`;

const resolvers = {
  Query: {
    findUser: async (root, args) => {
      try {
        const result = await User.findById(args.id).populate({
          path: 'posts',
          limit: 9,
          options: { sort: { date: -1 } },
        });
        // convert id to mongoose object, for aggregation
        const id = mongoose.Types.ObjectId(args.id);
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
          const id = mongoose.Types.ObjectId(post._id);
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
        return result;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
